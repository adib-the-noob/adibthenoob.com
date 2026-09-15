import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{mdx,md}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{mdx,md}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    period: z.string().optional(),
    tools: z.array(z.string()).default([]),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    status: z.enum(["live", "wip", "archive"]).default("live"),
    sortOrder: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: "**/*.{mdx,md}", base: "./src/content/experience" }),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    tag: z.string().optional(),
    period: z.string(),
    location: z.string().optional(),
    bullets: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    sortOrder: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, projects, experience };
