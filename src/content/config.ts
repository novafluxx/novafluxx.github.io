import { defineCollection, z } from "astro:content";

const pages = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        published: z.coerce.date().optional(),
        updated: z.coerce.date().optional(),
        heroImage: z.string().optional(),
    }),
});

export const collections = { pages };
