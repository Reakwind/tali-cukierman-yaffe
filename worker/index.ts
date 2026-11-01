export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  EMAIL?: {
    send(message: {
      from: string;
      to: string[];
      subject: string;
      text: string;
      replyTo?: string;
    }): Promise<{ messageId: string }>;
  };
  EMAIL_FROM?: string;
  ENQUIRIES_ENABLED?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const recipients = [
  'reakwind@gmail.com',
  'hagarshimon@gmail.com',
  'yasminshtig@gmail.com',
  'tcukierm@gmail.com',
];
const email = /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;
const phone = /^\+?[\d ()-]{7,30}$/;
type Verify = (token: string, request: Request, env: Env) => Promise<boolean>;

async function verifyTurnstile(
  token: string,
  request: Request,
  env: Env,
): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY || !token || token.length > 2048) return false;
  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        signal: AbortSignal.timeout(8000),
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      },
    );
    const result = (await response.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };
    return (
      response.ok &&
      result.success === true &&
      result.hostname === new URL(request.url).hostname &&
      result.action === 'participation'
    );
  } catch {
    return false;
  }
}

export async function handleEnquiry(
  request: Request,
  env: Env,
  verify: Verify = verifyTurnstile,
): Promise<Response> {
  const headers = {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  };
  const json = (body: object, status: number) =>
    Response.json(body, { status, headers });
  if (request.method !== 'POST')
    return new Response('Method not allowed', {
      status: 405,
      headers: { ...headers, Allow: 'POST' },
    });
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return json({ error: 'origin' }, 403);
  if (
    !request.headers
      .get('content-type')
      ?.startsWith('application/x-www-form-urlencoded')
  )
    return json({ error: 'format' }, 415);
  // Bound the body while reading; no contact details are logged or persisted.
  const reader = request.body?.getReader();
  if (!reader) return json({ error: 'invalid' }, 400);
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 4096) {
      await reader.cancel();
      return json({ error: 'size' }, 413);
    }
    chunks.push(value);
  }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const data = new URLSearchParams(new TextDecoder().decode(body));
  const keys = [
    'firstName',
    'contact',
    'study',
    'locale',
    'cf-turnstile-response',
  ];
  if (
    [...data.keys()].some(
      (key) => !keys.includes(key) || data.getAll(key).length !== 1,
    )
  )
    return json({ error: 'invalid' }, 400);
  const firstName = data.get('firstName')?.trim() ?? '';
  const contact = data.get('contact')?.trim() ?? '';
  const study = data.get('study');
  const locale = data.get('locale');
  if (
    firstName.length > 80 ||
    /[\r\n]/.test(firstName) ||
    contact.length > 254 ||
    (!email.test(contact) && !phone.test(contact)) ||
    (study !== 'birax' && study !== 'stay-strong' && study !== 'general') ||
    (locale !== 'en' && locale !== 'he')
  )
    return json({ error: 'invalid' }, 400);
  if (
    env.ENQUIRIES_ENABLED !== 'true' ||
    !env.EMAIL ||
    !env.EMAIL_FROM ||
    !email.test(env.EMAIL_FROM)
  )
    return json({ error: 'unavailable' }, 503);
  if (!(await verify(data.get('cf-turnstile-response') ?? '', request, env)))
    return json({ error: 'verification' }, 400);
  const studyName = {
    birax: 'BIRAX',
    'stay-strong': 'STAY-STRONG',
    general: 'General research participation',
  }[study];
  try {
    const sent = await env.EMAIL.send({
      from: env.EMAIL_FROM,
      to: [...recipients],
      subject: `Website enquiry: ${studyName}`,
      text: `Study: ${studyName}\nFirst name: ${firstName || 'Not supplied'}\nContact: ${contact}\nLanguage: ${locale === 'he' ? 'Hebrew' : 'English'}`,
      ...(email.test(contact) ? { replyTo: contact } : {}),
    });
    if (!sent.messageId) throw new Error('Missing provider acknowledgement');
  } catch {
    return json({ error: 'delivery' }, 502);
  }
  return request.headers.get('accept')?.includes('application/json')
    ? json({ ok: true }, 200)
    : new Response(null, {
        status: 303,
        headers: {
          ...headers,
          Location: new URL(`/${locale}/participation/thank-you/`, request.url)
            .href,
        },
      });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return new URL(request.url).pathname === '/api/participation'
      ? handleEnquiry(request, env)
      : env.ASSETS.fetch(request);
  },
};
