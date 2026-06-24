import {
  Award,
  BookOpen,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionHeading } from "@/components/layout/section-heading";

const pillars = [
  {
    icon: Zap,
    title: "Instant performance",
    text: "Every tool runs in your browser. No queues, no uploads, no waiting on a server.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy by design",
    text: "Your numbers, text and files stay on your device. We don't store what you calculate.",
  },
  {
    icon: BookOpen,
    title: "Editorial authority",
    text: "Methodology-backed calculators and guides reviewed by the MerQPrime Editorial Team.",
  },
  {
    icon: Award,
    title: "Built for trust",
    text: "Strict security headers, validated inputs and a polished interface you can rely on daily.",
  },
];

export function TrustAuthoritySection() {
  return (
    <section className="space-y-10 md:space-y-12">
      <FadeUp>
        <SectionHeading
          eyebrow="Why MerQPrime"
          title="Authority you can trust"
          subtitle="A focused utility platform engineered like a premium SaaS product — not a cluttered link farm."
          align="center"
        />
      </FadeUp>

      <div className="grid gap-4 sm:grid-cols-2">
        {pillars.map((item, index) => (
          <FadeUp key={item.title} delay={index * 0.08}>
            <div className="rounded-2xl elevated-card p-6 md:p-8">
              <span
                className="flex size-11 items-center justify-center rounded-xl border border-border/60 bg-surface text-primary"
              >
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.text}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
