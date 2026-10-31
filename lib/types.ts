export type PdfPageSize = 'a4' | 'letter' | 'legal' | 'fit';
export type PdfOrientation = 'auto' | 'portrait' | 'landscape';
export type PdfMargin = 'none' | 'small' | 'normal';
export type PdfImageQuality = 'original' | 'high' | 'small';
export type PdfRotation = 0 | 90 | 180 | 270;

export interface PdfBuildOptions {
  pageSize: PdfPageSize;
  orientation: PdfOrientation;
  margin: PdfMargin;
  quality: PdfImageQuality;
}

export interface PdfImageInput {
  file: File;
  rotation: PdfRotation;
}

export interface PdfBuildResult {
  blob: Blob;
  pageCount: number;
  downscaledCount: number;
  bytes: number;
}

export type PhotoResizePresetId =
  | 'custom'
  | 'passport-35x45'
  | 'photo-2x2in'
  | 'photo-300x400'
  | 'signature-200x230'
  | 'cnic-photo';
export type PhotoResizeUnit = 'px' | 'mm' | 'cm' | 'in';
export type PhotoResizeFit = 'fill' | 'fit' | 'stretch';
export type PhotoResizeFormat = 'jpeg' | 'png' | 'webp';

export interface PhotoResizeSettings {
  presetId: PhotoResizePresetId;
  width: number;
  height: number;
  unit: PhotoResizeUnit;
  dpi: number;
  targetKB: number;
  minKB: number;
  format: PhotoResizeFormat;
  fit: PhotoResizeFit;
  zoom: number;
  offsetX: number;
  offsetY: number;
  addLabel: boolean;
  labelName: string;
  labelDate: string;
  labelStripPercent: number;
  labelFontPercent: number;
}

export interface PhotoResizeResult {
  dataUrl: string;
  width: number;
  height: number;
  bytes: number;
  overTarget: boolean;
  belowMinimum: boolean;
}

export type ToolCategory = 'photos' | 'pdf' | 'print';
export type ToolStatus = 'live' | 'planned';
export type ToolKind = 'tool' | 'landing';
export type ToolIconName =
  | 'image'
  | 'printer'
  | 'file-text'
  | 'file-image'
  | 'scissors'
  | 'layers'
  | 'crop'
  | 'scan'
  | 'signature'
  | 'passport'
  | 'files';

export interface ToolHowToStep {
  title: string;
  body: string;
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolEntry {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: ToolCategory;
  icon: ToolIconName;
  description: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  howToSteps: ToolHowToStep[];
  faq: ToolFaqItem[];
  relatedIds: string[];
  keywords: string[];
  features: string[];
  actionLabel: string;
  kind: ToolKind;
  version: string;
  status: ToolStatus;
}

export type ImageFormat = 'webp' | 'jpeg' | 'png' | 'avif';

export type SocialPreset =
  | 'original'
  | 'instagram-square'
  | 'instagram-story'
  | 'linkedin-banner'
  | 'passport-photo'
  | 'ecommerce-thumbnail';

export interface ImageOptimizationOptions {
  format: ImageFormat;
  targetSizeKB: number; // desired output file size in KB, default 25
  maxWidth?: number;
  maxHeight?: number;
  preset: SocialPreset;
}

export interface ProcessedImageItem {
  id: string;
  name: string;
  originalSize: number;
  optimizedSize: number;
  savedBytes: number;
  savedPercentage: number;
  originalWidth: number;
  originalHeight: number;
  optimizedWidth: number;
  optimizedHeight: number;
  originalDataUrl: string;
  optimizedDataUrl: string;
  format: ImageFormat;
  processingTimeMs: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  errorMessage?: string;
}

export type CnicPaperSize = 'a4' | 'letter' | 'legal' | '3r';
export type CnicLayoutPreset =
  | 'standard-top-bottom'
  | 'side-by-side'
  | 'dual-copy-a4'
  | 'quad-copy-a4'
  | 'pakistani-style';
export type CnicFilterMode = 'original' | 'enhanced' | 'high-contrast-bw' | 'grayscale' | 'color-boost';

export interface CnicPrintOptions {
  paperSize: CnicPaperSize;
  layout: CnicLayoutPreset;
  filter: CnicFilterMode;
  watermarkText: string;
  enableWatermark: boolean;
  watermarkOpacity: number;
  customScale: number; // 0.5 to 1.5
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  sharpness: number; // 0 to 100
  borderGrid: boolean;
  dateStamp: boolean;
}
