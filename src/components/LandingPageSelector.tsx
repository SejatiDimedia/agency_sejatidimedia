'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TemplateId, getActiveTemplate } from '@/lib/templates';
import { Project } from '@/lib/api/glio-projects';

// Dynamic import of both landing page versions
const AgencyLandingV1 = dynamic(() => import('./AgencyLanding'), {
  ssr: true,
});

const AgencyLandingV2 = dynamic(() => import('./AgencyLandingV2'), {
  ssr: true,
});

interface LandingPageSelectorProps {
  copy?: any;
  projects?: Project[];
}

export default function LandingPageSelector({ copy, projects }: LandingPageSelectorProps) {
  const [template, setTemplate] = useState<TemplateId>('classic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTemplate(getActiveTemplate());
    setMounted(true);

    const handleTemplateChange = (e: CustomEvent<TemplateId>) => {
      setTemplate(e.detail);
    };

    window.addEventListener('sejatidimedia-template-change' as any, handleTemplateChange);
    return () => {
      window.removeEventListener('sejatidimedia-template-change' as any, handleTemplateChange);
    };
  }, []);

  // Before mount, render V1 by default to ensure perfect SEO/SSR markup
  if (!mounted || template === 'classic') {
    return <AgencyLandingV1 copy={copy} projects={projects} />;
  }

  return <AgencyLandingV2 copy={copy} projects={projects} />;
}
