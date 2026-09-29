import { getProjects } from "../../lib/api/glio-projects";
import { getGlobalFeaturedProjectSlugs } from "../../lib/server-template";
import ProjectsList from "./ProjectsList";

export const revalidate = 60;

export default async function ProjectsPage() {
  const [projects, initialFeaturedSlugs] = await Promise.all([
    getProjects(),
    getGlobalFeaturedProjectSlugs().catch(() => []),
  ]);

  return <ProjectsList projects={projects} initialFeaturedSlugs={initialFeaturedSlugs} />;
}
