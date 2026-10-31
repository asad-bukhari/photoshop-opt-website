import type { PassportPaperSize, PassportPhotoPresetId, PassportSheetSettings } from '../types';

export const PASSPORT_PAPERS: Record<PassportPaperSize, { label: string; widthMm: number; heightMm: number }> = {
  '4x6': { label: '4 x 6 inch', widthMm: 101.6, heightMm: 152.4 },
  a4: { label: 'A4', widthMm: 210, heightMm: 297 },
  letter: { label: 'Letter', widthMm: 215.9, heightMm: 279.4 },
  '3r': { label: '3R', widthMm: 88.9, heightMm: 127 }
};

export const PASSPORT_PHOTO_PRESETS: {
  id: Exclude<PassportPhotoPresetId, 'custom'>;
  label: string;
  widthMm: number;
  heightMm: number;
  note: string;
}[] = [
  {
    id: '35x45',
    label: '35 x 45 mm',
    widthMm: 35,
    heightMm: 45,
    note: 'Common passport photo size. Check the exact rule on your form.'
  },
  {
    id: '2x2in',
    label: '2 x 2 inch',
    widthMm: 50.8,
    heightMm: 50.8,
    note: 'Common square photo size. Check the exact rule on your form.'
  }
];

export const DEFAULT_PASSPORT_SETTINGS: PassportSheetSettings = {
  photoPresetId: '35x45',
  photoWidthMm: 35,
  photoHeightMm: 45,
  paperSize: '4x6',
  gapMm: 3,
  marginMm: 5,
  copiesMode: 'auto',
  copies: 6,
  cutLines: false,
  zoom: 1
};

export function getPassportPhotoPreset(id: PassportPhotoPresetId) {
  return PASSPORT_PHOTO_PRESETS.find((preset) => preset.id === id);
}
