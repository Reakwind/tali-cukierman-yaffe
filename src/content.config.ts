import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { studySchema } from './lib/study-schema';
import { highlightSchema, publicationSchema } from './lib/output-schema';
import { visualStudySchema } from './lib/visual-study-schema';

const studies = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/studies' }),
  schema: studySchema,
});

const publications = defineCollection({
  loader: file('./src/content/publications.json'),
  schema: publicationSchema,
});

const highlights = defineCollection({
  loader: file('./src/content/highlights.json'),
  schema: highlightSchema,
});

const visualStudies = defineCollection({
  loader: file('./src/content/visual-studies.json'),
  schema: visualStudySchema,
});
export const collections = { studies, publications, highlights, visualStudies };
