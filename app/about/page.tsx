import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: `Learn about ${siteConfig.name}, a fast, secure and privacy-first platform of free online tools.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container max-w-3xl space-y-6 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        About {siteConfig.name}
      </h1>
      <div className="space-y-4 leading-relaxed text-muted-foreground">
        <p>
          {siteConfig.name} is a growing collection of fast, free and secure
          online tools designed for developers, businesses and creators. Our
          mission is simple: provide reliable everyday utilities that respect
          your privacy and your time.
        </p>
        <p>
          Wherever possible, our tools run entirely in your browser. That means
          the text, files and images you work with never leave your device and
          are never uploaded to a server — making the tools both private and
          remarkably fast.
        </p>
        <p>
          The platform is built on a modern, accessible and mobile-first
          foundation, and it’s designed to scale to hundreds of tools across
          developer, business, image, SEO and text categories.
        </p>
      </div>
    </div>
  );
}
