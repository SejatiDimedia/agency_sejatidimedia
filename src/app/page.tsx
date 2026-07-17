import AgencyLanding from "../components/AgencyLanding";
import { getHomePageCopy } from "../lib/sanity/client";
import { getProjects } from "../lib/api/glio-projects";

// pair with ISR revalidation
export const revalidate = 60;

export default async function HomePage() {
  // Parallel fetch from both data sources (Sanity and Glio API)
  const [copy, projects] = await Promise.all([
    getHomePageCopy(),
    getProjects(),
  ]);

  return <AgencyLanding copy={copy} projects={projects} />;
}
