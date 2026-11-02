import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { visualStudySchema } from '../../src/lib/visual-study-schema.ts';

const data = JSON.parse(
  readFileSync('src/content/visual-studies.json', 'utf8'),
);
test('visual study records retain the sourced bilingual protocol and methods values without study results', () => {
  for (const record of data)
    assert.equal(visualStudySchema.safeParse(record).success, true);
  const trial = data.find(
    (record: { id: string }) => record.id === 'stay-strong',
  );
  assert.deepEqual(trial.assessmentWeeks, [0, 8, 16, 26]);
  assert.equal(trial.durationWeeks, 26);
  const methods = data.find(
    (record: { id: string }) => record.id === 'methods',
  );
  assert.ok(methods);
  assert.equal(methods.kind, 'methods');
  assert.deepEqual(
    methods.steps.map((step: { id: string }) => step.id),
    ['six-vital', 'ml-frailty', 'interventions'],
  );
  assert.equal(
    data.some((record: { kind: string }) => record.kind === 'result'),
    false,
  );
});
test('visual data rejects missing Hebrew, empty method steps and mismatched visit schedules', () => {
  const methods = structuredClone(
    data.find((record: { kind: string }) => record.kind === 'methods'),
  );
  methods.steps = [];
  assert.equal(visualStudySchema.safeParse(methods).success, false);
  const project = structuredClone(data[0]);
  delete project.localized.he;
  assert.equal(visualStudySchema.safeParse(project).success, false);
  const trial = structuredClone(
    data.find((record: { kind: string }) => record.kind === 'trial'),
  );
  trial.assessmentWeeks = [0, 8, 16, 30];
  assert.equal(visualStudySchema.safeParse(trial).success, false);
});
