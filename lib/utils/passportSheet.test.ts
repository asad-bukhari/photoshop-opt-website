import { describe, expect, it } from 'vitest';
import { computeGrid, resolveCopies, selectPositions } from './passportSheet';
import { DEFAULT_PASSPORT_SETTINGS } from '../data/passportSheet';

describe('computeGrid', () => {
  it('fits 35 x 45 mm photos on A4', () => {
    const grid = computeGrid(210, 297, 35, 45, 3, 5);
    expect(grid.columns).toBe(5);
    expect(grid.rows).toBe(6);
    expect(grid.capacity).toBe(30);
    expect(grid.widthMm).toBeCloseTo(187);
    expect(grid.heightMm).toBeCloseTo(285);
    expect(grid.positions).toHaveLength(30);
  });

  it('fits 2 x 2 inch photos on 4 x 6 inch paper', () => {
    const grid = computeGrid(101.6, 152.4, 50.8, 50.8, 2, 3);
    expect(grid.columns).toBe(1);
    expect(grid.rows).toBe(2);
    expect(grid.capacity).toBe(2);
    expect(grid.positions).toHaveLength(2);
  });

  it('fits 35 x 45 mm photos on 3R', () => {
    const grid = computeGrid(88.9, 127, 35, 45, 0, 2);
    expect(grid.columns).toBe(2);
    expect(grid.rows).toBe(2);
    expect(grid.capacity).toBe(4);
  });

  it('keeps every position inside the margins', () => {
    const grid = computeGrid(210, 297, 35, 45, 3, 5);
    for (const position of grid.positions) {
      expect(position.xMm).toBeGreaterThanOrEqual(5 - 1e-9);
      expect(position.yMm).toBeGreaterThanOrEqual(5 - 1e-9);
      expect(position.xMm + 35).toBeLessThanOrEqual(205 + 1e-9);
      expect(position.yMm + 45).toBeLessThanOrEqual(292 + 1e-9);
    }
  });

  it('returns no capacity when the photo cannot fit', () => {
    expect(computeGrid(88.9, 127, 60, 60, 2, 20).capacity).toBe(0);
  });
});

describe('resolveCopies', () => {
  it('uses the full capacity in auto mode', () => {
    expect(resolveCopies({ ...DEFAULT_PASSPORT_SETTINGS, copiesMode: 'auto' }, 12)).toBe(12);
  });

  it('caps a custom count at the capacity', () => {
    expect(resolveCopies({ ...DEFAULT_PASSPORT_SETTINGS, copiesMode: 'custom', copies: 5 }, 12)).toBe(5);
    expect(resolveCopies({ ...DEFAULT_PASSPORT_SETTINGS, copiesMode: 'custom', copies: 20 }, 12)).toBe(12);
    expect(resolveCopies({ ...DEFAULT_PASSPORT_SETTINGS, copiesMode: 'custom', copies: 0 }, 12)).toBe(1);
  });

  it('returns zero when nothing fits', () => {
    expect(resolveCopies(DEFAULT_PASSPORT_SETTINGS, 0)).toBe(0);
  });
});

describe('selectPositions', () => {
  it('centres a partial last row', () => {
    const grid = computeGrid(210, 297, 35, 45, 3, 5);
    const positions = selectPositions(grid, 7);
    expect(positions).toHaveLength(7);
    expect(positions[0].xMm).toBeCloseTo(11.5);
    expect(positions[5].xMm).toBeCloseTo(68.5);
    expect(positions[5].yMm).toBeCloseTo(54);
  });

  it('returns no positions for zero copies', () => {
    const grid = computeGrid(210, 297, 35, 45, 3, 5);
    expect(selectPositions(grid, 0)).toEqual([]);
  });
});
