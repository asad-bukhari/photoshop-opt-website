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
    name: "cnic-copy-print-opt",
    fullName: "Zaibi Tools Enterprise / cnic-copy-print-opt",
    description:
      "Specialized CNIC & identity document front + back dual layout alignment optimizer for crisp A4 printouts with watermark protection.",
    version: "v3.5",
    license: "Proprietary",
    techStack: ["React", "HTML5 Canvas API", "Image Enhancement Filters"],
    features: [
      "Dual upload for CNIC front and CNIC back cards",
      "Automated document boundary alignment and aspect ratio lock",
      "Scan enhancement filters: high-contrast B&W scan mode & grayscale",
      "Custom anti-fraud watermark overlays (e.g. 'FOR BANK USE ONLY')",
      "1:1 true-size print calibration with A4, Letter, and Legal paper grid preview"
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
  "FOR OFFICIAL USE ONLY",
  "FOR BANK ACCOUNT VERIFICATION ONLY",
  "FOR VISA & PASSPORT APPLICATION ONLY",
  "CONFIDENTIAL - DO NOT COPY",
  "CUSTOM TEXT"
];

export const FAQ_ITEMS = [
  {
    question: "What is image-optimation-tool and how does it compress images?",
    answer:
      "image-optimation-tool is a proprietary batch image compression engine created by Asad Bukhari. It uses client-side HTML5 Canvas processing to re-encode JPEG, PNG, WebP, and AVIF files, reducing file size by up to 80% without visible quality degradation while stripping sensitive EXIF GPS data."
  },
  {
    question: "What is cnic-copy-print-opt used for?",
    answer:
      "cnic-copy-print-opt is a proprietary tool for Pakistani National Identity Cards (CNIC) and government ID documents. It allows users to upload front and back images, automatically aligns them onto a single A4 printable page, enhances text contrast, and applies protective watermark overlays to prevent identity theft."
  },
  {
    question: "Are my sensitive identity documents uploaded to an external server?",
    answer:
      "No. All image processing and CNIC alignment occurs directly inside your web browser using client-side JavaScript and the HTML Canvas API. Your files never leave your device."
  },
  {
    question: "How are these tools licensed?",
    answer:
      "Both image-optimation-tool and cnic-copy-print-opt are proprietary tools developed by Asad Bukhari. Access is provided via this portal for authorized enterprise and individual use."
  }
];
