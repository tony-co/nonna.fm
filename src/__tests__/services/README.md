# Service API Tests

This directory contains tests for the various music streaming service APIs used in the application.

## Spotify Tests

The Spotify tests require a valid Spotify account with some data (playlists, saved tracks, albums) and authentication credentials.

### Environment Setup

1. Add the following testing variables to your `.env` file:

```
# Required for all Spotify tests
SPOTIFY_TEST_REFRESH_TOKEN=your_spotify_refresh_token

# Required for specific playlist/album tests
TEST_SPOTIFY_PLAYLIST_ID=a_valid_playlist_id
TEST_SPOTIFY_ALBUM_ID=a_valid_album_id

# Required for OAuth flow tests (use values from your app's Spotify Developer Dashboard)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The test setup uses `@next/env` to load these environment variables automatically.

> **Note:** If you need to keep your Spotify credentials private (e.g., in a shared repository), you can use `.env.local` instead, which will be ignored by git.

### Getting a Refresh Token

To get a refresh token for testing:

1. Go to the Spotify Developer Dashboard and log in with your test account
2. Create a new app (or use your existing app)
3. Set the redirect URI to `http://localhost:3000/callback/spotify`
4. Make a note of the client ID and client secret
5. Use the OAuth authorization flow in the app to log in, or use a tool like the [Spotify OAuth Flow Helper](https://github.com/bih/spotify-oauth-flow-helper)
6. Extract the refresh token from the response

### Running the Tests

Run the tests using Vitest:

```bash
# Run all tests
npm test

# Run just the Spotify tests
npm test -- src/test/services/spotify

# Run a specific test file
npm test -- src/test/services/spotify/api.test.ts

# Run tests in watch mode
npm test -- --watch
```

## Test Coverage

These tests make real API calls to the Spotify service, which means:

1. They require valid credentials
2. They may be affected by rate limiting
3. They depend on the test account having the expected data

The tests are designed to skip gracefully if credentials or test data are not available.

## Adding Tests for Other Services

When adding tests for other services (Apple Music, YouTube Music, etc.), follow the same pattern:

1. Create a directory for the service: `src/test/services/[service]/`
2. Create tests for each main file (api.test.ts, auth.test.ts, etc.)
3. Add required environment variables to the `.env` file
4. Document the setup process in this README
