'use client';

import React from 'react';
import AgencyLanding from './AgencyLanding';
import { Project } from '@/lib/api/glio-projects';
import { InsightArticle } from '@/lib/api/insights-types';

interface LandingPageSelectorProps {
  initialTemplate?: any;
  copy?: any;
  projects?: Project[];
  featuredProjectSlugs?: string[];
  recentInsights?: InsightArticle[];
}

export default function LandingPageSelector({
  copy,
  projects,
  featuredProjectSlugs,
  recentInsights = [],
}: LandingPageSelectorProps) {
  return (
    <AgencyLanding
      copy={copy}
      projects={projects}
      featuredProjectSlugs={featuredProjectSlugs}
      recentInsights={recentInsights}
    />
  );
}

