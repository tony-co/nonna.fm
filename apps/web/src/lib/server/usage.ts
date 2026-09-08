import "server-only";
import { createHash } from "node:crypto";
import { createUsageKey } from "@/lib/redis";

export function getUsageKey(request: Request): string | null {
  const userId = request.headers.get("x-user-id");
  if (!userId || userId.length > 512 || !/^(spotify|apple|youtube):[^\s]+$/.test(userId))
    return null;
  return createUsageKey(createHash("sha256").update(userId).digest("hex"));
}
