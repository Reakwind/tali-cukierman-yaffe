import assert from 'node:assert/strict';
import test from 'node:test';
import { handleEnquiry, type Env } from '../../worker/index.ts';

const recipients = [
  'reakwind@gmail.com',
  'hagarshimon@gmail.com',
  'yasminshtig@gmail.com',
  'tcukierm@gmail.com',
];
const request = (
  fields: Record<string, string> = {},
  headers: Record<string, string> = {},
) =>
  new Request('https://lab.example/api/participation', {
    method: 'POST',
    headers: {
      Origin: 'https://lab.example',
      Accept: 'application/json',
      ...headers,
    },
    body: new URLSearchParams({
      firstName: 'Test',
      contact: 'participant@example.invalid',
      study: 'birax',
      locale: 'en',
      ...fields,
    }),
  });
const assets = { fetch: async () => new Response('asset') };

test('unconfigured delivery cannot pretend that an enquiry was sent', async () => {
  const response = await handleEnquiry(request(), { ASSETS: assets });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, 'unavailable');
});

test('a valid enquiry is delivered to exactly the four owner-supplied recipients', async () => {
  const messages: unknown[] = [];
  const env: Env = {
    ASSETS: assets,
    ENQUIRIES_ENABLED: 'true',
    EMAIL_FROM: 'research@lab.example',
    EMAIL: {
      send: async (message) => {
        messages.push(message);
        return { messageId: 'test-message' };
      },
    },
  };
  const response = await handleEnquiry(request(), env, async () => true);
  assert.equal(response.status, 200);
  assert.equal(messages.length, 1);
  assert.deepEqual((messages[0] as { to: string[] }).to, recipients);
  assert.equal(
    (messages[0] as { replyTo: string }).replyTo,
    'participant@example.invalid',
  );
});

test('a general enquiry reaches the team without selecting a study', async () => {
  const messages: { subject: string; text: string; to: string[] }[] = [];
  const env: Env = {
    ASSETS: assets,
    ENQUIRIES_ENABLED: 'true',
    EMAIL_FROM: 'research@lab.example',
    EMAIL: {
      send: async (message) => {
        messages.push(message);
        return { messageId: 'test-general' };
      },
    },
  };
  const response = await handleEnquiry(
    request({ study: 'general' }),
    env,
    async () => true,
  );
  assert.equal(response.status, 200);
  assert.equal(messages.length, 1);
  const message = messages[0];
  assert.ok(message);
  assert.deepEqual(message.to, recipients);
  assert.match(message.subject, /General research participation/);
  assert.match(message.text, /General research participation/);
});

test('invalid or unrelated submissions never trigger email', async () => {
  let sends = 0;
  const env: Env = {
    ASSETS: assets,
    ENQUIRIES_ENABLED: 'true',
    EMAIL_FROM: 'research@lab.example',
    EMAIL: {
      send: async () => {
        sends++;
        return { messageId: 'test' };
      },
    },
  };
  for (const fields of [
    { contact: '' },
    { study: 'hybrid-closed-loop' },
    { contact: 'bad\r\nBcc: other@example.invalid' },
    { recipient: 'other@example.invalid' },
  ]) {
    const response = await handleEnquiry(
      request(fields),
      env,
      async () => true,
    );
    assert.equal(response.status, 400);
  }
  assert.equal(
    (await handleEnquiry(request({}, { Origin: 'https://other.example' }), env))
      .status,
    403,
  );
  assert.equal(sends, 0);
});

test('provider failure cannot produce a success response', async () => {
  const env: Env = {
    ASSETS: assets,
    ENQUIRIES_ENABLED: 'true',
    EMAIL_FROM: 'research@lab.example',
    EMAIL: {
      send: async () => {
        throw new Error('provider unavailable');
      },
    },
  };
  assert.equal(
    (await handleEnquiry(request(), env, async () => true)).status,
    502,
  );
});

test('native form submission redirects only after successful email acceptance', async () => {
  const env: Env = {
    ASSETS: assets,
    ENQUIRIES_ENABLED: 'true',
    EMAIL_FROM: 'research@lab.example',
    EMAIL: { send: async () => ({ messageId: 'test' }) },
  };
  const response = await handleEnquiry(
    request({ locale: 'he' }, { Accept: 'text/html' }),
    env,
    async () => true,
  );
  assert.equal(response.status, 303);
  assert.equal(
    response.headers.get('Location'),
    'https://lab.example/he/participation/thank-you/',
  );
});

test('failed bot verification prevents email delivery', async () => {
  let sends = 0;
  const env: Env = {
    ASSETS: assets,
    ENQUIRIES_ENABLED: 'true',
    EMAIL_FROM: 'research@lab.example',
    EMAIL: {
      send: async () => {
        sends++;
        return { messageId: 'test' };
      },
    },
  };
  const response = await handleEnquiry(request(), env, async () => false);
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'verification');
  assert.equal(sends, 0);
});

test('Turnstile must confirm this website and this form action', async (context) => {
  let sends = 0;
  const env: Env = {
    ASSETS: assets,
    ENQUIRIES_ENABLED: 'true',
    EMAIL_FROM: 'research@lab.example',
    TURNSTILE_SECRET_KEY: 'test-only-not-a-secret',
    EMAIL: {
      send: async () => {
        sends++;
        return { messageId: 'test' };
      },
    },
  };
  const mocked = context.mock.method(globalThis, 'fetch', async () =>
    Response.json({
      success: true,
      hostname: 'other.example',
      action: 'participation',
    }),
  );
  assert.equal(
    (
      await handleEnquiry(
        request({ 'cf-turnstile-response': 'test-token' }),
        env,
      )
    ).status,
    400,
  );
  mocked.mock.mockImplementation(async () =>
    Response.json({
      success: true,
      hostname: 'lab.example',
      action: 'different-form',
    }),
  );
  assert.equal(
    (
      await handleEnquiry(
        request({ 'cf-turnstile-response': 'test-token' }),
        env,
      )
    ).status,
    400,
  );
  assert.equal(sends, 0);
  mocked.mock.mockImplementation(async () =>
    Response.json({
      success: true,
      hostname: 'lab.example',
      action: 'participation',
    }),
  );
  assert.equal(
    (
      await handleEnquiry(
        request({ 'cf-turnstile-response': 'test-token' }),
        env,
      )
    ).status,
    200,
  );
  assert.equal(sends, 1);
});

test('unsupported methods and oversized bodies cannot reach delivery', async () => {
  const env: Env = { ASSETS: assets };
  assert.equal(
    (
      await handleEnquiry(
        new Request('https://lab.example/api/participation'),
        env,
      )
    ).status,
    405,
  );
  assert.equal(
    (await handleEnquiry(request({ firstName: 'x'.repeat(5000) }), env)).status,
    413,
  );
});
