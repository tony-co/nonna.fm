---
description:
globs:
alwaysApply: false
---

# Redis & Paddle Integration Plan

This document outlines the strategy for integrating Redis for usage tracking and Paddle for premium subscriptions in nonna.fm, focusing on a user experience without traditional accounts.

## 1. Redis Implementation

Redis will be used for tracking daily usage limits for free users and managing premium status linked to verified emails.

### 1.1 Data Structure

We will use distinct key prefixes to organize data:

#### Free Tier Usage (Key: `usage:<platform_id_hash>`)

- **Purpose:** Tracks daily transfer counts for free users tied to a specific platform session.
- **Type:** `STRING` (used as a counter)
- **Key Format:** `usage:sha256(<platform_user_id>)`
  - Note: The SHA-256 hash of the user's unique ID on the target music platform (e.g., Spotify User ID, Apple Music User Token) identifies the user _on that platform_. A user using a different platform will get a separate 300-track limit. This is acceptable for the free tier.
- **Value:** Integer representing the number of tracks transferred _today_ by this user on this platform.
- **TTL:** 86400 seconds (24 hours). Set upon the first increment of the day.

#### Premium Tier Status (Key: `premium:<user_email>`)

- **Purpose:** Stores the premium status and details linked to a verified user email. This is the persistent record across platforms and sessions.
- **Type:** `HASH`
- **Key Format:** `premium:<email_address>` (e.g., `premium:user@example.com`)
- **Value Fields:**
  - `status`: (String) Current status from Paddle (e.g., "active", "canceled", "past_due", "inactive").
  - `plan`: (String) Identifier for the plan (e.g., "monthly", "yearly", "one-time").
  - `limit`: (Integer) Daily transfer limit for this plan (e.g., 3000).
  - `expires_at`: (String - ISO 8601 Timestamp) The exact time when access expires. Null or a far-future date for non-expiring plans (like lifetime/one-time). Access is valid _until_ this time.
  - `paddle_customer_id`: (String) Paddle's customer ID. Useful for support and API lookups.
  - `paddle_subscription_id`: (String, Optional) Paddle's subscription ID if applicable. Useful for managing subscription-specific actions.
- **TTL:** None. Persistence is managed by application logic based on `expires_at` and webhook updates.

#### Magic Link Tokens (Key: `magic:<token>`)

- **Purpose:** Temporarily stores verification tokens sent via email.
- **Type:** `STRING`
- **Key Format:** `magic:<secure_random_token>` (e.g., `magic:a1b2c3d4e5f6...`)
- **Value:** The email address associated with this verification attempt.
- **TTL:** 900 seconds (15 minutes).

#### Webhook Idempotency (Key: `webhook:event:<event_id>`)

- **Purpose:** Prevents processing the same Paddle webhook event multiple times.
- **Type:** `STRING`
- **Key Format:** `webhook:event:<paddle_event_id>`
- **Value:** `processed` (or a timestamp can be used).
- **TTL:** 172800 seconds (48 hours). Should be longer than Paddle's webhook retry window.

### 1.2 Usage Tracking Logic (Free Tier)

This logic runs server-side when a transfer is initiated.

1.  **Get Platform User ID Hash:** When a user initiates a transfer, the backend receives the _current_, active platform OAuth token and uses it to fetch the user's unique ID for that platform (e.g., via `/me` endpoint). Calculate the SHA-256 hash of this platform-specific User ID.
2.  **Construct Key:** `key = "usage:" + hash`
3.  **Atomically Increment & Set TTL:** Use a Redis transaction or Lua script for atomicity.
    - `current_usage = await redis.incr(key)`
4.  **Check Limit:** Compare `current_usage` against the free limit (300). If `current_usage > 300`, the transfer for the current track (and subsequent ones in this request) should be denied _for this user on this platform_. Note: The counter _is_ incremented even if it exceeds the limit, correctly reflecting usage for subsequent checks within the TTL.

### 1.3 Premium Status Check

This logic runs server-side, typically via middleware protecting premium features or API routes.

1.  **Identify User:** Retrieve the user's verified email from their active session (established via magic link and stored in a secure HTTP-only cookie).
2.  **Construct Key:** `key = "premium:" + email`
3.  **Fetch Data:** `premium_data = await redis.hgetall(key)`
4.  **Validate:**
    - `if not premium_data:` return `false` (no premium record).
    - `if premium_data.status != "active":` return `false`.
    - `if premium_data.expires_at and new Date(premium_data.expires_at) <= new Date():` return `false`.
    - Return `true` (user is premium and active). The specific `limit` (e.g., 3000) can also be retrieved from `premium_data`.

