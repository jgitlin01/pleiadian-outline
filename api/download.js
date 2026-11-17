import { issueSignedToken, presignUrl } from '@vercel/blob';

const PATHNAME = 'guide/field-guide-test.pdf';
const WEEK = 7 * 24 * 3600;

// After payment, Stripe sends the buyer here; a paid session gets a 15-minute link to the PDF.
export default async function handler(req, res) {
  const id = String(req.query.session_id || '');
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return res.status(400).send('Missing purchase reference.');
  const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${id}`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
  });
  const s = await r.json();
  if (!r.ok || s.payment_status !== 'paid') return res.status(402).send('This purchase has not been paid.');
  if (Date.now() / 1000 - s.created > WEEK) return res.status(410).send('This download link has expired. Please contact PNAM.');
  const validUntil = Date.now() + 15 * 60 * 1000;
  const token = await issueSignedToken({ pathname: PATHNAME, operations: ['get'], validUntil, token: process.env.BLOB_READ_WRITE_TOKEN });
  const { presignedUrl } = await presignUrl(token, { access: 'private', operation: 'get', pathname: PATHNAME, validUntil });
  res.redirect(302, presignedUrl);
}
