import fs from 'fs';
import path from 'path';
import { TemplateId } from './templates';
import { redis } from './redis';

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'src/data/site-settings.json');
const REDIS_KEY = 'site_active_template';
const REDIS_NDA_KEY = 'site_nda_blur';

// Global memory cache across serverless executions within same container
declare global {
  // eslint-disable-next-line no-var
  var __globalActiveTemplate: TemplateId | undefined;
  // eslint-disable-next-line no-var
  var __globalNdaBlur: boolean | undefined;
  // eslint-disable-next-line no-var
  var __globalNdaProjects: string[] | undefined;
  // eslint-disable-next-line no-var
  var __globalFeaturedProjects: string[] | undefined;
}

export async function getGlobalActiveTemplate(): Promise<TemplateId> {
  // 1. Check Upstash Redis first (global across serverless instances in production)
  if (redis) {
    try {
      const redisVal = await redis.get(REDIS_KEY);
      if (redisVal === 'professional' || redisVal === 'classic') {
        globalThis.__globalActiveTemplate = redisVal as TemplateId;
        return redisVal as TemplateId;
      }
    } catch (e) {
      console.warn('Redis get template warning:', e);
    }
  }

  // 2. Check Global In-Memory Cache
  if (globalThis.__globalActiveTemplate === 'professional' || globalThis.__globalActiveTemplate === 'classic') {
    return globalThis.__globalActiveTemplate;
  }

  // 3. Check local filesystem (works in local development and stateful environments)
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const content = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const data = JSON.parse(content);
      if (data.activeTemplate === 'professional' || data.activeTemplate === 'classic') {
        globalThis.__globalActiveTemplate = data.activeTemplate;
        return data.activeTemplate;
      }
    }
  } catch {
    // Read-only filesystem in serverless environments (e.g. Vercel)
  }

  return 'professional';
}

export async function setGlobalActiveTemplate(template: TemplateId): Promise<boolean> {
  globalThis.__globalActiveTemplate = template;

  // 1. Save to Upstash Redis (global across all users, instances, and devices in production)
  if (redis) {
    try {
      await redis.set(REDIS_KEY, template);
    } catch (e) {
      console.warn('Redis set template warning:', e);
    }
  }

  // 2. Save to local filesystem if writable (development / VPS)
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let existingData: any = {};
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      try {
        existingData = JSON.parse(fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8'));
      } catch {}
    }
    const data = {
      ...existingData,
      activeTemplate: template,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Serverless environments like Vercel have a read-only filesystem; safe to ignore
  }

  return true;
}

export async function getGlobalNdaBlur(): Promise<boolean> {
  // 1. Check Upstash Redis first
  if (redis) {
    try {
      const redisVal = await redis.get(REDIS_NDA_KEY);
      if (redisVal !== null && redisVal !== undefined) {
        const boolVal = redisVal === true || redisVal === 'true';
        globalThis.__globalNdaBlur = boolVal;
        return boolVal;
      }
    } catch (e) {
      console.warn('Redis get NDA blur warning:', e);
    }
  }

  // 2. Check Global In-Memory Cache
  if (globalThis.__globalNdaBlur !== undefined) {
    return globalThis.__globalNdaBlur;
  }

  // 3. Check local filesystem
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const content = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const data = JSON.parse(content);
      if (typeof data.ndaBlurEnabled === 'boolean') {
        globalThis.__globalNdaBlur = data.ndaBlurEnabled;
        return data.ndaBlurEnabled;
      }
    }
  } catch {
    // Fallback
  }

  // Default to true (safe NDA protection on by default)
  return true;
}

export async function setGlobalNdaBlur(enabled: boolean): Promise<boolean> {
  globalThis.__globalNdaBlur = enabled;

  // 1. Save to Upstash Redis
  if (redis) {
    try {
      await redis.set(REDIS_NDA_KEY, enabled ? 'true' : 'false');
    } catch (e) {
      console.warn('Redis set NDA blur warning:', e);
    }
  }

  // 2. Save to local filesystem if writable
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let existingData: any = {};
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      try {
        existingData = JSON.parse(fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8'));
      } catch {}
    }
    const data = {
      ...existingData,
      ndaBlurEnabled: enabled,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Safe to ignore on serverless
  }

  return true;
}

