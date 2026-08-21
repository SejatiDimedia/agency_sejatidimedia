import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug, isProfessionalProject, sanitizeProjectForNda } from "../../../lib/api/glio-projects";
import { getGlobalNdaBlur, getGlobalNdaProjectSlugs } from "../../../lib/server-template";
import ProjectDetailClient from "../../../components/ProjectDetailClient";

export const revalidate = 60;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, allProjects, ndaBlurEnabled, ndaProjectSlugs] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getGlobalNdaBlur(),
    getGlobalNdaProjectSlugs(),
  ]);

  if (!project) {
    notFound();
  }

  // Determine server-side whether NDA is actively enforced
  const isNdaActive = isProfessionalProject(project, ndaProjectSlugs) && ndaBlurEnabled;

  // Perform true server-side redaction (strips proprietary text & real screenshot URLs before SSR)
  const safeProject = sanitizeProjectForNda(project, isNdaActive);

  const relatedProjects = allProjects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <ProjectDetailClient
      project={safeProject}
      relatedProjects={relatedProjects}
      initialNdaBlurEnabled={ndaBlurEnabled}
      initialNdaProjectSlugs={ndaProjectSlugs}
    />
  );
}

