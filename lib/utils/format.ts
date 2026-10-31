export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function filenameStem(name: string): string {
  return name.replace(/\.[^/.]+$/, '').replace(/[^\w.-]+/g, '_');
}

export function buildFilename(stem: string, suffix: string, extension: string): string {
  const cleanStem = filenameStem(stem) || 'file';
  const cleanSuffix = suffix.replace(/^_+/, '').replace(/[^\w.-]+/g, '_');
  return `${cleanStem}${cleanSuffix ? `_${cleanSuffix}` : ''}.${extension.replace(/^\./, '')}`;
}
