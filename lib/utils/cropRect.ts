import type { CropPercent, ImageRotation } from '../types';

export function computeCropRect(
  width: number,
  height: number,
  crop: CropPercent
): { sx: number; sy: number; sw: number; sh: number } {
  const left = Math.max(0, Math.min(45, crop.left));
  const right = Math.max(0, Math.min(45, crop.right));
  const top = Math.max(0, Math.min(45, crop.top));
  const bottom = Math.max(0, Math.min(45, crop.bottom));

  const sx = (width * left) / 100;
  const sy = (height * top) / 100;
  const sw = Math.max(1, (width * (100 - left - right)) / 100);
  const sh = Math.max(1, (height * (100 - top - bottom)) / 100);

  return { sx, sy, sw, sh };
}

export function rotatedDimensions(
  width: number,
  height: number,
  rotation: ImageRotation
): { width: number; height: number } {
  return rotation === 90 || rotation === 270 ? { width: height, height: width } : { width, height };
}
