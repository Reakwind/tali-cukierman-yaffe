import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { visualStudySchema } from '../../src/lib/visual-study-schema.ts';

const data = JSON.parse(
  readFileSync('src/content/visual-studies.json', 'utf8'),
);
test('visual study records retain the sourced bilingual protocol and result values', () => {
  for (const record of data)
    assert.equal(visualStudySchema.safeParse(record).success, true);
  const trial = data.find(
    (record: { id: string }) => record.id === 'stay-strong',
  );
  assert.deepEqual(trial.assessmentWeeks, [0, 8, 16, 26]);
  assert.equal(trial.durationWeeks, 26);
  const result = data.find(
    (record: { id: string }) => record.id === 'hybrid-closed-loop',
  );
  assert.deepEqual(result.timeInRange, { automated: 76.9, standard: 64 });
  assert.equal(result.participants, 42);
});
test('visual data rejects missing Hebrew, impossible percentages and mismatched visit schedules', () => {
  const result = structuredClone(
    data.find((record: { kind: string }) => record.kind === 'result'),
  );
  result.timeInRange.automated = 150;
  assert.equal(visualStudySchema.safeParse(result).success, false);
  const project = structuredClone(data[0]);
  delete project.localized.he;
  assert.equal(visualStudySchema.safeParse(project).success, false);
  const trial = structuredClone(
    data.find((record: { kind: string }) => record.kind === 'trial'),
  );
  trial.assessmentWeeks = [0, 8, 16, 30];
  assert.equal(visualStudySchema.safeParse(trial).success, false);
});
