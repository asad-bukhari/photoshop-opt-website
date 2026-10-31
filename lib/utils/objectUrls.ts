export function createObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeObjectUrl(url: string | null | undefined): void {
  if (!url || !url.startsWith('blob:')) return;
  URL.revokeObjectURL(url);
}

export function revokeObjectUrls(urls: Iterable<string | null | undefined>): void {
  for (const url of urls) {
    revokeObjectUrl(url);
  }
}
