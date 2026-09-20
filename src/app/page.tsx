import AgencyLanding from "../components/AgencyLanding";
import { getHomePageCopy } from "../lib/sanity/client";
import { getProjects } from "../lib/api/glio-projects";
import { getInsights } from "../lib/api/insights";
import { getGlobalFeaturedProjectSlugs } from "../lib/server-template";

export const revalidate = 60;

export default async function HomePage() {
  const [copy, projects, featuredProjectSlugs, allInsights] = await Promise.all([
    getHomePageCopy(),
    getProjects(),
    getGlobalFeaturedProjectSlugs(),
    getInsights().catch(() => []),
  ]);

  const recentInsights = (allInsights || []).slice(0, 3);

  return (
    <AgencyLanding
      copy={copy}
      projects={projects}
      featuredProjectSlugs={featuredProjectSlugs}
      recentInsights={recentInsights}
    />
  );
}
