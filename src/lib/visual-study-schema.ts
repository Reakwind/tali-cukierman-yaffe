import { z } from 'astro/zod';
import { iconNames } from './diabetes-icons.ts';
const caption = z.string().trim().min(1).max(260);
const base = {
  sourceUrl: z.url({ protocol: /^https$/ }),
  sourceChecked: z.iso.date(),
  approval: z.literal('draft'),
};
const core = { lead: caption, audience: caption, visitNote: caption };
const features = z
  .array(z.strictObject({ icon: z.enum(iconNames), label: caption }))
  .min(1);
const bilingual = <T extends z.ZodType>(schema: T) =>
  z.strictObject({ en: schema, he: schema });
const assessment = z.strictObject({
  ...base,
  id: z.literal('birax'),
  kind: z.literal('assessment'),
  localized: bilingual(
    z.strictObject({
      ...core,
      features,
      partnership: caption,
      funding: caption,
    }),
  ),
});
const trial = z
  .strictObject({
    ...base,
    id: z.literal('stay-strong'),
    kind: z.literal('trial'),
    durationWeeks: z.number().int().positive(),
    assessmentWeeks: z.array(z.number().int().nonnegative()).min(2),
    weekly: z.strictObject({
      guided: z.number().int().positive(),
      guidedMinutes: z.number().int().positive(),
      home: z.number().int().nonnegative(),
      calls: z.number().int().nonnegative(),
    }),
    localized: bilingual(
      z.strictObject({
        ...core,
        features,
        allocation: caption,
        treatment: caption,
        intervention: caption,
        control: caption,
        weeklyTitle: caption,
        guided: caption,
        home: caption,
        calls: caption,
        dietitian: caption,
      }),
    ),
  })
  .refine(
    (record) =>
      record.assessmentWeeks[0] === 0 &&
      record.assessmentWeeks.at(-1) === record.durationWeeks &&
      record.assessmentWeeks.every(
        (week, index) =>
          week <= record.durationWeeks &&
          (index === 0 || week > record.assessmentWeeks[index - 1]!),
      ),
    {
      message:
        'Assessment visits must be ordered within the stated study duration.',
    },
  );
const methodStep = z.strictObject({
  id: z.enum(['six-vital', 'ml-frailty', 'interventions']),
  icons: z.array(z.enum(iconNames)).min(1),
  localized: bilingual(
    z.strictObject({
      title: caption,
      text: caption,
    }),
  ),
});
const methods = z.strictObject({
  ...base,
  id: z.literal('methods'),
  kind: z.literal('methods'),
  localized: bilingual(
    z.strictObject({
      heading: caption,
      lead: caption,
    }),
  ),
  steps: z.array(methodStep).length(3),
});
export const visualStudySchema = z.discriminatedUnion('kind', [
  assessment,
  trial,
  methods,
]);
