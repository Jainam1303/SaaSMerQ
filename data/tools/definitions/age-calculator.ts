import type { ToolMeta } from "../types";

export const ageCalculator: ToolMeta = {
  slug: "age-calculator",
  name: "Age Calculator",
  seoTitle: "Age Calculator — Exact Age in Years, Months & Days",
  shortDescription:
    "Find your exact age from date of birth in years, months and days.",
  metaDescription:
    "Free age calculator. Enter your date of birth to get your exact age in years, months and days — useful for forms, exams, eligibility checks and birthday planning.",
  category: "business",
  icon: "calendar",
  keywords: [
    "age calculator",
    "calculate age from dob",
    "age in years months days",
    "birth date calculator",
    "how old am i calculator",
  ],
  addedAt: "2026-06-20",
  popular: true,
  intro:
    "Find your precise age from your date of birth. See years, months and days counted exactly — perfect for government forms, exam eligibility, insurance applications and birthday milestones.",
  howItWorks: [
    "Select your date of birth using the date picker.",
    "Optionally set a reference date (defaults to today).",
    "Your exact age appears instantly in years, months and days.",
    "Copy or share the result for forms and records.",
  ],
  useCases: [
    "Fill government and exam application forms accurately.",
    "Check age eligibility for jobs, scholarships or schemes.",
    "Calculate how many days until a birthday milestone.",
    "Verify age for insurance or travel documents.",
  ],
  faqs: [
    {
      question: "How is age calculated?",
      answer:
        "Age is computed from the difference between your birth date and the reference date, counting full years, then remaining months, then remaining days — matching calendar dates, not just dividing total days.",
    },
    {
      question: "Can I calculate age on a past or future date?",
      answer:
        "Yes. Change the reference date to see how old you were (or will be) on any specific day.",
    },
    {
      question: "Does leap year affect the result?",
      answer:
        "Yes. The calculator accounts for leap years when counting years and days between dates.",
    },
  ],
};
