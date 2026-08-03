import React from 'react';

// Renders a schema.org JSON-LD <script>. Usable in both server and client
// components (no hooks). Google reads this for rich results.
export default function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
