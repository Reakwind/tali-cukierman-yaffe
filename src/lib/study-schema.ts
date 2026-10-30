import { z } from 'astro/zod';

const text = z.string().trim().min(10);
const localizedStudy = z.strictObject({
  title: text,
  summary: text,
  population: text,
  location: text,
  duration: text,
  activities: z.array(text).min(1),
  caution: text,
});

export const studySchema = z
  .strictObject({
    registryId: z.string().regex(/^NCT\d{8}$/),
    acronym: z.string().trim().min(2).max(40).optional(),
    registryUrl: z.url(),
    registryStatus: z.enum(['RECRUITING', 'COMPLETED']),
    registryUpdated: z.iso.date(),
    sourceChecked: z.iso.date(),
    // A live enquiry flow requires an explicitly approved, separately tested feature.
    approval: z.literal('draft'),
    enquiriesAvailable: z.literal(false),
    localized: z.strictObject({ en: localizedStudy, he: localizedStudy }),
  })
  .refine(
    (study) =>
      study.registryUrl ===
      `https://clinicaltrials.gov/study/${study.registryId}`,
    {
      message: 'Use the matching official ClinicalTrials.gov record.',
      path: ['registryUrl'],
    },
  )
  .refine((study) => study.sourceChecked >= study.registryUpdated, {
    message: 'The source check must not precede the registry update.',
    path: ['sourceChecked'],
  });
