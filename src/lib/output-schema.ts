import { z } from 'astro/zod';

const text = z.string().trim().min(10);
const studyId = z.enum(['stay-strong', 'birax', 'hybrid-closed-loop']);
const provenance = {
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  year: z.number().int().min(2000).max(2100),
  sourceUrl: z.url({ protocol: /^https$/ }),
  sourceChecked: z.iso.date(),
  approval: z.literal('draft'),
};

const localizedPublication = z.strictObject({
  title: text,
  summary: text,
  context: text,
});

export const publicationSchema = z.strictObject({
  ...provenance,
  type: z.enum(['article', 'review', 'proposal', 'conference-abstract']),
  citation: text,
  doi: z
    .string()
    .regex(/^10\.\d{4,9}\/\S+$/)
    .optional(),
  studies: z.array(studyId),
  localized: z.strictObject({
    en: localizedPublication,
    he: localizedPublication,
  }),
});

const localizedHighlight = z.strictObject({
  title: text,
  summary: text,
  dateLabel: z.string().trim().min(4),
  sourceLabel: text,
});

export const highlightSchema = z.strictObject({
  ...provenance,
  study: studyId,
  localized: z.strictObject({ en: localizedHighlight, he: localizedHighlight }),
});
