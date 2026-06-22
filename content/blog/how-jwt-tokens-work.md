---
title: "How JWT Tokens Work — Structure, Signing and Debugging"
description: "Understand JSON Web Token header, payload and signature, common claims, validation pitfalls and decode JWTs safely with MerQPrime's free JWT decoder."
publishedAt: "2026-06-20"
category: "Developer"
keywords:
  - jwt tokens
  - jwt decoder
  - json web token
  - jwt authentication
  - jwt claims
  - jwt signature
toolSlug: jwt-decoder
relatedToolSlugs:
  - sha256-generator
  - timestamp-converter
  - url-decoder
relatedSlugs:
  - what-is-sha256-hashing
  - regex-guide-for-beginners
---

JSON Web Tokens (JWTs) carry claims between parties in a compact, URL-safe string. They appear in OAuth 2.0 access tokens, session substitutes, microservice auth and single sign-on flows. A JWT looks like opaque gibberish until you split it — then header and payload decode to readable JSON while the signature proves integrity if you validate it correctly.

This guide explains JWT structure, signing algorithms, standard claims, common mistakes and how to inspect tokens with MerQPrime's [JWT Decoder](/tools/jwt-decoder) without exposing secrets to a server.

## JWT structure: three Base64url parts

A JWT has three segments separated by dots:

```
header.payload.signature
```

Each segment is Base64url-encoded JSON (header and payload) or bytes (signature). Base64url replaces `+` and `/` with `-` and `_` and may omit padding — related encoding rules overlap with [URL Encoding Explained](/blog/url-encoding-explained).

### Header

Typical header fields:

- `alg` — signing algorithm (e.g. HS256, RS256)
- `typ` — usually `JWT`
- `kid` — key identifier for rotation

Never trust `alg` from the token alone — validate against an allowlist on your server. The historic "alg: none" attack tricked libraries into skipping verification.

### Payload

Claims are JSON key-value pairs. Registered claims include:

| Claim | Meaning |
| --- | --- |
| `iss` | Issuer |
| `sub` | Subject (often user ID) |
| `aud` | Audience |
| `exp` | Expiration time (Unix seconds) |
| `nbf` | Not before |
| `iat` | Issued at |
| `jti` | Unique token ID |

Custom claims carry roles, tenant IDs or scopes. Payloads are **not encrypted** by default — anyone with the token can read them. Do not put passwords or PCI data in JWT payloads.

### Signature

The signature verifies the header and payload were not tampered with. For HMAC-SHA256 (HS256), signing uses a shared secret. For RS256, the issuer signs with a private key; verifiers use the public key from JWKS endpoints.

Understanding HMAC ties to [What Is SHA256 Hashing](/blog/what-is-sha256-hashing) — SHA256 is the hash inside HMAC-SHA256. MerQPrime's [SHA256 Generator](/tools/sha256-generator) helps learn digests; JWT verification uses full HMAC or RSA libraries.

## How authentication flows use JWTs

1. User logs in; authorization server validates credentials.
2. Server issues JWT access token (and often refresh token).
3. Client sends `Authorization: Bearer <jwt>` on API requests.
4. Resource server validates signature, `exp`, `aud`, `iss` and authorization claims.
5. Server executes request in identity context.

Refresh tokens may be opaque or JWT-shaped; they stay in httpOnly cookies or secure storage — not localStorage if XSS is a concern.

## Decoding vs verifying

Decoding parses header and payload without cryptography. **Verification** checks signature with secret or public key and validates claims. MerQPrime's [JWT Decoder](/tools/jwt-decoder) decodes client-side for debugging — it does not replace server-side verification.

Use the decoder to:

- Confirm `exp` against the [Timestamp Converter](/tools/timestamp-converter) when logs show epoch seconds.
- Inspect `scope` or `roles` when authorization fails mysteriously.
- Compare header `alg` with what your API middleware expects.

Never treat decoded payload as trusted until your backend verifies the signature.

## Common JWT mistakes

### Skipping audience and issuer checks

Stolen tokens from one service should not work on another. Validate `aud` and `iss` strictly.

### Long-lived access tokens

Short access token TTL plus refresh rotation limits blast radius. Check `exp` during debugging — expired tokens often return generic 401s.

### Storing sensitive data in payload

JWTs travel through browsers, mobile logs and analytics. Minimize PII; use opaque server-side sessions when regulations require.

### Confusing encoding with encryption

JWE (encrypted JWT) exists but is less common than signed-only JWS. Base64 is not secrecy.

### Weak HMAC secrets

