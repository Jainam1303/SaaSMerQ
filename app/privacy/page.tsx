import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}. Learn how our privacy-first tools, analytics, and advertising partners handle your data.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl space-y-6 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy" },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Privacy Policy
      </h1>
      <div className="space-y-6 leading-relaxed text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            1. In-browser Processing (Your Data Stays With You)
          </h2>
          <p>
            The vast majority of {siteConfig.name} tools process your data 
            entirely within your browser. The text, files, images, and numbers 
            you provide to our tools are processed locally on your device. We 
            do not upload, store, or transmit this input data to our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            2. Google Analytics & Usage Data
          </h2>
          <p>
            We use Google Analytics to understand how visitors interact with 
            our website, allowing us to improve the user experience and develop 
            better tools. Google Analytics collects standard internet log 
            information and visitor behavior information in an anonymous form.
          </p>
          <p>
            This information (including your IP address) is transmitted to Google. 
            We do not use Google Analytics to track or collect personally 
            identifiable information of visitors to our site.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            3. Advertising & Google AdSense
          </h2>
          <p>
            We use third-party advertising companies, including Google AdSense, 
            to serve ads when you visit our website. These companies may use 
            information (not including your name, address, email address, or 
            telephone number) about your visits to this and other websites in 
            order to provide advertisements about goods and services of interest 
            to you.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Google, as a third-party vendor, uses cookies to serve ads on 
              our site.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to 
              serve ads to our users based on their visit to our sites and/or 
              other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a 
                href="https://myadcenter.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Ads Settings
              </a>.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            4. Cookies
          </h2>
          <p>
            In addition to advertising cookies, our platform uses minimal local 
            storage or essential cookies strictly for site functionality, such 
            as remembering your light/dark theme preference. You can choose to 
            disable or selectively turn off our cookies or third-party cookies 
            in your browser settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            5. User Privacy Rights & Data Retention
          </h2>
          <p>
            Because our tools process data locally in your browser, we do not 
            have a database of your personal files or inputs to retain or delete. 
            Any emails you send us for support will be retained only as long as 
            necessary to resolve your inquiry, and will never be shared with 
            third parties or added to marketing lists without your consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact 
            us at{" "}
            <a 
              href="mailto:merqprime@gmail.com" 
              className="text-primary hover:underline"
            >
              merqprime@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
