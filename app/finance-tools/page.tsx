import { notFound } from "next/navigation";
import { getHubBySlug } from "@/lib/hubs";
import { buildHubMetadata, HubPage } from "@/components/hub/hub-page";

export async function generateMetadata() {
  const hub = getHubBySlug("finance-tools");
  if (!hub) return {};
  return buildHubMetadata(hub);
}

export default function FinanceToolsPage() {
  const hub = getHubBySlug("finance-tools");
  if (!hub) notFound();
  return <HubPage hub={hub} />;
}
