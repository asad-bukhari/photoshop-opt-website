import { describe, expect, it } from 'vitest';
import { estimateDataUrlSize } from './canvasEncode';

describe('estimateDataUrlSize', () => {
  it('estimates decoded bytes from the base64 payload', () => {
    expect(estimateDataUrlSize('data:image/jpeg;base64,AAAA')).toBe(3);
    expect(estimateDataUrlSize('data:image/jpeg;base64,')).toBe(0);
  });
});
