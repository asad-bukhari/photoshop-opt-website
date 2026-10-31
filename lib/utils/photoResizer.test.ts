import { describe, expect, it } from 'vitest';
import {
  computeLabelStripHeight,
  computeSourceCrop,
  convertUnitValue,
  evaluateSizeTarget,
  getOutputSize,
  unitToPixels,
  validateOutputSize
} from './photoResizer';
import { DEFAULT_PHOTO_RESIZE_SETTINGS } from '../data/photoResizer';

describe('unitToPixels', () => {
  it('converts physical units at the chosen DPI', () => {
    expect(unitToPixels(35, 'mm', 300)).toBe(413);
    expect(unitToPixels(2, 'in', 300)).toBe(600);
    expect(unitToPixels(2.54, 'cm', 300)).toBe(300);
    expect(unitToPixels(300, 'px', 300)).toBe(300);
  });

  it('returns zero for invalid input', () => {
    expect(unitToPixels(Number.NaN, 'mm', 300)).toBe(0);
    expect(unitToPixels(10, 'px', Number.NaN)).toBe(0);
  });
});

describe('convertUnitValue', () => {
  it('keeps the physical size when changing units', () => {
    expect(convertUnitValue(35, 'mm', 'cm', 300)).toBe(3.5);
    expect(convertUnitValue(2, 'in', 'px', 300)).toBe(600);
    expect(convertUnitValue(600, 'px', 'in', 300)).toBe(2);
  });
});

describe('getOutputSize', () => {
  it('uses the preset dimensions and DPI', () => {
    expect(getOutputSize(DEFAULT_PHOTO_RESIZE_SETTINGS)).toEqual({ width: 413, height: 531 });
  });

  it('returns zero for an empty custom size', () => {
    expect(getOutputSize({ ...DEFAULT_PHOTO_RESIZE_SETTINGS, width: 0, height: 0 })).toEqual({ width: 0, height: 0 });
  });
});

describe('computeSourceCrop', () => {
  it('covers a portrait output from a landscape source', () => {
    const crop = computeSourceCrop(1000, 500, 300, 400, 'fill', 1, 0, 0);
    expect(crop.sw).toBeCloseTo(375);
    expect(crop.sh).toBeCloseTo(500);
    expect(crop.sx).toBeCloseTo(312.5);
    expect(crop.sy).toBeCloseTo(0);
  });

  it('pans to the edge at offset 1', () => {
    const crop = computeSourceCrop(1000, 500, 300, 400, 'fill', 1, 1, 0);
    expect(crop.sx).toBeCloseTo(625);
  });

  it('crops tighter with zoom', () => {
    const crop = computeSourceCrop(1000, 500, 300, 400, 'fill', 2, 0, 0);
    expect(crop.sw).toBeCloseTo(187.5);
    expect(crop.sh).toBeCloseTo(250);
  });

  it('keeps the full source for fit and stretch', () => {
    expect(computeSourceCrop(1000, 500, 300, 400, 'fit', 2, 1, 1)).toEqual({
      sx: 0,
      sy: 0,
      sw: 1000,
      sh: 500
    });
    expect(computeSourceCrop(1000, 500, 300, 400, 'stretch', 1, 0, 0)).toEqual({
      sx: 0,
      sy: 0,
      sw: 1000,
      sh: 500
    });
  });
});

describe('computeLabelStripHeight', () => {
  it('uses the percent and clamps to the image', () => {
    expect(computeLabelStripHeight(1000, 18)).toBe(180);
    expect(computeLabelStripHeight(1000, 90)).toBe(400);
    expect(computeLabelStripHeight(10, 5)).toBe(1);
  });
});

describe('evaluateSizeTarget', () => {
  it('reports ok, over and under states', () => {
    expect(evaluateSizeTarget(40 * 1024, 50, 0, 'jpeg').status).toBe('ok');
    expect(evaluateSizeTarget(60 * 1024, 50, 0, 'jpeg').status).toBe('over');
    expect(evaluateSizeTarget(10 * 1024, 50, 20, 'jpeg').status).toBe('under');
  });

  it('ignores the target for PNG', () => {
    expect(evaluateSizeTarget(500 * 1024, 20, 0, 'png').status).toBe('ignored');
  });
});

describe('validateOutputSize', () => {
  it('rejects empty and oversized outputs', () => {
    expect(validateOutputSize(0, 400)).not.toBeNull();
    expect(validateOutputSize(6001, 400)).toContain('6000');
    expect(validateOutputSize(413, 531)).toBeNull();
  });
});
