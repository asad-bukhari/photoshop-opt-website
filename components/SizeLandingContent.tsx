import { ContentSheet } from './ContentSheet';
import { SizeLandingLinks } from './SizeLandingLinks';
import type { SizeLandingPage } from '@/lib/data/sizeLandingPages';

export function SizeLandingContent({ page }: { page: SizeLandingPage }) {
  return (
    <ContentSheet>
      {page.sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24 space-y-3">
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.bullets && (
            <ul>
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      <SizeLandingLinks currentSlug={page.slug} />
    </ContentSheet>
  );
}
