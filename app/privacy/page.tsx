import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Zaibi Tools handles data: your chosen files are processed in the browser and are not uploaded. The site uses analytics and third-party ads.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true }
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 29, 2026">
      <p>
        Zaibi Tools (&quot;we&quot;, &quot;us&quot;) operates zaibitools.com. This policy explains what information is
        processed when you use our browser-based image and CNIC tools.
      </p>

      <h2>Your files stay in your browser</h2>
      <p>
        All image compression, format conversion, and CNIC print layout processing runs locally in your web browser
        using the HTML5 Canvas API. The tools do not upload, transmit, store, or give us access to the images, identity
        documents, or files you load into them.
      </p>

      <h2>Information we process</h2>
      <p>We do not require accounts and do not collect names, addresses, or uploaded content. We may process:</p>
      <ul>
        <li>
          Aggregated usage analytics (pages viewed, approximate region, device type) through Google Analytics 4.
        </li>
        <li>Standard server logs from our hosting provider, which may include IP address and user agent.</li>
        <li>Aggregated ad delivery data from third-party advertising networks.</li>
      </ul>

      <h2>Advertising</h2>
      <p>
        This site displays advertising served by third-party networks. These networks may use cookies or similar
        technologies to show relevant ads. You can control cookies through your browser settings and opt out of
        personalized advertising through the network&apos;s own controls.
      </p>

      <h2>Third-party services</h2>
      <p>
        We use Google Analytics for measurement and may load third-party libraries, such as jsPDF, from content
        delivery networks to power specific export features. These providers have their own privacy policies.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        These tools are not directed to children under 13. We do not knowingly collect personal information from
        children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be reflected by the &quot;last updated&quot;
        date above.
      </p>
    </LegalPage>
  );
}
