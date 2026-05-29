'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const lastSentKey = useRef('');
  const geoCache = useRef<{
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);

  const fetchGeoInfo = async () => {
    if (geoCache.current) {
      return geoCache.current;
    }

    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) {
        throw new Error('Geo lookup failed');
      }
      const info = await res.json();
      const geo = {
        country: info.country_name || info.country || undefined,
        region: info.region || undefined,
        city: info.city || undefined,
        latitude:
          typeof info.latitude === 'number'
            ? info.latitude
            : typeof info.latitude === 'string'
            ? Number(info.latitude)
            : undefined,
        longitude:
          typeof info.longitude === 'number'
            ? info.longitude
            : typeof info.longitude === 'string'
            ? Number(info.longitude)
            : undefined,
      };
      geoCache.current = geo;
      return geo;
    } catch {
      geoCache.current = {};
      return {};
    }
  };

  useEffect(() => {
    const email = user?.email || 'anonymous';
    const pageTitle = document.title || pathname;
    const key = `${pathname}|${email}`;

    if (lastSentKey.current === key) {
      return;
    }

    lastSentKey.current = key;

    const sendVisit = async (geo?: {
      country?: string;
      region?: string;
      city?: string;
      latitude?: number;
      longitude?: number;
    }) => {
      const payload = {
        page: pageTitle,
        path: pathname,
        email,
        ...geo,
      };

      fetch('/api/analytics/visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Analytics is best-effort only.
      });
    };

    const maybeSend = async () => {
      const baseGeo = await fetchGeoInfo();

      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await sendVisit({
              ...baseGeo,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          async () => {
            await sendVisit(baseGeo);
          },
          { maximumAge: 1000 * 60 * 5, timeout: 5000 }
        );
      } else {
        await sendVisit(baseGeo);
      }
    };

    maybeSend();
  }, [pathname, user?.email]);

  return null;
}
