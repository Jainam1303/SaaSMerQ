import { notFound } from "next/navigation";
import { getHubBySlug } from "@/lib/hubs";
import { buildHubMetadata, HubPage } from "@/components/hub/hub-page";

export async function generateMetadata() {
  const hub = getHubBySlug("business-tools");
  if (!hub) return {};
  return buildHubMetadata(hub);
}

export default function BusinessToolsPage() {
  const hub = getHubBySlug("business-tools");
  if (!hub) notFound();
  return <HubPage hub={hub} />;
}
