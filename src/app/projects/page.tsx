import { getProjects } from "../../lib/api/glio-projects";
import ProjectsList from "./ProjectsList";

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsList projects={projects} />;
}
