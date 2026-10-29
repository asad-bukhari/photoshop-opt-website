export const REPO_INFO = {
  imageOpt: {
    name: "image-optimation-tool",
    fullName: "Zaibi Tools Enterprise",
    description:
      "Proprietary batch image optimization engine for WebP/AVIF generation, EXIF metadata privacy stripping, and responsive asset sizing.",
    version: "v3.0",
    license: "Proprietary",
    techStack: ["TypeScript", "Canvas Web API", "WebP Converter", "EXIF Parser"],
    features: [
      "Client-side zero-server upload processing for 100% data privacy",
      "Batch multi-threaded image compression & format transformation",
      "EXIF metadata stripper (GPS coordinates, device ID, camera serials)",
      "Social media asset dimension presets & aspect ratio crop",
      "Side-by-side visual image comparison slider"
    ]
  },
  cnicOpt: {
    name: "CNIC print tool",
    fullName: "Zaibi Tools",
    description:
      "Place a CNIC or another ID-1 card front and back on a card-sized A4, Letter, Legal or 3R sheet with an optional purpose watermark.",
    version: "v3.5",
    license: "Proprietary",
    techStack: ["React", "HTML5 Canvas API", "Image Enhancement Filters"],
    features: [
      "Dual upload for the front and back of a card",
      "Card-sized frames for CNIC and other ID-1 cards",
      "Scan filters: B&W, grayscale and color boost",
      "Optional purpose watermark",
      "A4, Letter, Legal and 3R sheets at 150 DPI"
    ]
  }
};

export const SOCIAL_PRESETS = [
  { id: 'original', name: 'Original Aspect Ratio', width: 0, height: 0, description: 'Keep source image proportions' },
  { id: 'instagram-square', name: 'Instagram Square (1:1)', width: 1080, height: 1080, description: '1080 x 1080 px for posts' },
  { id: 'instagram-story', name: 'Instagram Story (9:16)', width: 1080, height: 1920, description: '1080 x 1920 px vertical' },
  { id: 'linkedin-banner', name: 'LinkedIn Banner (4:1)', width: 1584, height: 396, description: '1584 x 396 px profile cover' },
  { id: 'passport-photo', name: 'Passport ID Photo', width: 600, height: 600, description: '2 x 2 inch standard 300 DPI ID photo' },
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
