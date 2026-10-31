import { CNIC_FAQ_ITEMS, IMAGE_FAQ_ITEMS } from './initialData';
import type { ToolCategory, ToolEntry } from '../types';

export const TOOL_CATEGORY_LABELS: Record<ToolCategory, string> = {
  photos: 'Photos',
  pdf: 'PDF',
  print: 'Print sheets'
};

export const TOOL_CATEGORY_ORDER: ToolCategory[] = ['photos', 'pdf', 'print'];

export const TOOLS: ToolEntry[] = [
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    shortName: 'Image',
    category: 'photos',
    icon: 'image',
    description:
      'Compress JPG, PNG and WebP images to a target size, convert formats and remove EXIF data in your browser.',
    metaTitle: 'Image Compressor to 20KB, 50KB or 100KB',
    metaDescription:
      'Compress JPG, PNG or WebP images to 20KB, 50KB, 100KB or a custom size. Convert to WebP and remove EXIF location data in your browser.',
    h1: 'Compress an image to 20KB, 50KB or 100KB',
    intro:
      'Choose a target size, add one or more images, and download the compressed files. Processing happens in your browser; the tool does not upload your images.',
    howToSteps: [
      {
        title: 'Choose the output format and target size',
        body: 'Pick JPG, WebP or PNG and enter the maximum file size in KB.'
      },
      {
        title: 'Add your images',
        body: 'Use the file picker or drag images onto the upload area. JPG, PNG, WebP and AVIF input are accepted when your browser can decode them.'
      },
      {
        title: 'Compress the images',
        body: 'The tool processes the files one at a time in your browser and lowers quality or resolution until the output fits the target.'
      },
      {
        title: 'Check and download',
        body: 'Compare the original and compressed versions, then download each result.'
      }
    ],
    faq: IMAGE_FAQ_ITEMS,
    relatedIds: ['cnic-photocopy'],
    keywords: ['compress image', 'compress jpg', '20kb', '50kb', '100kb', 'png to webp'],
    features: ['JPG, PNG and WebP', 'Target size in KB', 'Runs in your browser'],
    actionLabel: 'Open image compressor',
    version: '3.0.0',
    status: 'live'
  },
  {
    id: 'cnic-photocopy',
    slug: 'cnic-photocopy',
    name: 'CNIC Photocopy',
    shortName: 'CNIC',
    category: 'print',
    icon: 'printer',
    description:
      'Place the front and back of a CNIC or another ID-1 card on one page, then print, save a PDF or download a PNG.',
    metaTitle: 'Print CNIC Front and Back on One A4 Page',
    metaDescription:
      'Put CNIC front and back on one A4 page at card size. Choose a layout, improve a phone photo, add a watermark, then print or save PDF.',
    h1: 'Print CNIC front and back on one A4 page',
    intro:
      'Add a photo or scan of each side, choose a layout and paper size, then print or save the sheet. The images are read and drawn in your browser.',
    howToSteps: [
      {
        title: 'Add the front and back',
        body: 'Upload a photo or scan of each side, or load the sample cards to try the layout.'
      },
      {
        title: 'Choose paper and layout',
        body: 'Keep A4 paper and the Centered stacked layout for a simple front-and-back sheet.'
      },
      {
        title: 'Check the preview',
        body: 'Keep the card scale at 100 percent and add a purpose watermark if you need one.'
      },
      {
        title: 'Print or save',
        body: 'Choose Print, Download PDF or Download PNG, then print at 100 percent scale.'
      }
    ],
    faq: CNIC_FAQ_ITEMS,
    relatedIds: ['image-compressor'],
    keywords: ['cnic photocopy', 'cnic print', 'front and back', 'a4', 'id card'],
    features: ['Front and back on one page', 'A4, Letter, Legal and 3R', 'PDF, PNG or print'],
    actionLabel: 'Open CNIC photocopy',
    version: '3.0.0',
    status: 'live'
  }
];

export function toolHref(tool: ToolEntry): string {
  return `/${tool.slug}`;
}

export function getToolById(id: string): ToolEntry | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function getToolBySlug(slug: string): ToolEntry | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getLiveTools(): ToolEntry[] {
  return TOOLS.filter((tool) => tool.status === 'live');
}

export function getLiveToolCategories(): { category: ToolCategory; label: string; tools: ToolEntry[] }[] {
  return TOOL_CATEGORY_ORDER.map((category) => ({
    category,
    label: TOOL_CATEGORY_LABELS[category],
    tools: getLiveTools().filter((tool) => tool.category === category)
  })).filter((group) => group.tools.length > 0);
}

export function getRelatedTools(tool: ToolEntry): ToolEntry[] {
  return tool.relatedIds
    .map((id) => getToolById(id))
    .filter((related): related is ToolEntry => Boolean(related && related.status === 'live'));
}
