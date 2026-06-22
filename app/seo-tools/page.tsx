import { notFound } from "next/navigation";
import { getHubBySlug } from "@/lib/hubs";
import { buildHubMetadata, HubPage } from "@/components/hub/hub-page";

export async function generateMetadata() {
  const hub = getHubBySlug("seo-tools");
  if (!hub) return {};
  return buildHubMetadata(hub);
}

export default function SeoToolsPage() {
  const hub = getHubBySlug("seo-tools");
  if (!hub) notFound();
  return <HubPage hub={hub} />;
}
