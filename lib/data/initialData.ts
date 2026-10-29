export const SOCIAL_PRESETS = [
  { id: 'original', name: 'Original Aspect Ratio', width: 0, height: 0, description: 'Keep source image proportions' },
  { id: 'instagram-square', name: 'Instagram Square (1:1)', width: 1080, height: 1080, description: '1080 x 1080 px for posts' },
  { id: 'instagram-story', name: 'Instagram Story (9:16)', width: 1080, height: 1920, description: '1080 x 1920 px vertical' },
  { id: 'linkedin-banner', name: 'LinkedIn Banner (4:1)', width: 1584, height: 396, description: '1584 x 396 px profile cover' },
  { id: 'passport-photo', name: 'Passport ID Photo', width: 600, height: 600, description: '600 x 600 px square ID photo' },
  { id: 'ecommerce-thumbnail', name: 'E-commerce Product (1:1)', width: 800, height: 800, description: '800 x 800 px compressed web thumbnail' }
];

export const CNIC_WATERMARK_PRESETS = [
  "FOR VERIFICATION ONLY",
  "FOR BANK ACCOUNT VERIFICATION ONLY",
  "FOR VISA & PASSPORT APPLICATION ONLY",
  "CONFIDENTIAL - DO NOT COPY"
];

export const FAQ_ITEMS = [
  {
    question: 'Are the tools free?',
    answer: 'Yes. Both tools are free and do not require an account.'
  },
  {
    question: 'Do my files get uploaded?',
    answer:
      'No. The tools process files in your browser and do not upload them. The site loads Google Analytics and third-party ads; see the privacy policy.'
  },
  {
    question: 'Can I use the CNIC tool for any ID card?',
    answer:
      'The layout is built around the ID-1 card size used by CNICs and many bank, licence and student cards. Check the printed size before submitting an official copy.'
  },
  {
    question: 'What image sizes can I compress to?',
    answer:
      'You can enter a target from 1 to 10,240 KB. 20 KB, 50 KB and 100 KB are common limits on job, visa and exam forms.'
  },
  {
    question: 'Does the CNIC tool print at the real card size?',
    answer:
      'The card frames are drawn at about 85 x 53 mm on A4 at 150 DPI. Print at 100% scale and check with a ruler; do not use "fit to page".'
  }
];

export const IMAGE_FAQ_ITEMS = [
  {
    question: 'How do I compress an image to 20KB?',
    answer:
      'Upload a JPG, PNG or WebP image, set Target file size to 20 KB, then select Compress images. The tool lowers quality and, if needed, resolution until the file fits the target or reaches the smallest output it can produce.'
  },
  {
    question: 'Can I compress an image to 50KB or 100KB?',
    answer:
      'Yes. Enter 50 or 100 in the target size field. You can enter any target from 1 to 10,240 KB, and the result depends on the image content and output format.'
  },
  {
    question: 'Does compression remove EXIF GPS data?',
    answer:
      'Yes. The browser re-encodes the image through the Canvas API, which drops EXIF metadata such as GPS coordinates, camera model and timestamps. The tool does this automatically; there is no separate switch.'
  },
  {
    question: 'Can I convert PNG to WebP?',
    answer:
      'Yes. Choose WebP as the output format. WebP is usually smaller than PNG at a similar visual quality. This tool exports JPG, PNG or WebP; it does not export AVIF.'
  },
  {
    question: 'Is there a file size limit?',
    answer:
      'The tool does not enforce a file size limit. Very large images can be slow or run out of memory on a phone, so resize unusually large files before uploading.'
  },
  {
    question: 'Are my images uploaded?',
    answer:
      'No. The tool decodes and re-encodes each image in your browser and does not send the file to a server. The site itself loads Google Analytics and third-party ads; see the privacy policy.'
  },
  {
    question: 'Can I resize an image for Instagram or a passport photo?',
    answer:
      'Yes. Choose a preset: Instagram square 1080x1080, Instagram story 1080x1920, LinkedIn banner 1584x396, passport photo 600x600, or e-commerce thumbnail 800x800. Presets crop the image to fill the frame.'
  },
  {
    question: 'Can I compress a PNG to 20KB?',
    answer:
      'Not with the PNG export, because PNG is lossless and ignores the target size. To reach 20 KB, choose JPG or WebP, which re-encode the image and can reduce the file size.'
  },
  {
    question: 'Can I compress to 20KB without losing quality?',
    answer:
      'At very small sizes, some quality loss is usually unavoidable, especially for large photos. Use the comparison slider to check the result; the tool lowers quality and resolution only as needed to approach the target.'
  },
  {
    question: 'Can I convert WebP to JPG?',
    answer:
      'Yes. Upload a WebP image and choose JPG as the output format. The browser decodes the WebP file and re-encodes it as JPG.'
  },
  {
    question: 'Can I compress several images at once?',
    answer:
      'Yes. Select multiple files at once. They are processed one at a time in your browser, and each result is listed with its before and after size.'
  },
  {
    question: 'Can I choose an exact pixel size such as 600x800?',
    answer:
      'The tool offers presets rather than free width and height fields. The available presets are original, Instagram square 1080x1080, Instagram story 1080x1920, LinkedIn banner 1584x396, passport 600x600 and e-commerce 800x800.'
  }
];

