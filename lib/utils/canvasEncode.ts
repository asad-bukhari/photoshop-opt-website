export function estimateDataUrlSize(dataUrl: string): number {
  const base64Length = dataUrl.split(',')[1].length;
  return Math.round(base64Length * 0.75);
}

export interface TuneResult {
  dataUrl: string;
  overTarget: boolean;
}

export function tuneToTarget(canvas: HTMLCanvasElement, mimeType: string, targetBytes: number): TuneResult {
  const encodeAt = (q: number) => canvas.toDataURL(mimeType, q);
  let lo = 0.05;
  let hi = 1.0;
  let bestDataUrl: string | null = null;

  for (let i = 0; i < 8; i++) {
    const q = (lo + hi) / 2;
    const dataUrl = encodeAt(q);
    if (estimateDataUrlSize(dataUrl) <= targetBytes) {
      bestDataUrl = dataUrl;
      lo = q;
    } else {
      hi = q;
    }
  }

  if (bestDataUrl) {
    return { dataUrl: bestDataUrl, overTarget: false };
  }
  return { dataUrl: encodeAt(0.05), overTarget: true };
}
