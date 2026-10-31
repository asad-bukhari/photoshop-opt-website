import { describe, expect, it } from 'vitest';
import { buildFilename, filenameStem, formatBytes } from './format';

describe('formatBytes', () => {
  it('handles empty and invalid values', () => {
    expect(formatBytes(0)).toBe('0 KB');
    expect(formatBytes(-1)).toBe('0 KB');
    expect(formatBytes(Number.NaN)).toBe('0 KB');
  });

  it('formats bytes, kilobytes and megabytes', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(15360)).toBe('15 KB');
    expect(formatBytes(1048576)).toBe('1.00 MB');
  });
});

describe('filename helpers', () => {
  it('strips the extension and unsafe characters', () => {
    expect(filenameStem('my photo.JPG')).toBe('my_photo');
    expect(filenameStem('a/b:c.png')).toBe('a_b_c');
  });

  it('builds a download name', () => {
    expect(buildFilename('my photo.jpg', '300x400_20kb', 'jpg')).toBe('my_photo_300x400_20kb.jpg');
    expect(buildFilename('', '', '.png')).toBe('file.png');
  });
});