export const CNIC_FAQ_ITEMS = [
  {
    question: 'How do I print CNIC front and back on one A4 page?',
    answer:
      'Upload a photo or scan of each side, keep the Centered stacked layout and A4 paper, then choose Print, Download PDF or Download PNG. The sheet places both sides in card-sized frames.'
  },
  {
    question: 'What is the correct CNIC size?',
    answer:
      'A Pakistani CNIC uses the ID-1 card format, 85.60 x 53.98 mm. This tool draws each card at about 85 x 53 mm on an A4 page at 150 DPI. Print at 100% scale and check the result with a ruler before you submit it.'
  },
  {
    question: 'Can I print 2 or 4 copies on one sheet?',
    answer:
      'Yes. Choose Dual copy for two sets or Quad copy for four sets. The Pakistani grid layout fills the page with repeated rows and exports a two-page PDF.'
  },
  {
    question: 'Can I add a watermark?',
    answer:
      'Yes. Turn on the watermark, choose a preset such as FOR BANK ACCOUNT VERIFICATION ONLY, and set the opacity. The text is drawn onto the sheet before export.'
  },
  {
    question: 'Does the tool straighten or crop my photo?',
    answer:
      'No. It fits the whole image into a fixed card frame, so a photo taken at an angle or with extra background is not straightened or cropped. Crop the photo in your phone editor first for a cleaner copy.'
  },
  {
    question: 'Does the CNIC tool work offline?',
    answer:
      'Uploading, layout, filters and PNG export run in your browser once the page has loaded. PDF export loads jsPDF from cdnjs, so that one feature needs a network connection.'
  },
  {
    question: 'Are my CNIC photos uploaded?',
    answer:
      'No. The images are read and drawn into a canvas in your browser and are not sent to a server by the tool. The site loads Google Analytics and third-party ads; see the privacy policy.'
  },
  {
    question: 'Can I merge CNIC front and back into one image?',
    answer:
      'Yes. The sheet is a single image, so Download PNG gives you one file with both sides. Use Download PDF if the form asks for a PDF.'
  },
  {
    question: 'Can I print a CNIC copy on my phone?',
    answer:
      'Yes, in a mobile browser. Save the PDF or PNG and print it from your phone, or send the file to a print shop. Check the scale before printing.'
  },
  {
    question: 'Is this an official NADRA tool?',
    answer:
      'No. Zaibi Tools is not affiliated with NADRA or any government office. It is an independent browser tool for arranging images you already have.'
  },
  {
    question: 'Can I use a driving licence or another ID card?',
    answer:
      'The layout uses the ID-1 card proportion, so it also works for driving licences, bank cards and many student or employee cards. Check the printed size against the real card.'
  },
  {
    question: 'Why is my printed CNIC the wrong size?',
    answer:
      'The usual cause is a printer setting such as "fit to page" or a reduced scale. Print at 100% and measure the card with a ruler; the sheet is drawn at about 85 x 53 mm at 150 DPI.'
  },
  {
    question: 'Does the tool add a watermark by default?',
    answer:
      'No. The watermark is off by default. Turn it on when you want a visible purpose label, and turn it off before export if you do not want one.'
  }
];
