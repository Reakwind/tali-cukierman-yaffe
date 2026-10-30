import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { studySchema } from './lib/study-schema';

const studies = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/studies' }),
  schema: studySchema,
});

export const collections = { studies };
