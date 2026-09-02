'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TemplateId } from '@/lib/templates';
import { Project } from '@/lib/api/glio-projects';

// Dynamic import of both landing page versions
const AgencyLandingV1 = dynamic(() => import('./AgencyLanding'), {
  ssr: true,
});

const AgencyLandingV2 = dynamic(() => import('./AgencyLandingV2'), {
  ssr: true,
});

interface LandingPageSelectorProps {
  initialTemplate?: TemplateId;
  copy?: any;
  projects?: Project[];
  featuredProjectSlugs?: string[];
}

export default function LandingPageSelector({
  initialTemplate = 'professional',
  copy,
  projects,
  featuredProjectSlugs,
}: LandingPageSelectorProps) {
  const [template, setTemplate] = useState<TemplateId>(initialTemplate);

  useEffect(() => {
    // Fetch live global template setting from server API
    fetch('/api/settings/template')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && (data.template === 'classic' || data.template === 'professional')) {
          setTemplate(data.template);
        }
      })
      .catch(() => {});

    const handleTemplateChange = (e: CustomEvent<TemplateId>) => {
      setTemplate(e.detail);
    };

    window.addEventListener('sejatidimedia-template-change' as any, handleTemplateChange);
    return () => {
      window.removeEventListener('sejatidimedia-template-change' as any, handleTemplateChange);
    };
  }, []);

  if (template === 'classic') {
    return <AgencyLandingV1 copy={copy} projects={projects} featuredProjectSlugs={featuredProjectSlugs} />;
  }

  return <AgencyLandingV2 copy={copy} projects={projects} featuredProjectSlugs={featuredProjectSlugs} />;
}

