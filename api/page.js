import { get } from '@vercel/blob';
import { PAGE_COUNT, checkAccess } from './_lib.js';

// Streams one page image to a computer holding a valid access cookie; the image itself is never public.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const n = Number(req.query.n);
  if (!Number.isInteger(n) || n < 1 || n > PAGE_COUNT) return res.status(404).end();
  if (!checkAccess(req)) return res.status(403).end();
  const b = await get(`guide/pages/${n}.webp`, { access: 'private', token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!b || b.statusCode !== 200) return res.status(404).end();
  res.setHeader('Content-Type', 'image/webp');
  res.setHeader('Content-Disposition', 'inline');
  res.send(Buffer.from(await new Response(b.stream).arrayBuffer()));
}
