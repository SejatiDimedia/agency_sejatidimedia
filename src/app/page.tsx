import LandingPageSelector from "../components/LandingPageSelector";
import { getHomePageCopy } from "../lib/sanity/client";
import { getProjects } from "../lib/api/glio-projects";
import { getInsights } from "../lib/api/insights";
import { getGlobalActiveTemplate, getGlobalFeaturedProjectSlugs } from "../lib/server-template";

export const revalidate = 60;

export default async function HomePage() {
  // Parallel fetch from data sources and server template setting
  const [copy, projects, activeTemplate, featuredProjectSlugs, allInsights] = await Promise.all([
    getHomePageCopy(),
    getProjects(),
    getGlobalActiveTemplate(),
    getGlobalFeaturedProjectSlugs(),
    getInsights().catch(() => []),
  ]);

  const recentInsights = (allInsights || []).slice(0, 3);

  return (
    <LandingPageSelector
      initialTemplate={activeTemplate}
      copy={copy}
      projects={projects}
      featuredProjectSlugs={featuredProjectSlugs}
      recentInsights={recentInsights}
    />
  );
}
