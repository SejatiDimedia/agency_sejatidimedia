import LandingPageSelector from "../components/LandingPageSelector";
import { getHomePageCopy } from "../lib/sanity/client";
import { getProjects } from "../lib/api/glio-projects";
import { getGlobalActiveTemplate } from "../lib/server-template";

export const revalidate = 60;

export default async function HomePage() {
  // Parallel fetch from data sources and server template setting
  const [copy, projects, activeTemplate] = await Promise.all([
    getHomePageCopy(),
    getProjects(),
    getGlobalActiveTemplate(),
  ]);

  return <LandingPageSelector initialTemplate={activeTemplate} copy={copy} projects={projects} />;
}
