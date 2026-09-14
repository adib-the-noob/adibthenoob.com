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

export const collections = { blog, projects };