const REDIS_NDA_PROJECTS_KEY = 'site_nda_project_slugs';

export async function getGlobalNdaProjectSlugs(): Promise<string[]> {
  // 1. Check Upstash Redis first
  if (redis) {
    try {
      const redisVal = await redis.get(REDIS_NDA_PROJECTS_KEY);
      if (Array.isArray(redisVal)) {
        globalThis.__globalNdaProjects = redisVal;
        return redisVal;
      }
      if (typeof redisVal === 'string') {
        try {
          const parsed = JSON.parse(redisVal);
          if (Array.isArray(parsed)) {
            globalThis.__globalNdaProjects = parsed;
            return parsed;
          }
        } catch {}
      }
    } catch (e) {
      console.warn('Redis get NDA project slugs warning:', e);
    }
  }

  // 2. Check Global In-Memory Cache
  if (globalThis.__globalNdaProjects !== undefined) {
    return globalThis.__globalNdaProjects;
  }

  // 3. Check local filesystem
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const content = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data.ndaProjectSlugs)) {
        globalThis.__globalNdaProjects = data.ndaProjectSlugs;
        return data.ndaProjectSlugs;
      }
    }
  } catch {
    // Fallback
  }

  return [];
}

export async function setGlobalNdaProjectSlugs(slugs: string[]): Promise<boolean> {
  globalThis.__globalNdaProjects = slugs;

  // 1. Save to Upstash Redis
  if (redis) {
    try {
      await redis.set(REDIS_NDA_PROJECTS_KEY, slugs);
    } catch (e) {
      console.warn('Redis set NDA project slugs warning:', e);
    }
  }

  // 2. Save to local filesystem if writable
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let existingData: any = {};
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      try {
        existingData = JSON.parse(fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8'));
      } catch {}
    }
    const data = {
      ...existingData,
      ndaProjectSlugs: slugs,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Safe to ignore on serverless
  }

  return true;
}

const REDIS_FEATURED_PROJECTS_KEY = 'site_featured_project_slugs';
export const DEFAULT_FEATURED_PROJECT_SLUGS: string[] = [];

export async function getGlobalFeaturedProjectSlugs(): Promise<string[]> {
  // 1. Check Upstash Redis first
  if (redis) {
    try {
      const redisVal = await redis.get(REDIS_FEATURED_PROJECTS_KEY);
      if (Array.isArray(redisVal) && redisVal.length > 0) {
        globalThis.__globalFeaturedProjects = redisVal;
        return redisVal;
      }
      if (typeof redisVal === 'string') {
        try {
          const parsed = JSON.parse(redisVal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            globalThis.__globalFeaturedProjects = parsed;
            return parsed;
          }
        } catch {}
      }
    } catch (e) {
      console.warn('Redis get featured project slugs warning:', e);
    }
  }

  // 2. Check Global In-Memory Cache
  if (globalThis.__globalFeaturedProjects !== undefined && globalThis.__globalFeaturedProjects.length > 0) {
    return globalThis.__globalFeaturedProjects;
  }

  // 3. Check local filesystem
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const content = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data.featuredProjectSlugs) && data.featuredProjectSlugs.length > 0) {
        globalThis.__globalFeaturedProjects = data.featuredProjectSlugs;
        return data.featuredProjectSlugs;
      }
    }
  } catch {
    // Fallback
  }

  return DEFAULT_FEATURED_PROJECT_SLUGS;
}

export async function setGlobalFeaturedProjectSlugs(slugs: string[]): Promise<boolean> {
  // Ensure maximum 3 projects for featured section
  const trimmedSlugs = slugs.slice(0, 3);
  globalThis.__globalFeaturedProjects = trimmedSlugs;

  // 1. Save to Upstash Redis
  if (redis) {
    try {
      await redis.set(REDIS_FEATURED_PROJECTS_KEY, trimmedSlugs);
    } catch (e) {
      console.warn('Redis set featured project slugs warning:', e);
    }
  }

  // 2. Save to local filesystem if writable
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let existingData: any = {};
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      try {
        existingData = JSON.parse(fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8'));
      } catch {}
    }
    const data = {
      ...existingData,
      featuredProjectSlugs: trimmedSlugs,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Safe to ignore on serverless
  }

  return true;
}

