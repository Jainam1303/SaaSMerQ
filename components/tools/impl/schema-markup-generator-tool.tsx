"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

type SchemaType = "Organization" | "Website" | "FAQ" | "Article";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

function buildSchema(
  type: SchemaType,
  fields: Record<string, string>,
  faqItems: FaqItem[],
): object {
  switch (type) {
    case "Organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: fields.name,
        url: fields.url,
        ...(fields.logo && { logo: fields.logo }),
        ...(fields.description && { description: fields.description }),
      };
    case "Website":
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: fields.name,
        url: fields.url,
        ...(fields.description && { description: fields.description }),
      };
    case "FAQ":
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems
          .filter((item) => item.question.trim() && item.answer.trim())
          .map((item) => ({
            "@type": "Question",
            name: item.question.trim(),
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer.trim(),
            },
          })),
      };
    case "Article":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: fields.headline,
        ...(fields.author && {
          author: { "@type": "Person", name: fields.author },
        }),
        ...(fields.datePublished && {
          datePublished: fields.datePublished,
        }),
        ...(fields.image && { image: fields.image }),
        ...(fields.description && { description: fields.description }),
      };
  }
}

const DEFAULT_FIELDS: Record<SchemaType, Record<string, string>> = {
  Organization: {
    name: "MerQPrime",
    url: "https://merqprime.in",
    logo: "https://merqprime.in/logo.png",
    description: "Free online tools for business, developers and SEO.",
  },
  Website: {
    name: "MerQPrime",
    url: "https://merqprime.in",
    description: "Free online tools — fast, private, no signup.",
  },
  FAQ: {},
  Article: {
    headline: "How to Use Online Tools Effectively",
    author: "MerQPrime Team",
    datePublished: new Date().toISOString().slice(0, 10),
    image: "https://merqprime.in/og-image.png",
    description: "A guide to getting the most from free online tools.",
  },
};

const FIELD_LABELS: Record<
  SchemaType,
  { key: string; label: string; type?: string; multiline?: boolean }[]
> = {
  Organization: [
    { key: "name", label: "Organization name" },
    { key: "url", label: "Website URL", type: "url" },
    { key: "logo", label: "Logo URL", type: "url" },
    { key: "description", label: "Description", multiline: true },
  ],
  Website: [
    { key: "name", label: "Site name" },
    { key: "url", label: "Site URL", type: "url" },
    { key: "description", label: "Description", multiline: true },
  ],
  FAQ: [],
  Article: [
    { key: "headline", label: "Headline" },
    { key: "author", label: "Author" },
    { key: "datePublished", label: "Date published", type: "date" },
    { key: "image", label: "Image URL", type: "url" },
    { key: "description", label: "Description", multiline: true },
  ],
};

let faqId = 0;
function newFaqItem(): FaqItem {
  faqId += 1;
  return { id: String(faqId), question: "", answer: "" };
}

export function SchemaMarkupGeneratorTool() {
  const [schemaType, setSchemaType] = React.useState<SchemaType>("Organization");
  const [fields, setFields] = React.useState(DEFAULT_FIELDS.Organization);
  const [faqItems, setFaqItems] = React.useState<FaqItem[]>([
    {
      id: "1",
      question: "Is my data sent to a server?",
      answer: "No. All processing happens locally in your browser.",
    },
    {
      id: "2",
      question: "Are these tools free?",
      answer: "Yes. MerQPrime tools are free with no signup required.",
    },
  ]);

  function handleTypeChange(type: SchemaType) {
    setSchemaType(type);
    setFields({ ...DEFAULT_FIELDS[type] });
    if (type === "FAQ" && faqItems.length === 0) {
      setFaqItems([newFaqItem()]);
    }
  }

  function updateField(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  const jsonLd = React.useMemo(() => {
    const schema = buildSchema(schemaType, fields, faqItems);
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }, [schemaType, fields, faqItems]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="schema-type">Schema type</Label>
          <Select
            id="schema-type"
            value={schemaType}
            onChange={(e) => handleTypeChange(e.target.value as SchemaType)}
            className="max-w-xs"
          >
            <option value="Organization">Organization</option>
            <option value="Website">Website</option>
            <option value="FAQ">FAQ</option>
            <option value="Article">Article</option>
          </Select>
        </div>

        {schemaType === "FAQ" ? (
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={item.id}
                className="space-y-3 rounded-lg border border-border/80 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Question {index + 1}
                  </span>
                  {faqItems.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFaqItems((items) =>
                          items.filter((i) => i.id !== item.id),
                        )
                      }
                      aria-label={`Remove question ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`faq-q-${item.id}`}>Question</Label>
                  <Input
                    id={`faq-q-${item.id}`}
                    value={item.question}
                    onChange={(e) =>
                      setFaqItems((items) =>
                        items.map((i) =>
                          i.id === item.id
                            ? { ...i, question: e.target.value }
                            : i,
                        ),
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`faq-a-${item.id}`}>Answer</Label>
                  <Textarea
                    id={`faq-a-${item.id}`}
                    value={item.answer}
                    onChange={(e) =>
                      setFaqItems((items) =>
                        items.map((i) =>
                          i.id === item.id
                            ? { ...i, answer: e.target.value }
                            : i,
                        ),
                      )
                    }
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFaqItems((items) => [...items, newFaqItem()])}
            >
              <Plus className="size-4" /> Add question
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELD_LABELS[schemaType].map(({ key, label, type, multiline }) => (
              <div
                key={key}
                className={multiline ? "space-y-2 sm:col-span-2" : "space-y-2"}
              >
                <Label htmlFor={`schema-${key}`}>{label}</Label>
                {multiline ? (
                  <Textarea
                    id={`schema-${key}`}
                    value={fields[key] ?? ""}
                    onChange={(e) => updateField(key, e.target.value)}
                    rows={2}
                  />
                ) : (
                  <Input
                    id={`schema-${key}`}
                    type={type ?? "text"}
                    value={fields[key] ?? ""}
                    onChange={(e) => updateField(key, e.target.value)}
                    spellCheck={type === "url" ? false : undefined}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="schema-output">JSON-LD snippet</Label>
            <CopyButton value={jsonLd} />
          </div>
          <Textarea
            id="schema-output"
            value={jsonLd}
            readOnly
            spellCheck={false}
            className="min-h-[240px] bg-muted/30 font-mono text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}
