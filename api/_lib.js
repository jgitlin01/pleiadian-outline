import { createHmac, timingSafeEqual } from 'node:crypto';

export const PAGE_COUNT = 12;

export function stripe(path, form) {
  return fetch(`https://api.stripe.com/v1/${path}`, {
    method: form ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    body: form ? new URLSearchParams(form) : undefined,
  }).then(async (r) => (r.ok ? r.json() : null));
}

export function cookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(/;\s*/).filter(Boolean).map((c) => {
    const i = c.indexOf('=');
    return [c.slice(0, i), decodeURIComponent(c.slice(i + 1))];
  }));
}

const sign = (s) => createHmac('sha256', process.env.READER_SECRET).update(s).digest('base64url');

// The access cookie ties one purchase key to one computer's device cookie.
export function accessCookie(key, device) {
  return `${key}.${device}.${sign(`${key}.${device}`)}`;
}

export function checkAccess(req) {
  const c = cookies(req);
  const [key, device, sig] = (c.pnam_access || '').split('.');
  if (!key || !sig || device !== c.pnam_device) return false;
  const want = Buffer.from(sign(`${key}.${device}`));
  const got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got);
}
