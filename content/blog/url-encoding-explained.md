---
title: "URL Encoding Explained — Percent-Encoding, Query Strings and Pitfalls"
description: "Learn why URL encoding exists, how percent-encoding works for query strings and paths, and encode or decode URLs with MerQPrime's free tools."
publishedAt: "2026-06-20"
category: "Developer"
keywords:
  - url encoding
  - percent encoding
  - url encoder
  - url decoder
  - query string encoding
  - uri encoding
toolSlug: url-encoder
relatedToolSlugs:
  - url-decoder
  - jwt-decoder
  - regex-tester
relatedSlugs:
  - how-jwt-tokens-work
  - regex-guide-for-beginners
---

URLs appear simple until a space, ampersand or Unicode character breaks a redirect, OAuth callback or analytics parameter. URL encoding (percent-encoding) converts reserved and non-ASCII bytes into `%XX` sequences safe for transmission in HTTP URLs. Getting encoding wrong causes signature mismatches on webhooks, double-encoded query params and "works on my machine" login flows.

This guide explains RFC rules, `encodeURI` vs `encodeURIComponent`, common bugs and MerQPrime's [URL Encoder](/tools/url-encoder) and [URL Decoder](/tools/url-decoder) on the [Developer Tools](/developer-tools) hub.

## URL structure refresher

```
https://example.com/path/to/page?query=value&foo=bar#section
```

| Part | Example | Encoding sensitivity |
| --- | --- | --- |
| Scheme | https | Fixed |
| Host | example.com | IDNA for international domains |
| Path | /path/to/page | Encode reserved segments |
| Query | ?query=value | Encode keys and values |
| Fragment | #section | Often not sent to server |

Spaces historically became `+` in `application/x-www-form-urlencoded` bodies but `%20` in paths — inconsistency tripped generations of developers.

## What is percent-encoding?

Unsafe or reserved characters become `%` followed by two hexadecimal digits representing UTF-8 bytes.

Examples:

- Space → `%20` (or `+` in form bodies)
- `&` → `%26` (critical in query values containing ampersands)
- `@` → `%40`
- Unicode smile → UTF-8 bytes each percent-encoded

Decoding reverses the process — MerQPrime [URL Decoder](/tools/url-decoder) reveals original text for debugging.

## Reserved vs unreserved characters

RFC 3986 defines:

- **Unreserved** — ALPHA, DIGIT, `-._~` — typically left as-is
- **Reserved** — `!*'();:@&=+$,/?#[]` — have syntactic meaning; encode when used as data

When `&` separates query pairs, a literal ampersand in a value must encode as `%26` or parsers split early.

## encodeURI vs encodeURIComponent (JavaScript)

| Function | Encodes | Leaves unencoded |
| --- | --- | --- |
| `encodeURI` | Full URI | `; , / ? : @ & = + $ #` in appropriate roles |
| `encodeURIComponent` | Component | Aggressive — for query keys/values |

Rule of thumb:

- Encoding entire URL → rarely `encodeURI`
- Encoding query parameter value → `encodeURIComponent`
- Building query string manually → encode each key and value separately

MerQPrime [URL Encoder](/tools/url-encoder) helps verify what your code should produce for odd inputs like `100% complete`.

## application/x-www-form-urlencoded

HTML forms POST `key=value&key2=value2` with space as `+`. Server frameworks decode accordingly. Mixing `%20` and `+` usually works for spaces but test your stack.

JSON APIs use JSON bodies — not form encoding — but OAuth still redirects with query parameters requiring strict encoding.

## Common bugs in production

### Double encoding

Encode already-encoded string `%2520` instead of `%20` — decode once with [URL Decoder](/tools/url-decoder) to inspect layers.

### Encoding entire URL including scheme

Breaks `https://` into gibberish — encode components individually.

### Plus sign in query values

`+` means space in form decoding — literal plus must be `%2B`.

### Unicode and legacy servers

UTF-8 percent-encoding standard; old ISO-8859-1 systems garble emoji — know your upstream.

### JWT in query strings

Some flows pass tokens in URLs — fragile for logs and Referer leakage. Decode structure with [JWT Decoder](/tools/jwt-decoder) after extracting — see [How JWT Tokens Work](/blog/how-jwt-tokens-work). Prefer POST body or Authorization header for tokens.

### HMAC signature mismatches

APIs sign canonical query strings — encoding order matters. Reproduce exact byte sequence; hash with guidance from [What Is SHA256 Hashing](/blog/what-is-sha256-hashing).

## Path segments vs query

Path `/search/c++` may need `/search/c%2B%2B`. Slugs for marketing use [Slug Generator](/tools/slug-generator) on [SEO Tools](/seo-tools) — lowercase hyphenated ASCII avoids many encoding issues in public URLs.

