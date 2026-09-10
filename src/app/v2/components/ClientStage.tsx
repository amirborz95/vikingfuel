'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// The product layer and the pinned stage are browser-only (scroll, rAF,
// pinning), so they load client-side. Heights are reserved by the components
// themselves, which keeps CLS at zero while they arrive.
const BottleStage = dynamic(() => import('./BottleStage'), { ssr: false });
const Stage = dynamic(() => import('./sections/Stage'), { ssr: false });

export default function ClientStage() {
  // Review helper: /v2?nostage=1 drops the opening film so the sections below
  // it can be looked at on their own.
  const [skip, setSkip] = useState(false);
  useEffect(() => {
    setSkip(new URLSearchParams(window.location.search).has('nostage'));
  }, []);

  if (skip) return null;

  return (
    <>
      <BottleStage />
      <Stage />
    </>
  );
}
