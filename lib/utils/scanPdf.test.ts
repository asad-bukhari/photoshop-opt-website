import { describe, expect, it } from 'vitest';
import { applyScanFilter, computeCropRect, rotatedDimensions } from './scanPdf';

function makeImageData(values: number[]): ImageData {
  return {
    data: new Uint8ClampedArray(values),
    width: values.length / 4,
    height: 1,
    colorSpace: 'srgb'
  } as ImageData;
}

describe('computeCropRect', () => {
  it('converts percentages into a source rectangle', () => {
    expect(computeCropRect(1000, 500, { left: 10, right: 20, top: 5, bottom: 15 })).toEqual({
      sx: 100,
      sy: 25,
      sw: 700,
      sh: 400
    });
  });

  it('clamps extreme values and keeps at least one pixel', () => {
    const rect = computeCropRect(100, 100, { left: 60, right: 60, top: -10, bottom: 0 });
    expect(rect.sx).toBe(45);
    expect(rect.sw).toBe(10);
    expect(rect.sy).toBe(0);
  });
});

describe('rotatedDimensions', () => {
  it('swaps width and height for quarter turns', () => {
    expect(rotatedDimensions(100, 200, 0)).toEqual({ width: 100, height: 200 });
    expect(rotatedDimensions(100, 200, 90)).toEqual({ width: 200, height: 100 });
    expect(rotatedDimensions(100, 200, 180)).toEqual({ width: 100, height: 200 });
    expect(rotatedDimensions(100, 200, 270)).toEqual({ width: 200, height: 100 });
  });
});

describe('applyScanFilter', () => {
  it('leaves the original untouched', () => {
    const image = makeImageData([10, 20, 30, 255]);
    applyScanFilter(image, 'original');
    expect(Array.from(image.data)).toEqual([10, 20, 30, 255]);
  });

  it('brightens colour pixels', () => {
    const image = makeImageData([100, 100, 100, 255]);
    applyScanFilter(image, 'brighten');
    expect(image.data[0]).toBe(124);
    expect(image.data[3]).toBe(255);
  });

  it('produces grey pixels for grayscale and B&W', () => {
    const grey = makeImageData([255, 0, 0, 255, 0, 255, 0, 255]);
    applyScanFilter(grey, 'grayscale');
    expect(grey.data[0]).toBe(grey.data[1]);
    expect(grey.data[1]).toBe(grey.data[2]);

    const bw = makeImageData([255, 0, 0, 255, 0, 255, 0, 255]);
    applyScanFilter(bw, 'bw');
    expect(bw.data[0]).toBe(bw.data[1]);
    expect(bw.data[1]).toBe(bw.data[2]);
    expect(bw.data[0]).toBeGreaterThanOrEqual(0);
    expect(bw.data[0]).toBeLessThanOrEqual(255);
  });
});