### 1.4 Transfer Limit Enforcement (Combining Free & Premium)

This involves both frontend UX and backend validation.

1.  **Frontend - Get State:** On the library/transfer page load, the frontend calls a dedicated API endpoint (e.g., `/api/user/status`) which performs steps 1.2 (for free) and 1.3 (if session cookie exists) to determine:
    - `isPremium`: boolean
    - `dailyLimit`: number (300 or 3000)
    - `currentUsage`: number (0 for premium, count from `usage:<hash>` for free)
    - `availableToday`: `dailyLimit - currentUsage`
2.  **Frontend - Display Counter:** Display the usage near the transfer button (e.g., "Transfers used today: `currentUsage` / `dailyLimit`").
3.  **Frontend - Selection Dialog:**
    - When the user adds tracks to their selection, the frontend maintains `selectedCount`.
    - Calculate `potentialTotal = currentUsage + selectedCount`.
    - `if potentialTotal > dailyLimit:`
      - Show a modal dialog.
      - **Dialog Content:**
        - "You've selected `selectedCount` tracks, but your `dailyLimit` limit allows `availableToday` more transfers today."
        - **Option 1 (Button):** "Transfer First `availableToday` Tracks" (Enabled only if `availableToday > 0`).
        - **Option 2 (Button):** "Upgrade to Premium (3000 Tracks/Day)" (Always shown, links to Paddle checkout initiation).
        - (Optional: Text explaining the free limit if `!isPremium`).
4.  **Frontend - Initiate Transfer:** When the user clicks the main "Transfer" button:
    - If `currentUsage >= dailyLimit` and `!isPremium`: Show the dialog directly, emphasizing the "Upgrade" option.
    - Otherwise, send the selected track list to the backend API (`/api/transfer`).
5.  **Backend - Transfer API (`/api/transfer`):**
    - **Re-verify Status:** Re-run the status check (steps 1.2/1.3) to get the definitive `dailyLimit` and `currentUsage` _at the time of transfer_. Calculate `available = dailyLimit - currentUsage`.
    - **Handle Limit:**
      - `tracks_to_transfer = min(selectedTracks.length, max(0, available))`
      - Slice the incoming track list: `transferList = selectedTracks.slice(0, tracks_to_transfer)`
      - `skippedTracks = selectedTracks.slice(tracks_to_transfer)`
    - **Perform Transfer:** Process the `transferList`.
    - **Increment Usage (Free Tier Only):** If `!isPremium`, increment the `usage:<platform_user_id_hash>` counter _after_ the transfer attempt (ideally per track, but batch incrementing `tracks_to_transfer` count is simpler): `await redis.incrby(usageKey, transferList.length)`. Ensure TTL is set if it's the first increment.
    - **Return Response:** Send back a JSON response detailing success/failure, including:
      - `transferredTracks`: List of tracks successfully processed.
      - `skippedTracks`: List of tracks not processed due to limits.
      - `reasonForSkip`: "Daily limit reached."
      - `newUsage`: Updated usage count for the frontend.

## 2. Paddle Integration

This section details the interaction with Paddle for handling payments and updating user status in Redis.

### 2.1 Checkout Flow

1.  **Trigger:** User clicks an "Upgrade" or "Go Premium" button.
2.  **Frontend Request:** Sends a request to `/api/paddle/checkout` (POST) with the `priceId` of the desired Paddle product/plan.
3.  **Backend (`/api/paddle/checkout`):**
    - Instantiate the Paddle Node SDK.
    - Optionally, retrieve the user's email from their _active session cookie_ (if they previously verified via magic link) and pass it as `customer.email` to pre-fill Paddle's checkout form.
    - Create a Paddle Transaction:
      ```javascript
      const transaction = await paddle.transactions.create({
        items: [{ price_id: priceId, quantity: 1 }],
        // customer: { email: userEmailFromSession }, // Optional pre-fill
        // custom_data: { userId: internalUserId }, // Optional, if you have one
        return_url: "https://nonna.fm/transfer/success", // Redirect after payment
      });
      ```
    - Return the `transaction.checkout.url` to the frontend.
4.  **Frontend Redirect:** `window.location.href = checkoutUrl;`

### 2.2 Webhook Handling (`/api/paddle/webhook`)

This is the critical endpoint for automatically granting premium access.

1.  **Route:** `src/app/api/paddle/webhook/route.ts` (App Router) or `src/pages/api/paddle/webhook.ts` (Pages Router). Handle `POST` requests.
2.  **Security - Signature Verification:**
    - Read the raw request body.
    - Get the `Paddle-Signature` header.
    - Use `paddle.webhooks.unmarshal(rawBody, webhookSecret, signatureHeader)` from the SDK. This throws an error if the signature is invalid. Wrap in a `try...catch`. If verification fails, `return new Response("Invalid signature", { status: 400 });`
