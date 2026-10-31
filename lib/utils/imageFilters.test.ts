import { describe, expect, it } from 'vitest';
import { clamp255, computeOtsuThreshold } from './imageFilters';

describe('clamp255', () => {
  it('clamps values to the byte range', () => {
    expect(clamp255(-4)).toBe(0);
    expect(clamp255(0)).toBe(0);
    expect(clamp255(128)).toBe(128);
    expect(clamp255(255)).toBe(255);
    expect(clamp255(300)).toBe(255);
  });
});

describe('computeOtsuThreshold', () => {
  it('splits a two-level image', () => {
    const values = new Float32Array([0, 0, 255, 255]);
    expect(computeOtsuThreshold(values, values.length)).toBe(0);
  });

  it('returns the midpoint fallback for a flat image', () => {
    const values = new Float32Array([10, 10, 10, 10]);
    expect(computeOtsuThreshold(values, values.length)).toBe(127);
  });
});
