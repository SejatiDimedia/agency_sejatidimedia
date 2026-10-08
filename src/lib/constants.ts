import "./icons-bundle";

const BASE_TECH_ICONS: Record<string, string> = {
  "React": "logos:react",
  "Vue": "logos:vue",
  "Angular": "logos:angular-icon",
  "Next.js": "logos:nextjs-icon",
  "Vite": "logos:vitejs",
  "TypeScript": "logos:typescript-icon",
  "Tailwind CSS": "logos:tailwindcss-icon",
  "Node.js": "logos:nodejs-icon",
  "NestJS": "logos:nestjs",
  "Golang": "selfhst:golang",
  "Python": "logos:python",
  "PostgreSQL": "logos:postgresql",
  "MySQL": "logos:mysql",
  "MongoDB": "devicon:mongodb",
  "Firestore": "vscode-icons:file-type-firestore",
  "Redis": "logos:redis",
  "Firebase": "logos:firebase",
  "AWS": "logos:aws",
  "GCP": "logos:google-cloud",
  "Docker": "logos:docker-icon",
  "CI/CD": "logos:github-actions",
  "Vercel": "logos:vercel-icon",
  "Flutter": "logos:flutter",
  "React Native": "logos:react",
  "Payment Gateway": "logos:stripe",
  "GraphQL": "logos:graphql",
  "REST API": "logos:postman-icon",
  "Laravel": "devicon:laravel",
  "Google Cloud": "devicon:googlecloud",
  "Express": "bxl:express-js",
  "Rest API": "dashicons:rest-api",
  "Payment Integration": "ri:secure-payment-fill",
  "Cloud Storage": "typcn:cloud-storage",
  "OAuth Providers": "mdi:two-factor-authentication",
  "Javascript": "devicon:javascript",
  "Typescript": "devicon:typescript",
  "Next": "bxl:next-js",
  "Tailwind": "devicon:tailwindcss",
  "Mysql": "devicon:mysql",
  "Node JS": "logos:nodejs",
  "Filament": "devicon:filamentphp",
  "Bloc": "file-icons:bloc",
  "Prisma": "devicon:prisma",
  "Redux": "devicon:redux",
  "Cloudflare R2": "devicon:cloudflare",
  "Supabase": "devicon:supabase",
  "Astro": "devicon:astro",
  "Fast API": "devicon:fastapi",
  "Nuxt": "devicon:nuxt",
  "N8N": "simple-icons:n8n",
  "n8n": "simple-icons:n8n",
  "LangChain": "simple-icons:langchain",
  "LlamaIndex": "thesvg:llamaindex",
  "RAG Architecture": "ph:file-magnifying-glass-duotone",
  "RAG": "ph:file-magnifying-glass-duotone",
  "KAG": "ph:graph-duotone",
  "QLoRA / Fine-Tuning": "ph:sliders-horizontal-duotone",
  "Autonomous Agents": "ph:robot-duotone",
  "AI Agents": "ph:robot-duotone",
  "Vector DB": "ph:database-duotone",
  "Pinecone": "logos:pinecone-icon",
  "Hugging Face": "logos:hugging-face-icon",
  "OpenAI": "logos:openai-icon",
  "Claude": "logos:claude-icon",
  "Ollama": "simple-icons:ollama",
  "DeepSeek": "simple-icons:deepseek",
  "Prompt Engineering": "ph:terminal-window-duotone",
  "RabbitMQ": "logos:rabbitmq-icon",
  "Tanstack": "logos:react-query-icon",
  "TanStack": "logos:react-query-icon",
  "TanStack Query": "logos:react-query-icon",
  "React Query": "logos:react-query-icon",
  "Zustand": "devicon:zustand",
  "Midtrans": "custom:midtrans",
  "Gradio": "logos:gradio-icon",
  "Gradio 6": "logos:gradio-icon",
  "Server Actions": "tabler:server-cog",
  "Server Action": "tabler:server-cog"
};

/**
 * Normalizes string for fuzzy/case-insensitive matching
 */
function normalizeKey(str: string): string {
  return str.trim().toLowerCase().replace(/[\s\-_.]+/g, "");
}

/**
 * Helper function to retrieve tech icon with exact, case-insensitive, or prefix fallback
 */
export function getTechIcon(tech: string): string | undefined {
  if (!tech) return undefined;
  if (BASE_TECH_ICONS[tech]) return BASE_TECH_ICONS[tech];

  const clean = normalizeKey(tech);
  for (const [key, val] of Object.entries(BASE_TECH_ICONS)) {
    if (normalizeKey(key) === clean) {
      return val;
    }
  }

  for (const [key, val] of Object.entries(BASE_TECH_ICONS)) {
    const cleanKey = normalizeKey(key);
    if (clean.startsWith(cleanKey) || cleanKey.startsWith(clean)) {
      return val;
    }
  }

  return undefined;
}

/**
 * Proxy-wrapped TECH_ICONS to support both direct object lookup and case-insensitive/variant matching.
 */
export const TECH_ICONS: Record<string, string> = new Proxy(BASE_TECH_ICONS, {
  get(target, prop) {
    if (typeof prop !== "string") {
      return Reflect.get(target, prop);
    }
    return getTechIcon(prop) ?? target[prop];
  }
});
