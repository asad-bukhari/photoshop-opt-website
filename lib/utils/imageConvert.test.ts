import { describe, expect, it } from 'vitest';
import { clampQuality, getConvertExtension, getConvertMimeType } from './imageConvert';

describe('image converter helpers', () => {
  it('maps formats to MIME types and extensions', () => {
    expect(getConvertMimeType('jpeg')).toBe('image/jpeg');
    expect(getConvertMimeType('png')).toBe('image/png');
    expect(getConvertMimeType('webp')).toBe('image/webp');
    expect(getConvertExtension('jpeg')).toBe('jpg');
    expect(getConvertExtension('png')).toBe('png');
    expect(getConvertExtension('webp')).toBe('webp');
  });

  it('clamps quality to a safe range', () => {
    expect(clampQuality(0)).toBe(0.3);
    expect(clampQuality(0.7)).toBe(0.7);
    expect(clampQuality(2)).toBe(1);
  });
});
