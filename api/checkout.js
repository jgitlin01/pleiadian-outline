// Starts a Stripe Checkout for the Field Guide and sends the buyer there.
export default async function handler(req, res) {
  const origin = `https://${req.headers.host}`;
  const body = new URLSearchParams({
    mode: 'payment',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': '3330',
    'line_items[0][price_data][product_data][tax_code]': 'txcd_10302000', // digital book, downloaded
    'line_items[0][price_data][product_data][name]': 'Field Guide to the Pleiadian New Age Movement (digital)',
    success_url: `${origin}/api/download?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#obtain`,
  });
  const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    body,
  });
  const s = await r.json();
  if (!r.ok) return res.status(502).send('Checkout is unavailable right now. Please try again later.');
  res.redirect(303, s.url);
}
