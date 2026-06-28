import type { ToolMeta } from "../types";

export const sipCalculator: ToolMeta = {
  slug: "sip-calculator",
  name: "SIP Calculator",
  seoTitle: "SIP Calculator India — Mutual Fund Returns & Future Value",
  shortDescription:
    "Estimate mutual fund SIP returns, invested amount and future value over time.",
  metaDescription:
    "Free SIP calculator for India. Enter monthly investment, expected annual return and duration to see invested amount, estimated returns and future value of your mutual fund SIP.",
  category: "business",
  icon: "trending-up",
  keywords: [
    "sip calculator",
    "sip calculator india",
    "mutual fund sip calculator",
    "sip return calculator",
    "monthly sip calculator",
    "sip investment calculator",
  ],
  addedAt: "2026-06-20",
  featured: true,
  popular: true,
  intro:
    "See how disciplined monthly investing can grow your wealth. Enter your monthly SIP amount, expected annual return and investment period to estimate total invested, returns earned and the future value of your portfolio — ideal for planning mutual fund investments in India.",
  howItWorks: [
    "Enter how much you plan to invest every month.",
    "Set an expected annual return rate (based on fund category or past averages).",
    "Choose the investment duration in years.",
    "Instantly see invested amount, estimated returns and future value.",
  ],
  useCases: [
    "Plan a long-term mutual fund SIP for retirement.",
    "Compare different monthly investment amounts.",
    "Set realistic return expectations before investing.",
    "Teach beginners how compounding works over time.",
  ],
  faqs: [
    {
      question: "Is SIP return guaranteed?",
      answer:
        "No. Mutual fund returns depend on market performance. This calculator uses your expected return rate as an estimate — actual results may differ.",
    },
    {
      question: "What return rate should I use?",
      answer:
        "Many investors use 10–12% for equity-heavy funds and 6–8% for debt funds as rough planning assumptions. Past performance does not guarantee future returns.",
    },
    {
      question: "Does this include taxes or exit loads?",
      answer:
        "No. The estimate is pre-tax and does not account for fund fees, STT or exit loads. Use it for planning, not exact forecasting.",
    },
    {
      question: "What is the SIP future value formula?",
      answer:
        "FV = P × [((1 + i)^n − 1) ÷ i] × (1 + i), where P is the monthly amount, i is the monthly return (annual ÷ 12) and n is the number of months. A ₹5,000 monthly SIP at 12% for 10 years (₹6,00,000 invested) grows to roughly ₹11.6 lakh through compounding.",
    },
    {
      question: "Is SIP better than a lumpsum investment?",
      answer:
        "A SIP spreads investments over time, averaging your purchase cost (rupee-cost averaging) and removing the need to time the market. A lumpsum can outperform when invested at a market low, but SIPs suit salaried investors building wealth steadily.",
    },
    {
      question: "What is a step-up SIP?",
      answer:
        "A step-up (or top-up) SIP increases your monthly contribution by a fixed percentage each year — for example 10% annually — so your investing keeps pace with rising income and significantly boosts the final corpus.",
    },
  ],
};
