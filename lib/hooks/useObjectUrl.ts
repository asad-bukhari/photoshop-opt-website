'use client';

import { useEffect, useState } from 'react';
import { createObjectUrl, revokeObjectUrl } from '../utils/objectUrls';

export function useObjectUrl(source: File | string | null): string | null {
  const [current, setCurrent] = useState<{ source: File; url: string } | null>(null);

  useEffect(() => {
    if (!(source instanceof File)) return undefined;
    const url = createObjectUrl(source);
    setCurrent({ source, url });
    return () => revokeObjectUrl(url);
  }, [source]);

  if (source instanceof File) {
    return current?.source === source ? current.url : null;
  }

  return source;
}
