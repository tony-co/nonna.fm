import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_STORAGE_KEYS, type AuthData, getAuthData, setAuthData } from "@/lib/auth/constants";
import { encrypt, initializeEncryption } from "@/lib/auth/crypto";
import { validateOAuthState } from "@/lib/auth/state";
import { getSpotifyAuthData } from "@/lib/services/spotify/auth";
import { getYouTubeAuthData } from "@/lib/services/youtube/auth";

beforeEach(() => {
  localStorage.clear();
  initializeEncryption();
});
afterEach(() => {
  vi.unstubAllGlobals();
});
describe("OAuth state", () => {
  const state = { role: "target", value: "random-nonce-12345678" };
  it("requires the complete nonce, not just the role", () => {
    localStorage.setItem(AUTH_STORAGE_KEYS.TARGET.STATE, encrypt(JSON.stringify(state)));
    expect(
      validateOAuthState(JSON.stringify({ ...state, value: "forged-nonce-12345678" }))
    ).toBeNull();
    expect(validateOAuthState(JSON.stringify(state))).toEqual({ role: "target" });
  });
  it("selects state by role even when stale source state exists", () => {
    localStorage.setItem(
      AUTH_STORAGE_KEYS.SOURCE.STATE,
      encrypt(JSON.stringify({ role: "source", value: "old-source-12345678" }))
    );
    localStorage.setItem(AUTH_STORAGE_KEYS.TARGET.STATE, encrypt(JSON.stringify(state)));
    expect(validateOAuthState(JSON.stringify(state))).toEqual({ role: "target" });
  });
  it.each([null, "{", "null", '{"role":"admin","value":"nonce"}'])(
    "rejects malformed state %s",
    state => {
      expect(validateOAuthState(state)).toBeNull();
    }
  );
  it("tolerates corrupt stored authentication", () => {
    localStorage.setItem(AUTH_STORAGE_KEYS.SOURCE.TOKEN, "{");
    expect(getAuthData("source")).toBeNull();
  });
});

describe("token refresh", () => {
  const auth: AuthData = {
    accessToken: "old",
    refreshToken: "refresh",
    expiresIn: 3600,
    timestamp: 0,
    userId: "user",
    tokenType: "Bearer",
    role: "target",
    serviceId: "spotify",
  };
  it("coalesces parallel refreshes", async () => {
    setAuthData("target", auth);
    const fetch = vi
      .fn()
      .mockResolvedValue(
        Response.json({ access_token: "new", expires_in: 3600, token_type: "Bearer" })
      );
    vi.stubGlobal("fetch", fetch);
    const results = await Promise.all([getSpotifyAuthData("target"), getSpotifyAuthData("target")]);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(results[0]?.accessToken).toBe("new");
    expect(results[1]?.accessToken).toBe("new");
  });
  it("does not clear a replacement session after an old refresh finishes", async () => {
    setAuthData("target", { ...auth, serviceId: "youtube" });
    let resolve!: (response: Response) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(
        () =>
          new Promise<Response>(done => {
            resolve = done;
          })
      )
    );
    const refreshing = getYouTubeAuthData("target");
    setAuthData("target", { ...auth, serviceId: "apple", accessToken: "replacement" });
    resolve(Response.json({ access_token: "old-youtube-refresh", expires_in: 3600 }));
    expect(await refreshing).toBeNull();
    expect(getAuthData("target")?.accessToken).toBe("replacement");
  });

  it("does not return expired tokens without a refresh token", async () => {
    setAuthData("target", { ...auth, refreshToken: undefined });
    expect(await getSpotifyAuthData("target")).toBeNull();
  });
});
