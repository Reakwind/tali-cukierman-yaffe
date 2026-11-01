import { z } from 'astro/zod';

const text = z.string().trim().min(10);
const localizedStudy = z.strictObject({
  title: text,
  summary: text,
  homepageSummary: text.optional(),
  population: text,
  location: text,
  duration: text,
  activities: z.array(text).min(1),
  caution: text,
  research: z.array(text).min(1),
});

const shared = {
  acronym: z.string().trim().min(2).max(40).optional(),
  sourceChecked: z.iso.date(),
  recruitment: z
    .strictObject({
      status: z.literal('recruiting'),
      confirmedOn: z.iso.date(),
      source: z.literal('owner'),
    })
    .optional(),
  // A live enquiry flow requires an explicitly approved, separately tested feature.
  approval: z.literal('draft'),
  enquiriesAvailable: z.literal(false),
  localized: z.strictObject({ en: localizedStudy, he: localizedStudy }),
};

const trial = z
  .strictObject({
    ...shared,
    kind: z.literal('trial'),
    registryId: z.string().regex(/^NCT\d{8}$/),
    registryUrl: z.url(),
    registryStatus: z.enum(['RECRUITING', 'COMPLETED']),
    registryUpdated: z.iso.date(),
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

const project = z.strictObject({
  ...shared,
  kind: z.literal('project'),
  registryStatus: z.literal('NOT_VERIFIED'),
  sourceUrl: z.url({ protocol: /^https$/ }),
});

export const studySchema = z
  .discriminatedUnion('kind', [trial, project])
  .refine(
    (study) => study.registryStatus !== 'COMPLETED' || !study.recruitment,
    {
      message: 'A completed trial cannot advertise participant recruitment.',
      path: ['recruitment'],
    },
  );
