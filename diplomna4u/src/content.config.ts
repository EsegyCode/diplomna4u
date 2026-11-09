import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/reviews' }),
  schema: z.object({
    name: z.string(),
    workType: z.string(),
    rating: z.number().int().min(1).max(5).optional(),
    text: z.string(),
    date: z.coerce.date(),
    city: z.string().optional(),
    source: z.string().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { blog, reviews };
