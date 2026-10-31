import { createObjectUrl, revokeObjectUrl } from './objectUrls';

const OPEN_ERROR =
  'This image could not be opened. Choose a JPG, PNG or WebP file. HEIC photos are not supported by most browsers; convert the photo first.';

export function loadImageSource(src: File | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const ownedUrl = src instanceof File ? createObjectUrl(src) : null;

    image.onload = () => {
      if (ownedUrl) revokeObjectUrl(ownedUrl);
      resolve(image);
    };
    image.onerror = () => {
      if (ownedUrl) revokeObjectUrl(ownedUrl);
      reject(new Error(OPEN_ERROR));
    };

    image.src = typeof src === 'string' ? src : ownedUrl ?? '';
  });
}

export function loadImageFile(file: File): Promise<HTMLImageElement> {
  return loadImageSource(file);
}
