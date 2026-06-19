import type { ToolMeta } from "../types";

export const passwordGenerator: ToolMeta = {
  slug: "password-generator",
  name: "Password Generator",
  seoTitle: "Strong Password Generator — Secure & Random",
  shortDescription:
    "Create strong, random passwords with adjustable length and character options, plus a strength meter.",
  metaDescription:
    "Generate strong, random and secure passwords with custom length, symbols, numbers and letter casing. Includes a live strength meter and one-click copy. Runs fully in your browser.",
  category: "developer",
  icon: "key-round",
  keywords: [
    "password generator",
    "strong password",
    "random password",
    "secure password generator",
  ],
  addedAt: "2026-01-06",
  featured: true,
  popular: true,
  intro:
    "Create strong, unpredictable passwords that are hard to crack and easy to copy. Control the length and character set, watch the live strength meter, and generate as many secure passwords as you need — all without anything leaving your browser.",
  howItWorks: [
    "Set the desired password length with the slider.",
    "Toggle uppercase, lowercase, numbers and symbols to match the site's rules.",
    "A cryptographically secure random password is generated instantly.",
    "Check the strength meter, then copy your password with one click.",
  ],
  useCases: [
    "Create unique passwords for every online account.",
    "Generate secure credentials for databases, APIs and servers.",
    "Replace weak or reused passwords flagged by your password manager.",
    "Produce one-off temporary passwords for new users.",
  ],
  faqs: [
    {
      question: "Are these passwords truly random?",
      answer:
        "Yes. Passwords are generated using the browser's cryptographically secure random number generator (Web Crypto API), not a predictable pseudo-random function.",
    },
    {
      question: "Do you store the passwords I generate?",
      answer:
        "Never. Generation happens entirely in your browser and nothing is transmitted or saved on any server.",
    },
    {
      question: "What makes a password strong?",
      answer:
        "Length and variety. Longer passwords that mix uppercase, lowercase, numbers and symbols are exponentially harder to guess or brute-force.",
    },
    {
      question: "How long should my password be?",
      answer:
        "Aim for at least 16 characters for important accounts. The strength meter helps you find a good balance of length and complexity.",
    },
  ],
};
