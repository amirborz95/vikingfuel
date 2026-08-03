import { PRODUCTS, SITE_URL, absoluteUrl } from '@/lib/catalog';

// Google Merchant Center product feed (RSS 2.0 + g: namespace).
// Add this URL in Merchant Center → Products → Feeds:  https://vikingfuel.se/feed.xml
export const dynamic = 'force-static';

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function GET() {
  const items = PRODUCTS.map((p) => `
    <item>
      <g:id>${esc(p.id)}</g:id>
      <g:title>${esc(p.name)}</g:title>
      <g:description>${esc(p.description)}</g:description>
      <g:link>${esc(absoluteUrl(p.url))}</g:link>
      <g:image_link>${esc(absoluteUrl(p.image))}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${p.price}.00 SEK</g:price>
      <g:brand>Viking Fuel</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>Hälsa &amp; kosttillskott &gt; Energitillskott</g:product_type>
      <g:google_product_category>469</g:google_product_category>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Viking Fuel</title>
    <link>${esc(SITE_URL)}</link>
    <description>Naturliga kosttillskott för energi och vitalitet.</description>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
