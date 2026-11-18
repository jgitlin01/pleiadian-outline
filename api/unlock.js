import { randomUUID } from 'node:crypto';
import { PAGE_COUNT, stripe, cookies, accessCookie } from './_lib.js';

const FOREVER = 'Max-Age=315360000; Path=/; HttpOnly; Secure; SameSite=Lax';

// Opens the reader for a paid key, and locks the key to the first computer that uses it.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const key = String(req.query.key || '');
  if (!/^cs_[A-Za-z0-9_]+$/.test(key)) return res.status(400).json({ error: 'This reader link is not valid.' });
  const s = await stripe(`checkout/sessions/${key}`);
  if (!s || s.payment_status !== 'paid') return res.status(402).json({ error: 'This purchase has not been paid.' });

  const device = cookies(req).pnam_device || randomUUID();
  const bound = s.metadata?.device;
  if (bound && bound !== device) {
    return res.status(403).json({ error: 'This Field Guide key is already in use on another computer. Each purchase can be read on one computer only. If you have changed computers or cleared your browser, please contact PNAM.' });
  }
  if (!bound) await stripe(`checkout/sessions/${key}`, { 'metadata[device]': device });

  res.setHeader('Set-Cookie', [
    `pnam_device=${device}; ${FOREVER}`,
    `pnam_access=${accessCookie(key, device)}; ${FOREVER}`,
  ]);
  res.json({ pages: PAGE_COUNT, email: s.customer_details?.email || '' });
}