HS256 requires high-entropy secrets. Generate with the [Password Generator](/tools/password-generator) patterns — long random bytes, not dictionary words.

## Algorithm choice: HS256 vs RS256

| | HS256 | RS256 |
| --- | --- | --- |
| Key type | Shared secret | Public/private key pair |
| Verifiers | Must know secret | Only need public key |
| Rotation | Harder with many services | JWKS rotation patterns |
| Use when | Monolith, trusted internal services | Third-party clients, multi-service |

Public APIs often publish JWKS URLs. Internal mesh may use HS256 with vault-stored secrets.

## Debugging workflow with MerQPrime

1. Copy JWT from browser devtools or API client (redact in screenshots).
2. Paste into [JWT Decoder](/tools/jwt-decoder).
3. Read header `alg` and payload claims.
4. Convert `iat`/`exp` with [Timestamp Converter](/tools/timestamp-converter).
5. If URL query params include encoded tokens, chain with [URL Decoder](/tools/url-decoder).
6. Fix server config; re-issue token; decode again to confirm.

For payload JSON formatting, use the [JSON Formatter](/tools/json-formatter) on the [Developer Tools](/developer-tools) hub.

## JWT vs sessions

Session cookies store a server-side session ID; JWTs embed state in the token. JWTs scale horizontally without shared session stores but complicate revocation — maintain deny lists or short TTLs for sensitive apps.

Hybrid patterns store JWT in httpOnly cookies with CSRF protections — combining browser security with stateless claims.

## Security reminders

- Validate signatures on every request.
- Use HTTPS only.
- Rotate keys and secrets on schedule.
- Do not paste production tokens into untrusted websites. MerQPrime processes locally, but treat tokens like passwords in operational hygiene.
- Log `jti` for traceability, not full tokens.

Regex validation of JWT shape before decode catches obvious garbage — see [Regex Guide for Beginners](/blog/regex-guide-for-beginners) and the [Regex Tester](/tools/regex-tester).

## Standards and libraries

JWTs are defined in RFC 7519; JWS and JWA cover signing algorithms. Use maintained libraries (jose, jsonwebtoken, PyJWT) instead of hand-rolling Base64 and HMAC.

When specs mention `%` encoding in redirect URIs carrying tokens, cross-read [URL Encoding Explained](/blog/url-encoding-explained).

## Testing and staging tips

Issue test tokens with near-term `exp` to exercise refresh flows. Mirror claim names between auth service and resource servers — `userId` vs `sub` mismatches cause silent denials.

Compare two token versions with the [Text Diff Checker](/tools/text-diff-checker) when rolling out claim schema changes.

## Frequently asked questions

### Can I decode a JWT without the secret?

Yes. Payload and header are Base64url-encoded, not encrypted. Signature verification requires keys.

### Why does my token work in Postman but not production?

Check clock skew on `nbf`/`exp`, different `aud` values, TLS termination stripping headers or environment-specific signing keys.

### Are JWTs better than session cookies?

Neither is universally better. Choose based on architecture, revocation needs, client type and security team standards.

### Does MerQPrime verify signatures?

The [JWT Decoder](/tools/jwt-decoder) displays structure for debugging. Verification belongs in your API using official libraries and current keys.

Continue learning on [Developer Tools](/developer-tools) — hashing, timestamps and encoding tools complement auth debugging. For public docs sites explaining your API auth, pair technical accuracy with [SEO Tools](/seo-tools) meta and schema generators so developers find your guides in search.

## Token lifecycle in microservices

Distributed systems pass JWTs between gateway, auth service and domain APIs. Each hop should validate issuer, signature and audience without re-decoding untrusted claims into SQL. When services clock skew exceeds a few seconds, `nbf` and `exp` rejections spike — synchronize NTP across nodes and log skew metrics.

Rotating signing keys while old tokens remain valid requires publishing JWKS with multiple keys and `kid` header matching. Document rotation runbooks for on-call engineers: decode sample token, confirm `kid`, fetch JWKS, verify in staging before revoking prior key.

Refresh token theft detection sometimes binds refresh to device fingerprint claims — architectural choice beyond decode-only tools. MerQPrime helps inspect claim shapes your security team designs; enforcement remains server-side.

## Compliance and logging

GDPR and similar frameworks treat subject identifiers in JWTs as personal data if `sub` maps to users. Minimize retention in access logs — log correlation IDs instead of full bearer tokens. When support asks users to paste tokens for debugging, prefer short-lived test tokens over production credentials.

Penetration testers often flag long JWTs in URLs — move to Authorization headers and httpOnly cookies where feasible. Decode tools accelerate remediation verification after fixes ship.
