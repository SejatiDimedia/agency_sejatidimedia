import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/api/glio-projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sejatidimedia.web.id';

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await getProjects();
    projectRoutes = (projects || []).map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: p.endDate ? new Date(p.endDate) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (e) {
    console.error('Failed to load projects for sitemap', e);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...projectRoutes,
  ];
}