3.  **Idempotency:**
    - `eventId = validatedEvent.event_id;`
    - `eventKey = "webhook:event:" + eventId;`
    - `processed = await redis.set(eventKey, "processed", "NX", "EX", 172800);`
    - `if (!processed) { return new Response("Event already processed", { status: 200 }); }` // Success, but do nothing more.
4.  **Process Events:** Use `switch (validatedEvent.event_type)`:
    - **`transaction.completed`:**
      - Suitable for **one-time purchases**.
      - Extract data: `email = validatedEvent.data.customer.email`, `customerId = validatedEvent.data.customer_id`, `items = validatedEvent.data.items`.
      - Determine `plan` (e.g., "one-time") and `limit` (3000) based on `items[0].price.id`.
      - Set `expires_at` to null or a far-future date for lifetime access.
      - Update Redis: `await redis.hset("premium:" + email, { status: "active", plan: "one-time", limit: 3000, expires_at: null, paddle_customer_id: customerId });`
    - **`subscription.created` / `subscription.updated`:**
      - Suitable for **recurring subscriptions**.
      - Extract data: `email = validatedEvent.data.customer.email` (or fetch customer via API using `customer_id`), `customerId = validatedEvent.data.customer_id`, `subscriptionId = validatedEvent.data.id`, `status = validatedEvent.data.status`, `planId = validatedEvent.data.items[0].price.id`, `expires_at = validatedEvent.data.current_billing_period.ends_at`.
      - Determine `plan` name (e.g., "monthly") based on `planId`.
      - Update Redis: `await redis.hset("premium:" + email, { status: status, plan: planName, limit: 3000, expires_at: expires_at, paddle_customer_id: customerId, paddle_subscription_id: subscriptionId });`
      - Handle different `status` values appropriately (only "active" grants access).
    - **`subscription.canceled`:**
      - Extract `email`, `subscriptionId`.
      - Update Redis: `await redis.hset("premium:" + email, { status: "canceled" });` // Optionally update expires_at if provided and relevant. Access check relies on expires_at.
5.  **Acknowledge:** `return new Response("Webhook processed", { status: 200 });`

### 2.3 Magic Link Flow (Activating Premium on New Sessions)

1.  **Trigger:** User is not recognized as premium (no valid session cookie) but believes they should be (e.g., hit limit, manually clicks "Activate Premium").
2.  **Frontend Prompt:** Show a form: "Enter the email used for your premium purchase: [input]".
3.  **Frontend Request:** Submit email to `/api/auth/request-magic-link` (POST).
4.  **Backend (`/api/auth/request-magic-link`):**
    - **Rate Limit:** Apply strict rate limiting per email and IP.
    - **Validate Email:** Basic format check.
    - **Check Premium Status:** `premium_data = await redis.hgetall("premium:" + email);` Check if `premium_data` exists and indicates active status (`status === "active"` and `expires_at` is valid). If not, return error "Premium account not found or inactive for this email."
    - **Generate Token:** `token = crypto.randomBytes(32).toString("hex");`
    - **Store Token:** `await redis.set("magic:" + token, email, "EX", 900);` (15 min TTL)
    - **Send Email:** Use a transactional email service (e.g., Vercel Email, Resend) to send an email to the user with a link: `https://nonna.fm/api/auth/verify-magic-link?token=${token}`.
    - **Return Success:** Respond to frontend: "Verification email sent. Please check your inbox."
5.  **User Action:** Clicks the link in the email.
6.  **Backend (`/api/auth/verify-magic-link` - GET):**
    - Extract `token` from query params.
    - **Verify & Consume Token:** Atomically get and delete the token: `email = await redis.getdel("magic:" + token);`
    - `if (!email) { return new Response("Invalid or expired token", { status: 400 }); }`
    - **Re-verify Premium:** Double-check `premium:<email>` status in Redis just in case.
    - **Create Session:** Use a session library (like `next-auth` simplified, `iron-session`, or custom JWT). Create session data: `{ email: email, isPremium: true, premiumCheckedAt: Date.now() }`.
    - **Set Cookie:** Set a secure, HTTP-only session cookie containing the encrypted/signed session data.
    - **Redirect:** Redirect user to the main app page (e.g., `/library` or `/transfer`) `return Response.redirect(new URL('/library', req.url));`
7.  **Middleware/Session Check:** Subsequent requests from the browser with the session cookie will be automatically recognized by server-side middleware, granting premium access without further verification until the cookie expires.
