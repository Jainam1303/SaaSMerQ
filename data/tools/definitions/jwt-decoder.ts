import type { ToolMeta } from "../types";

export const jwtDecoder: ToolMeta = {
  slug: "jwt-decoder",
  name: "JWT Decoder",
  seoTitle: "JWT Decoder — Inspect JSON Web Tokens",
  shortDescription:
    "Decode and inspect JWT header and payload without verifying signatures.",
  metaDescription:
    "Free JWT decoder. Inspect JSON Web Token headers and payloads, view claims and expiry times, and debug auth flows — all processed privately in your browser.",
  category: "developer",
  icon: "key-round",
  keywords: [
    "jwt decoder",
    "json web token decoder",
    "jwt inspector",
    "decode jwt",
    "jwt payload viewer",
    "jwt debugger",
  ],
  addedAt: "2026-06-20",
  popular: true,
  intro:
    "Paste a JSON Web Token to instantly decode its header and payload. View claims, roles, issuer and expiry without sending the token to any server — ideal for debugging authentication flows.",
  howItWorks: [
    "Paste your JWT into the input field.",
    "The header and payload are decoded and displayed as formatted JSON.",
    "Standard claims such as exp, iat, iss and sub are easy to read.",
    "Copy individual sections or the full decoded output as needed.",
  ],
  useCases: [
    "Debug OAuth and OpenID Connect token payloads during integration.",
    "Verify expiry and audience claims before API calls fail.",
    "Inspect roles and permissions embedded in access tokens.",
    "Learn JWT structure when building auth systems.",
  ],
  faqs: [
    {
      question: "Does this verify the JWT signature?",
      answer:
        "No. This tool only decodes the Base64URL-encoded header and payload. Signature verification requires the secret or public key and is not performed here.",
    },
    {
      question: "Is it safe to paste production tokens?",
      answer:
        "Decoding happens locally in your browser, but tokens may contain sensitive claims. Avoid sharing decoded tokens and treat production credentials carefully.",
    },
    {
      question: "Why does decoding fail?",
      answer:
        "JWTs must have three Base64URL-encoded parts separated by dots. Missing segments or invalid encoding will produce an error.",
    },
  ],
};
