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
    relatedIds: ['photo-signature-resizer', 'jpg-to-pdf', 'cnic-photocopy'],
    keywords: ['compress image', 'compress jpg', '20kb', '50kb', '100kb', 'png to webp'],
    features: ['JPG, PNG and WebP', 'Target size in KB', 'Runs in your browser'],
    actionLabel: 'Open image compressor',
    kind: 'tool',
    version: '3.0.0',
    status: 'live'
  },
  {
    id: 'photo-signature-resizer',
    slug: 'photo-signature-resizer',
    name: 'Photo & Signature Resizer',
    shortName: 'Resizer',
    category: 'photos',
    icon: 'crop',
    description:
      'Resize a photo or signature to exact pixels or millimetres, set a maximum KB and download JPG, PNG or WebP.',
    metaTitle: 'Photo and Signature Resizer — Exact Pixels and KB',
    metaDescription:
      'Resize a photo or signature to an exact pixel size or mm at 300 DPI, set a maximum and minimum KB, crop, and download in JPG, PNG or WebP.',
    h1: 'Resize a photo or signature to exact pixels and KB',
    intro:
      'Enter the size and a KB limit, then crop the preview. Processing runs in your browser; the image is not uploaded.',
    howToSteps: [
      {
        title: 'Add a photo or signature',
        body: 'Use a JPG, PNG, WebP or AVIF image. A signature works best on a plain white background.'
      },
      {
        title: 'Choose the size',
        body: 'Pick a preset or enter custom pixels, millimetres, centimetres or inches at your chosen DPI.'
      },
      {
        title: 'Set the KB limit and crop',
        body: 'Enter a maximum KB, optionally a minimum, choose the fit mode and drag the preview to position the crop.'
      },
      {
        title: 'Check and download',
        body: 'Confirm the pixel size and KB result, then download the JPG, PNG or WebP file.'
      }
    ],
    faq: [
      {
        question: 'How do I resize a photo to 300x400 pixels?',
        answer:
          'Choose the Photo 300 x 400 px preset, add your image, then download the result. For another size, choose Custom size and enter the width and height in pixels.'
      },
      {
        question: 'Can I set a 20KB or 50KB file size limit?',
        answer:
          'Yes. Enter 20 or 50 as the maximum KB. The tool lowers JPEG or WebP quality until the file fits, but it keeps the pixel size you asked for. If the target is impossible at that size, it shows the smallest result and says so.'
      },
      {
        question: 'Does the tool write DPI into the file?',
        answer:
          'No. The exported file keeps the pixel dimensions but does not store DPI metadata. Upload forms usually check pixels and file size; printing at a physical size depends on your print app.'
      },
      {
        question: 'Can I resize a signature?',
        answer:
          'Yes. Use the Signature 200 x 230 px preset or a custom size. Use a signature photo with a plain white background; the tool does not remove backgrounds.'
      },
      {
        question: 'Does resizing remove EXIF metadata?',
        answer:
          'Yes. The image is re-encoded through the Canvas API, which drops EXIF data such as GPS location and camera details.'
      },
      {
        question: 'Is my photo uploaded?',
        answer:
          'No. The image is read, cropped and encoded in your browser. The site loads analytics and ads, but your image is not sent to a server.'
      }
    ],
    relatedIds: ['image-compressor', 'jpg-to-pdf', 'cnic-photocopy', 'passport-photo-maker'],
    keywords: ['photo resizer', 'signature resizer', 'resize photo to 20kb', '300x400 photo', 'passport photo size'],
    features: ['Exact pixels or mm', 'Maximum and minimum KB', 'Fill, fit or stretch'],
    actionLabel: 'Open photo resizer',
    kind: 'tool',
    version: '1.0.0',
    status: 'live'
  },
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'Image to PDF',
    shortName: 'Image PDF',
    category: 'pdf',
    icon: 'file-text',
    description: 'Combine JPG, PNG and WebP images into one PDF with page size, orientation, margin and quality controls.',
    metaTitle: 'JPG to PDF — Convert Images to PDF in Your Browser',
    metaDescription:
      'Combine JPG, PNG and WebP images into one PDF in your browser. Reorder, rotate, choose page size and margins, then download without uploading.',
    h1: 'Convert images to PDF in your browser',
    intro:
      'Add JPG, PNG or WebP images, set the page size and quality, then download one PDF. The images are read and combined in your browser and are not uploaded.',
    howToSteps: [
      {
        title: 'Add the images',
        body: 'Choose several JPG, PNG, WebP or AVIF images. Each one becomes a page in the PDF.'
      },
      {
        title: 'Order and rotate',
        body: 'Drag rows on a computer or use the up and down buttons on a phone. Rotate any image that is sideways.'
      },
      {
        title: 'Choose the page setup',
        body: 'Pick A4, Letter, Legal or fit to image, then set auto/portrait/landscape orientation and the margin.'
      },
      {
        title: 'Create and download',
        body: 'Select High quality or Small, create the PDF, check the page count and download the file.'
      }
    ],
    faq: [
      {
        question: 'How do I convert JPG to PDF?',
        answer:
          'Add one or more images, choose the page size and quality, select Create PDF, then download the file. The images stay in your browser during the conversion.'
      },
      {
        question: 'Can I combine several images into one PDF?',
        answer:
          'Yes. Add the images, reorder them with drag or the up/down buttons, and create the PDF. Each image becomes one page in the order shown.'
      },
      {
        question: 'What page sizes are supported?',
        answer:
          'A4, Letter, Legal and fit to image. You can force portrait or landscape, or let each page follow its image orientation. Margins can be none, small or normal.'
      },
      {
        question: 'Are my images uploaded to a server?',
        answer:
          'No. The PDF is assembled in your browser with a bundled PDF library. The site loads analytics and ads, but your images are not sent to a server.'
      },
      {
        question: 'Can I convert a HEIC photo to PDF?',
        answer:
          'Not reliably. Most browsers cannot decode HEIC. Convert the photo to JPG or PNG first, then add it here.'
      },
      {
        question: 'Will the PDF have searchable text?',
        answer:
          'No. This tool places images on PDF pages. It does not run OCR, so text inside a photo or scan is not searchable or selectable.'
      }
    ],
    relatedIds: ['image-compressor', 'photo-signature-resizer', 'merge-pdf'],
    keywords: ['jpg to pdf', 'png to pdf', 'images to pdf', 'convert image to pdf'],
    features: ['JPG, PNG and WebP', 'A4, Letter, Legal or fit', 'Reorder and rotate'],
    actionLabel: 'Open image to PDF',
    kind: 'tool',
    version: '1.0.0',
    status: 'live'
  },
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    shortName: 'Merge',
    category: 'pdf',
    icon: 'layers',
    description: 'Join several PDFs into one file in the order you choose, with page counts shown for each file.',
    metaTitle: 'Merge PDF Files Online in Your Browser',
    metaDescription:
      'Combine several PDFs into one file in your browser. Reorder the files, see page counts, and download the merged PDF without uploading.',
    h1: 'Merge PDF files in your browser',
    intro:
      'Add two or more PDFs, put them in the order you want, and download one combined file. The PDFs are read and merged on your device.',
    howToSteps: [
      {
        title: 'Add the PDFs',
        body: 'Choose two or more PDF files. Each file shows its page count and size before merging.'
      },
      {
        title: 'Set the order',
        body: 'Use the up and down buttons to arrange the files. Pages are appended in this list order.'
      },
      {
        title: 'Merge the files',
        body: 'Select Merge and watch the progress. Protected PDFs are skipped with a message.'
      },
      {
        title: 'Download the result',
        body: 'Check the merged page count and download the PDF. Open it in a viewer before sending it on.'
      }
    ],
    faq: [
      {
        question: 'How do I merge PDF files?',
        answer:
          'Add the PDFs, reorder them with the up and down buttons, select Merge, then download the result. The files stay in your browser during the merge.'
      },
      {
        question: 'Can I change the page order?',
        answer:
          'You can change the order of the files, and their pages are added in that order. This version does not reorder pages inside a single PDF; merge and split tools would be needed for that.'
      },
      {
        question: 'What happens to password-protected PDFs?',
        answer:
          'They are skipped with a message. The tool does not try to guess or remove passwords. Use an unprotected copy or remove the password in the app that created it.'
      },
      {
        question: 'Are my PDFs uploaded?',
        answer:
          'No. The PDFs are read and merged in your browser with a bundled PDF library. The site loads analytics and ads, but your files are not sent to a server.'
      },
      {
        question: 'Is there a page or file size limit?',
        answer:
          'There is no fixed limit, but very large PDFs or many files can be slow and use a lot of memory on a phone. The tool processes one file at a time and shows progress.'
      }
    ],
    relatedIds: ['jpg-to-pdf', 'split-pdf', 'image-compressor'],
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'pdf merger'],
    features: ['Join PDFs in order', 'Page count per file', 'Runs in your browser'],
    actionLabel: 'Open merge PDF',
    kind: 'tool',
    version: '1.0.0',
    status: 'live'
  },
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    shortName: 'Split',
    category: 'pdf',
    icon: 'scissors',
    description: 'Extract selected pages or split a PDF every N pages into separate files.',
    metaTitle: 'Split PDF Files Online in Your Browser',
    metaDescription:
      'Extract pages or split a PDF every N pages in your browser. Enter ranges like 1-3, 5, then download the new files without uploading.',
    h1: 'Split a PDF in your browser',
    intro:
      'Add one PDF, select the pages you need or split every N pages, then download the new files. The PDF is read and split on your device.',
    howToSteps: [
      {
        title: 'Add one PDF',
        body: 'Choose a PDF and check its page count. Password-protected files are skipped.'
      },
      {
        title: 'Pick a mode',
        body: 'Extract pages into one PDF, or split the whole file every N pages into separate files.'
      },
      {
        title: 'Enter pages or a chunk size',
        body: 'For extraction, use ranges like 1-3, 5. For chunks, enter how many pages each new file should contain.'
      },
      {
        title: 'Download the files',
        body: 'Check each page count, then download the new PDFs one at a time.'
      }
    ],
    faq: [
      {
        question: 'How do I extract pages from a PDF?',
        answer:
          'Add the PDF, keep Extract pages selected, enter the pages or ranges, then select Extract selected pages. The selected pages are written to one new PDF.'
      },
      {
        question: 'What page range syntax is supported?',
        answer:
          'Use single pages and ranges separated by commas, such as 1-3, 5, 8-10. Spaces are allowed. Reversed or out-of-range entries are rejected, and duplicates are removed.'
      },
      {
        question: 'Can I split a PDF every N pages?',
        answer:
          'Yes. Choose Split every N pages and enter the chunk size. A 10-page PDF split every 3 pages produces files with 3, 3, 3 and 1 pages. Each file downloads separately.'
      },
      {
        question: 'Does this create a ZIP file?',
        answer:
          'No. This version downloads each output PDF individually. There is no ZIP bundle.'
      },
      {
        question: 'What happens to a protected PDF?',
        answer:
          'It is skipped with a message. The tool does not remove or guess PDF passwords. Create an unprotected copy first.'
      },
      {
        question: 'Is my PDF uploaded?',
        answer:
          'No. The file is read and split in your browser. The site loads analytics and ads, but your PDF is not sent to a server.'
      }
    ],
    relatedIds: ['merge-pdf', 'jpg-to-pdf'],
    keywords: ['split pdf', 'extract pdf pages', 'pdf splitter', 'split pdf every n pages'],
    features: ['Extract page ranges', 'Split every N pages', 'Runs in your browser'],
    actionLabel: 'Open split PDF',
    kind: 'tool',
    version: '1.0.0',
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
    relatedIds: ['photo-signature-resizer', 'image-compressor', 'passport-photo-maker'],
    keywords: ['cnic photocopy', 'cnic print', 'front and back', 'a4', 'id card'],
    features: ['Front and back on one page', 'A4, Letter, Legal and 3R', 'PDF, PNG or print'],
    actionLabel: 'Open CNIC photocopy',
    kind: 'tool',
    version: '3.0.0',
    status: 'live'
  },
  {
    id: 'passport-photo-maker',
    slug: 'passport-photo-maker',
    name: 'Passport Photo Sheet',
    shortName: 'Passport',
    category: 'print',
    icon: 'passport',
    description: 'Crop one passport photo and repeat it on a 4x6, A4, Letter or 3R sheet for printing.',
    metaTitle: 'Passport Photo Sheet Maker — 4x6, A4, Letter, 3R',
    metaDescription:
      'Make a passport photo sheet in your browser. Crop a 35x45 mm or 2x2 inch photo, repeat it on 4x6, A4, Letter or 3R, then print or download.',
    h1: 'Make a passport photo sheet',
    intro:
      'Add one photo, choose the passport size and paper, then print or download a sheet of identical copies. The photo is cropped and repeated in your browser.',
    howToSteps: [
      {
        title: 'Add a plain-background photo',
        body: 'Use a well-lit photo with the face centred and a plain, light background. The tool does not remove the background.'
      },
      {
        title: 'Choose the photo size',
        body: 'Pick 35 x 45 mm, 2 x 2 inch or a custom size in millimetres. Check the exact rule on your form.'
      },
      {
        title: 'Choose paper and copies',
        body: 'Select 4 x 6, A4, Letter or 3R, set the gap and margin, and fill the sheet or choose a copy count.'
      },
      {
        title: 'Print or download',
        body: 'Print at 100% scale, or download a PDF or PNG. Measure one photo on the first print before making more.'
      }
    ],
    faq: [
      {
        question: 'What passport photo sizes does this tool support?',
        answer:
          '35 x 45 mm, 2 x 2 inch and a custom size in millimetres. These are common sizes, not a claim about a specific portal; read the exact rule on your form.'
      },
      {
        question: 'Which paper sizes can I use?',
        answer:
          '4 x 6 inch, A4, Letter and 3R. The tool shows how many photos fit and lets you adjust the gap and page margin.'
      },
      {
        question: 'How many copies can I print?',
        answer:
          'Use Fill the sheet to repeat as many as fit, or choose a smaller number. Copies are centred in rows, and cut lines are optional.'
      },
      {
        question: 'Why does the printed size matter?',
        answer:
          'Print at 100% scale or actual size. A setting such as “fit to page” changes the photo size on paper. Measure the first print with a ruler before printing a full sheet.'
      },
      {
        question: 'Does the tool remove the background?',
        answer:
          'No. It crops the photo and repeats it. Use a plain, light background and keep the head centred. The tool does not replace the background or straighten a tilted photo.'
      },
      {
        question: 'Is my photo uploaded?',
        answer:
          'No. The photo is read, cropped and drawn onto the sheet in your browser. The site loads analytics and ads, but your photo is not sent to a server.'
      }
    ],
    relatedIds: ['photo-signature-resizer', 'cnic-photocopy'],
    keywords: ['passport photo sheet', 'passport photo print', '4x6 passport photo', 'passport size photo'],
    features: ['35 x 45 mm and 2 x 2 inch', '4x6, A4, Letter, 3R', 'Print, PDF or PNG'],
    actionLabel: 'Open passport photo maker',
    kind: 'tool',
    version: '1.0.0',
    status: 'live'
  },
  {
    id: 'compress-image-to-20kb',
    slug: 'compress-image-to-20kb',
    name: 'Compress Image to 20KB',
    shortName: '20KB',
    category: 'photos',
    icon: 'file-image',
    description: 'Open the image compressor with a 20KB target for strict upload forms.',
    metaTitle: 'Compress Image to 20KB Online in Your Browser',
    metaDescription:
      'Compress a JPG, PNG or WebP image to 20KB in your browser. Adjust quality and dimensions, check the result and download without uploading.',
    h1: 'Compress an image to 20KB',
    intro:
      'This page opens the image compressor with a 20 KB target already set. Use it for strict forms and small profile photos, then check that the face or text is still readable before you submit.',
    howToSteps: [
      {
        title: 'Add a clean source image',
        body: 'Use the sharpest photo you have. A simple background and a tight crop leave more detail at a very small file size.'
      },
      {
        title: 'Keep the 20KB target',
        body: 'The target is already set to 20 KB. Choose JPG unless the form explicitly accepts WebP.'
      },
      {
        title: 'Check the comparison',
        body: 'Drag the comparison slider and look at the face or signature. If it is too soft, use a smaller crop or a larger allowance.'
      },
      {
        title: 'Download and verify',
        body: 'Confirm the downloaded file is under 20 KB and that the portal accepts its format.'
      }
    ],
    faq: [
      {
        question: 'Can a photo still look good at 20KB?',
        answer:
          'A small photo can look acceptable, but fine detail will be reduced. A simple background, good lighting and a tight crop help more than any setting. Check the face at 100% before uploading.'
      },
      {
        question: 'Which format should I use for a 20KB image?',
        answer:
          'JPG is the safest choice for older forms and is usually efficient at small sizes. WebP can be smaller when the portal accepts it. PNG is lossless and ignores the target, so it is a poor choice for a strict KB limit.'
      },
      {
        question: 'Why does my image stay above 20KB?',
        answer:
          'Detailed textures, noise and a large pixel size all keep the file larger. The tool lowers quality and then resolution until it fits, but a complex image may need a smaller crop. The result panel tells you when the target cannot be reached.'
      },
      {
        question: 'Is 20KB enough for a signature?',
        answer:
          'It can be, especially for a small signature box. Use dark ink on white paper and crop close to the signature. If the strokes break up, use a larger KB allowance or a smaller pixel size.'
      }
    ],
    relatedIds: ['image-compressor', 'compress-image-to-50kb'],
    keywords: ['compress image to 20kb', 'photo to 20kb', 'jpg to 20kb', '20kb image'],
    features: ['20KB target preset', 'JPG, WebP or PNG', 'Runs in your browser'],
    actionLabel: 'Open the 20KB compressor',
    kind: 'landing',
    version: '1.0.0',
    status: 'live'
  },
  {
    id: 'compress-image-to-50kb',
    slug: 'compress-image-to-50kb',
    name: 'Compress Image to 50KB',
    shortName: '50KB',
    category: 'photos',
    icon: 'file-image',
    description: 'Compare 50KB output with the original and keep more detail than a 20KB target.',
    metaTitle: 'Compress Image to 50KB Online — No Upload',
    metaDescription:
      'Compress a photo to 50KB in your browser. Keep more detail than 20KB, check the before-and-after preview and download the JPG or WebP file.',
    h1: 'Compress an image to 50KB',
    intro:
      'This page starts the image compressor at 50 KB. It is a common middle ground for profile photos and document uploads when 20 KB looks too soft but the portal still has a strict limit.',
    howToSteps: [
      {
        title: 'Start from a good original',
        body: 'Use the original camera or phone file rather than a screenshot or an already-compressed copy.'
      },
      {
        title: 'Use the 50KB target',
        body: 'The target is preset. JPG is the compatible default; try WebP only if the form accepts it.'
      },
      {
        title: 'Compare at full size',
        body: 'Open the preview and inspect the face, text and edges. Increase the target only if the form allows it.'
      },
      {
        title: 'Download the file',
        body: 'Check the reported KB and the downloaded file before you attach it to the form.'
      }
    ],
    faq: [
      {
        question: 'Is 50KB enough for a job application photo?',
        answer:
          'It depends on the portal. 50 KB leaves more detail than 20 KB and is often enough for a profile photo, but read the exact rule on the form. The tool cannot guarantee that an unknown portal will accept the result.'
      },
      {
        question: 'Should I choose JPG or WebP at 50KB?',
        answer:
          'Choose JPG when the form lists JPEG or JPG, or when you are unsure. WebP often produces a smaller file, but some older portals reject it. Use the format the form names.'
      },
      {
        question: 'Why is my PNG still large at a 50KB target?',
        answer:
          'PNG is lossless, so it ignores the KB target. Convert the export to JPG or WebP if the form allows it; those formats can lower quality to approach 50 KB.'
      },
      {
        question: 'Does the result land exactly on 50KB?',
        answer:
          'No. The tool aims to stay under the maximum, so the result can be a little smaller. Check the displayed size and choose a different target only if the portal allows it.'
      }
    ],
    relatedIds: ['image-compressor', 'compress-image-to-100kb'],
    keywords: ['compress image to 50kb', 'photo to 50kb', 'jpg to 50kb', '50kb image'],
    features: ['50KB target preset', 'Compare before and after', 'No upload'],
    actionLabel: 'Open the 50KB compressor',
    kind: 'landing',
    version: '1.0.0',
    status: 'live'
  },
  {
    id: 'compress-image-to-100kb',
    slug: 'compress-image-to-100kb',
    name: 'Compress Image to 100KB',
    shortName: '100KB',
    category: 'photos',
    icon: 'file-image',
    description: 'Open the compressor at 100KB for forms and profiles that allow more detail.',
    metaTitle: 'Compress Image to 100KB Online in Your Browser',
    metaDescription:
      'Compress a JPG, PNG or WebP image to 100KB without uploading it. Keep more detail for forms, profiles and screens, then download the result.',
    h1: 'Compress an image to 100KB',
    intro:
      'This page starts the image compressor at 100 KB. Use it when the portal allows a little more room and you want a sharper face, document text or signature than a 20 KB or 50 KB target gives you.',
    howToSteps: [
      {
        title: 'Add the original image',
        body: 'A sharp original keeps more detail after re-encoding. Avoid starting from a screenshot of a compressed photo.'
      },
      {
        title: 'Keep the 100KB target',
        body: 'The preset is 100 KB. JPG is the compatible default; WebP is an option when the form accepts it.'
      },
      {
        title: 'Inspect the result',
        body: 'Check the face, small text and fine lines at 100% before downloading.'
      },
      {
        title: 'Confirm the portal rule',
        body: 'Make sure 100 KB is within the portal limit and that the accepted format matches your download.'
      }
    ],
    faq: [
      {
        question: 'What is a 100KB image useful for?',
        answer:
          'A 100 KB allowance gives a photo or scanned page more detail than 20 KB or 50 KB. It suits profile photos, form attachments and on-screen documents when the portal permits that size.'
      },
      {
        question: 'Is a 100KB image lossless?',
        answer:
          'No. JPG and WebP are re-encoded at a lower quality to approach the target. The comparison slider shows the difference; keep the target higher if the form allows it.'
      },
      {
        question: 'Should I use a preset or the original aspect ratio?',
        answer:
          'Use the original aspect ratio unless the form asks for a specific crop. Presets crop to a fixed frame and can remove part of a face or document. The photo resizer tool is better for exact pixel sizes.'
      },
      {
        question: 'Why not upload the original photo?',
        answer:
          'A portal may reject a large file or take longer to accept it. Compressing also re-encodes the image, which drops EXIF data such as GPS location. Keep the original file if you may need it later.'
      }
    ],
    relatedIds: ['image-compressor', 'compress-image-to-50kb'],
    keywords: ['compress image to 100kb', 'photo to 100kb', 'jpg to 100kb', '100kb image'],
    features: ['100KB target preset', 'More detail for forms', 'Runs in your browser'],
    actionLabel: 'Open the 100KB compressor',
    kind: 'landing',
    version: '1.0.0',
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

export function requireTool(slug: string): ToolEntry {
  const tool = getToolBySlug(slug);
  if (!tool) throw new Error(`Missing registry entry: ${slug}`);
  return tool;
}

export function getLiveTools(): ToolEntry[] {
  return TOOLS.filter((tool) => tool.status === 'live');
}

export function getNavTools(): ToolEntry[] {
  return TOOLS.filter((tool) => tool.status === 'live' && tool.kind === 'tool');
}

export function getLiveToolCategories(): { category: ToolCategory; label: string; tools: ToolEntry[] }[] {
  return TOOL_CATEGORY_ORDER.map((category) => ({
    category,
    label: TOOL_CATEGORY_LABELS[category],
    tools: getNavTools().filter((tool) => tool.category === category)
  })).filter((group) => group.tools.length > 0);
}

export function getRelatedTools(tool: ToolEntry): ToolEntry[] {
  return tool.relatedIds
    .map((id) => getToolById(id))
    .filter((related): related is ToolEntry => Boolean(related && related.status === 'live'));
}
