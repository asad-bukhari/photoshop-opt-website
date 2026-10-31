import { describe, expect, it } from 'vitest';
import {
  computeImagePlacement,
  getJpegQuality,
  getScaledDimensions,
  nextRotation,
  resolvePageSize,
  shouldDownscale
} from './imagesToPdf';

describe('resolvePageSize', () => {
  it('returns portrait page sizes', () => {
    const a4 = resolvePageSize('a4', 'portrait', 1600, 900, 0);
    expect(a4.width).toBeCloseTo(595.28);
    expect(a4.height).toBeCloseTo(841.89);

    const letter = resolvePageSize('letter', 'auto', 600, 900, 0);
    expect(letter).toEqual({ width: 612, height: 792 });
  });

  it('turns fixed pages when the image is landscape', () => {
    const page = resolvePageSize('a4', 'auto', 1600, 900, 0);
    expect(page.width).toBeCloseTo(841.89);
    expect(page.height).toBeCloseTo(595.28);
  });

  it('honours a forced orientation', () => {
    const page = resolvePageSize('legal', 'landscape', 600, 900, 0);
    expect(page).toEqual({ width: 1008, height: 612 });
  });

  it('fits the page to the image plus margins', () => {
    expect(resolvePageSize('fit', 'auto', 800, 1200, 36)).toEqual({ width: 872, height: 1272 });
  });
});

describe('computeImagePlacement', () => {
  it('centres a portrait image on a landscape page', () => {
    const placement = computeImagePlacement(1000, 600, 400, 800, 0);
    expect(placement.width).toBeCloseTo(300);
    expect(placement.height).toBeCloseTo(600);
    expect(placement.x).toBeCloseTo(350);
    expect(placement.y).toBeCloseTo(0);
  });

  it('respects the margin', () => {
    const placement = computeImagePlacement(640, 640, 600, 600, 20);
    expect(placement.width).toBeCloseTo(600);
    expect(placement.height).toBeCloseTo(600);
    expect(placement.x).toBeCloseTo(20);
    expect(placement.y).toBeCloseTo(20);
  });
});

describe('image helpers', () => {
  it('caps the long side at 4000 px', () => {
    expect(shouldDownscale(4000, 3000)).toBe(false);
    expect(shouldDownscale(4001, 3000)).toBe(true);
    expect(getScaledDimensions(8000, 4000)).toEqual({ width: 4000, height: 2000 });
  });

  it('cycles rotations', () => {
    expect(nextRotation(0)).toBe(90);
    expect(nextRotation(90)).toBe(180);
    expect(nextRotation(180)).toBe(270);
    expect(nextRotation(270)).toBe(0);
  });

  it('maps quality presets', () => {
    expect(getJpegQuality('original')).toBe(0.95);
    expect(getJpegQuality('high')).toBe(0.85);
    expect(getJpegQuality('small')).toBe(0.6);
  });
});
