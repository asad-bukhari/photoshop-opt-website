import type {
  PhotoResizePresetId,
  PhotoResizeSettings,
  PhotoResizeUnit
} from '../types';

export interface PhotoResizePreset {
  id: Exclude<PhotoResizePresetId, 'custom'>;
  label: string;
  width: number;
  height: number;
  unit: PhotoResizeUnit;
  dpi: number;
  note: string;
}

export const PHOTO_RESIZE_PRESETS: PhotoResizePreset[] = [
  {
    id: 'passport-35x45',
    label: 'Passport 35 x 45 mm',
    width: 35,
    height: 45,
    unit: 'mm',
    dpi: 300,
    note: 'Common passport photo size. Check the exact rule on your form.'
  },
  {
    id: 'photo-2x2in',
    label: 'Photo 2 x 2 inch',
    width: 2,
    height: 2,
    unit: 'in',
    dpi: 300,
    note: 'Common square photo size. Check the exact rule on your form.'
  },
  {
    id: 'photo-300x400',
    label: 'Photo 300 x 400 px',
    width: 300,
    height: 400,
    unit: 'px',
    dpi: 300,
    note: 'A common upload size for forms and profiles.'
  },
  {
    id: 'signature-200x230',
    label: 'Signature 200 x 230 px',
    width: 200,
    height: 230,
    unit: 'px',
    dpi: 300,
    note: 'A common signature box. Use a white background with dark ink.'
  },
  {
    id: 'cnic-photo',
    label: 'CNIC-style photo 30 x 40 mm',
    width: 30,
    height: 40,
    unit: 'mm',
    dpi: 300,
    note: 'A generic ID-style photo size. Check the exact rule on your form.'
  }
];

export const PHOTO_RESIZE_UNIT_LABELS: Record<PhotoResizeUnit, string> = {
  px: 'px',
  mm: 'mm',
  cm: 'cm',
  in: 'in'
};

export const DEFAULT_PHOTO_RESIZE_SETTINGS: PhotoResizeSettings = {
  presetId: 'passport-35x45',
  width: 35,
  height: 45,
  unit: 'mm',
  dpi: 300,
  targetKB: 50,
  minKB: 0,
  format: 'jpeg',
  fit: 'fill',
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  addLabel: false,
  labelName: '',
  labelDate: '',
  labelStripPercent: 18,
  labelFontPercent: 50
};

export function getPhotoResizePreset(id: PhotoResizePresetId): PhotoResizePreset | undefined {
  return PHOTO_RESIZE_PRESETS.find((preset) => preset.id === id);
}
