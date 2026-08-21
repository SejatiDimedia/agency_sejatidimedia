import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "../../../lib/api/glio-projects";
import { getGlobalNdaBlur } from "../../../lib/server-template";
import ProjectDetailClient from "../../../components/ProjectDetailClient";

export const revalidate = 60;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, allProjects, ndaBlurEnabled] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getGlobalNdaBlur(),
  ]);

  if (!project) {
    notFound();
  }

  const relatedProjects = allProjects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <ProjectDetailClient
      project={project}
      relatedProjects={relatedProjects}
      initialNdaBlurEnabled={ndaBlurEnabled}
    />
  );
}