Non-ASCII paths require UTF-8 encoding per RFC — browsers handle; log aggregation must too.

## Redirect chains and analytics UTMs

Campaign links append `utm_source`, `utm_medium` — encode spaces in campaign names. Broken encoding truncates query at first illegal character — analytics show `(not set)`.

Open Graph `og:url` should be canonical clean URL — [Open Graph Tags Explained](/blog/open-graph-tags-explained) — encoding still applies when sharing encoded variants.

## Regex validation before encoding

Validate URL shape with patterns in [Regex Tester](/tools/regex-tester) — [Regex Guide for Beginners](/blog/regex-guide-for-beginners) — then encode components. Regex does not replace proper URL parser libraries (`URL` class in browsers).

## Server-side equivalents

| Language | Encode component |
| --- | --- |
| JavaScript | encodeURIComponent |
| Python | urllib.parse.quote |
| Java | URLEncoder.encode |
| Go | url.QueryEscape |

Interoperability tests: pick test vectors (space, ampersand, unicode) shared across services.

## Debugging workflow with MerQPrime

1. Capture failing URL from browser network tab.
2. Paste full URL into [URL Decoder](/tools/url-decoder) — inspect components.
3. Re-encode problematic values with [URL Encoder](/tools/url-encoder).
4. Compare expected vs actual query using [Text Diff Checker](/tools/text-diff-checker).
5. Fix client/server encoding symmetry.

For JSON bodies with embedded URLs, format JSON in [JSON Formatter](/tools/json-formatter) first — escaped slashes `\u0026` confuse if not unescaped before encoding pass.

## Security considerations

Open redirects validate decoded URLs — `https://evil.com` hidden in encoded parameter. SSRF filters decode twice to catch bypass.

Log redaction: encoded tokens still sensitive — treat query JWTs as secrets.

## International context (India)

Indian language query params in Roman script (`?city=Mumbai`) usually ASCII-safe. Hindi in URLs needs UTF-8 percent-encoding — test on low-end Android browsers common in market.

UPI deep links and payment apps use custom schemes — encoding rules differ from https — consult NPCI/app docs when integrating with [Business Tools](/business-tools) UPI QR flows.

## XML and JSON adjacent encoding

JSON strings escape URLs as `\` sequences — distinct from percent-encoding. XML CDATA wraps URLs with fewer escapes — see [XML vs JSON](/blog/xml-vs-json). Know layer: JSON string vs URI component.

## Frequently asked questions

### Should I encode `#` in query values?

Yes — `#` starts fragment; unencoded `#` truncates server-visible query.

### Is encoding case-sensitive?

Hex digits in `%XX` are case-insensitive; canonicalize in signatures if spec requires uppercase.

### Does MerQPrime upload URLs I encode?

No — [URL Encoder](/tools/url-encoder) and [URL Decoder](/tools/url-decoder) run locally like all [Developer Tools](/developer-tools).

### Why decode shows `%E2%80%99`?

UTF-8 bytes for typographic apostrophe — correct encoding of Unicode punctuation.

Master encoding once, reuse across OAuth, webhooks, analytics and share links. Pair this guide with [How JWT Tokens Work](/blog/how-jwt-tokens-work) and [Regex Guide for Beginners](/blog/regex-guide-for-beginners); bookmark [Developer Tools](/developer-tools) for encode/decode/JWT utilities and [SEO Tools](/seo-tools) when canonical marketing URLs must stay clean in meta and schema tags.

## Framework-specific gotchas

**Python requests:** `params` dict auto-encodes — manual string concat bypasses safety.

**Axios:** `params` serializer configurable — align with backend expectation for array params (`foo[]=1` vs `foo=1&foo=2`).

**Java Spring:** `UriComponentsBuilder` handles encoding — prefer builder over string append.

**PHP:** `http_build_query` uses `+` for spaces — match consumer decoding.

Integration tests should include unicode, slash, plus and ampersand in round-trip fixtures — paste failing cases into MerQPrime encoder/decoder during triage.

## Encoding in email and SMS deep links

Marketing emails encode long query strings for attribution. SMS short links redirect through trackers that re-encode — broken chains drop UTM params. Test full click path on Android Chrome and iOS Safari — dominant mobile browsers for Indian campaigns linking to [Finance Tools](/finance-tools) calculators or [Business Tools](/business-tools) invoice pages.

## Quick reference table

| Character | Encoded | Notes |
| --- | --- | --- |
| Space | `%20` or `+` in forms | Context-dependent |
| `&` | `%26` | Critical in query values |
| `=` | `%3D` | When literal in values |
| `/` | `%2F` | Encode in path segments when data |
| `?` | `%3F` | When literal, not query start |

Keep this table linked from internal runbooks — paste odd characters into [URL Encoder](/tools/url-encoder) when unsure rather than guessing hex values under incident pressure.
