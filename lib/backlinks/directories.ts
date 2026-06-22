import type { BacklinkSubmission } from "./types";

/** Default directory submission checklist for Sprint 10. */
export const DIRECTORY_CHECKLIST: Omit<
  BacklinkSubmission,
  "id" | "submittedDate" | "status" | "backlinkUrl"
>[] = [
  {
    websiteName: "Product Hunt",
    url: "https://www.producthunt.com/posts/new",
    category: "Launch platform",
  },
  {
    websiteName: "AlternativeTo",
    url: "https://alternativeto.net/software/merqprime/about/",
    category: "SaaS directory",
  },
  {
    websiteName: "SaaSHub",
    url: "https://www.saashub.com/submit",
    category: "SaaS directory",
  },
  {
    websiteName: "Startup Stash",
    url: "https://startupstash.com/add-startup/",
    category: "Startup directory",
  },
  {
    websiteName: "BetaList",
    url: "https://betalist.com/submit",
    category: "Launch platform",
  },
  {
    websiteName: "Uneed",
    url: "https://uneed.best/submit-a-tool",
    category: "Tool directory",
  },
  {
    websiteName: "Microlaunch",
    url: "https://microlaunch.net/submit",
    category: "Launch platform",
  },
  {
    websiteName: "Futurepedia",
    url: "https://www.futurepedia.io/submit-tool",
    category: "AI & tool directory",
  },
  {
    websiteName: "Toolify",
    url: "https://www.toolify.ai/submit",
    category: "Tool directory",
  },
  {
    websiteName: "TopAI.tools",
    url: "https://topai.tools/submit",
    category: "Tool directory",
  },
  {
    websiteName: "Dev Hunt",
    url: "https://devhunt.org/submit",
    category: "Developer directory",
  },
  {
    websiteName: "Hacker News (Show HN)",
    url: "https://news.ycombinator.com/submit",
    category: "Developer community",
  },
  {
    websiteName: "Indie Hackers",
    url: "https://www.indiehackers.com/products",
    category: "Startup community",
  },
  {
    websiteName: "Free-for.dev",
    url: "https://github.com/ripienaar/free-for-dev",
    category: "Developer directory",
  },
  {
    websiteName: "Awesome Selfhosted",
    url: "https://github.com/awesome-selfhosted/awesome-selfhosted",
    category: "Developer directory",
  },
  {
    websiteName: "SaaS Genius",
    url: "https://www.saasgenius.com/submit-your-saas/",
    category: "SaaS directory",
  },
  {
    websiteName: "Capterra",
    url: "https://www.capterra.com/vendors/sign-up",
    category: "SaaS directory",
  },
  {
    websiteName: "G2",
    url: "https://www.g2.com/products/new",
    category: "SaaS directory",
  },
  {
    websiteName: "Slant",
    url: "https://www.slant.co/",
    category: "Tool directory",
  },
  {
    websiteName: "StackShare",
    url: "https://stackshare.io/submit",
    category: "Developer directory",
  },
];
