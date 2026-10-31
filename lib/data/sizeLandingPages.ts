export interface SizeLandingSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface SizeLandingPage {
  slug: string;
  targetKB: number;
  sections: SizeLandingSection[];
}

export const SIZE_LANDING_PAGES: SizeLandingPage[] = [
  {
    slug: 'compress-image-to-20kb',
    targetKB: 20,
    sections: [
      {
        id: 'when-20kb',
        title: 'When a 20KB limit is the right target',
        paragraphs: [
          'A 20 KB limit is usually the strictest option on a form. It suits a small profile photo, a thumbnail or an older portal that still measures uploads in kilobytes.',
          'Avoid using 20 KB for a printed photo or a detailed scanned document. Once detail is removed it cannot be restored, and an official copy needs readable text and a recognisable face.'
        ]
      },
      {
        id: 'keep-readable',
        title: 'Keep a 20KB photo readable',
        paragraphs: [
          'Start with a sharp, well-lit image and crop close to the subject. A plain background, clean edges and no small text give the encoder more room to keep the important parts.',
          'The compressor lowers quality first and then resolution if the target still cannot be reached. It shows that fallback in the result, so you can decide whether to accept a smaller image or ask the portal for more room.'
        ],
        bullets: [
          'Use JPG unless the form explicitly accepts WebP.',
          'Do not upscale a small image before compressing it.',
          'Avoid repeatedly saving and re-compressing the same file.'
        ]
      },
      {
        id: 'check-20kb',
        title: 'Check before you upload',
        paragraphs: [
          'Open the downloaded file, not just the preview. Confirm that the face, signature strokes and any required text are still clear, and that the portal accepts the format.'
        ],
        bullets: [
          'The downloaded size is at or under the limit.',
          'The face or signature is not blurred beyond use.',
          'The file format matches the portal rule.',
          'You keep a copy of the original image.'
        ]
      },
      {
        id: 'compare-20kb',
        title: '20KB, 50KB or 100KB?',
        paragraphs: [
          '20 KB is for the tightest limits. 50 KB usually keeps more detail for a form photo, and 100 KB leaves more room for small text or a scanned page. Use the largest size the portal allows rather than compressing further than necessary.'
        ]
      }
    ]
  },
  {
    slug: 'compress-image-to-50kb',
    targetKB: 50,
    sections: [
      {
        id: 'why-50kb',
        title: 'Why 50KB is a common form limit',
        paragraphs: [
          'A 50 KB limit often balances a recognisable photo with a small upload. It is more forgiving than 20 KB for faces, hair and simple backgrounds, while still keeping the transfer small for the portal.',
          'That does not mean every form accepts 50 KB. Read the rule first: some portals require 20 KB, while others allow 100 KB or more.'
        ]
      },
      {
        id: 'best-50kb',
        title: 'Getting the best 50KB result',
        paragraphs: [
          'Use the best original you have, then crop tightly around the subject. The compressor can reduce quality without changing the pixels, but it cannot recover detail that was not in the source.',
          'JPG is the compatible default. WebP can be smaller at the same visual quality when the portal accepts it. Keep the original aspect ratio unless a form asks for a specific frame.'
        ],
        bullets: [
          'Use a photo, not a screenshot of a photo.',
          'Keep the face centred and leave a little headroom.',
          'Try 100 KB if 50 KB looks soft and the form allows it.'
        ]
      },
      {
        id: 'over-50kb',
        title: 'If the file stays over 50KB',
        paragraphs: [
          'Detailed textures, noise and a large pixel size keep the file large. The tool lowers resolution only after quality alone cannot meet the target, and it reports when even the smallest attempt is still over.',
          'If the result is still over 50 KB, crop closer or resize the source before compressing. A PNG export ignores the target entirely, so choose JPG or WebP for a strict limit.'
        ]
      },
      {
        id: 'quality-50kb',
        title: 'Balance quality and size',
        paragraphs: [
          'Check the face and any text at 100% rather than on a small thumbnail. A file that looks fine in a preview can still be too soft for an official form. Keep the comparison slider and the reported KB visible while you decide.'
        ]
      }
    ]
  },
  {
    slug: 'compress-image-to-100kb',
    targetKB: 100,
    sections: [
      {
        id: 'what-100kb',
        title: 'What a 100KB image gives you',
        paragraphs: [
          'A 100 KB allowance leaves more detail than 20 KB or 50 KB. It is a practical choice for a profile photo, a form attachment or an on-screen document when the portal permits that size.',
          'The file is still compressed. JPG and WebP reduce quality to approach the target, so inspect the result rather than assuming it is unchanged.'
        ]
      },
      {
        id: 'settings-100kb',
        title: 'Formats and settings for 100KB',
        paragraphs: [
          'JPG is the safest choice for older portals and most upload forms. WebP is usually smaller and is a good option when the form names it, but some sites reject it even though browsers display it.',
          'Use a dimension preset only when the form asks for a specific frame. Otherwise keep the original aspect ratio and let the encoder lower the file size without cropping the image.'
        ]
      },
      {
        id: 'quality-100kb',
        title: 'Check quality at 100%',
        paragraphs: [
          'Look at the eyes, hair, small text and fine lines at full size. If those details matter, compare the result with the original and keep the target higher when the form allows it.'
        ],
        bullets: [
          'Confirm the downloaded file is under 100 KB.',
          'Check that the portal accepts JPG or WebP.',
          'Keep the original file for future use.'
        ]
      },
      {
        id: 'below-100kb',
        title: 'If you need to go below 100KB',
        paragraphs: [
          'Try the 50 KB page for a middle ground, or 20 KB for the strictest forms. Lower targets reduce detail, so change the target only when the portal requires it, not simply to make the file smaller.'
        ]
      }
    ]
  }
];

export function getSizeLandingPage(slug: string): SizeLandingPage | undefined {
  return SIZE_LANDING_PAGES.find((page) => page.slug === slug);
}
