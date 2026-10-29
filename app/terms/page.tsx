import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms for using Zaibi Tools, the free browser-based image compressor and CNIC print tool.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true }
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="October 29, 2026">
      <p>
        By accessing or using zaibitools.com (the &quot;Service&quot;), you agree to these terms. If you do not agree,
        do not use the Service.
      </p>

      <h2>Use of the Service</h2>
      <p>
        The Service provides browser-based tools for image compression and identity-document print layout. You may use
        it for lawful personal or business purposes. You are responsible for the files you process and for ensuring you
        have the right to use them.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use the Service to forge, alter, or misuse identity documents or to commit fraud.</li>
        <li>Do not attempt to disrupt, reverse engineer, or gain unauthorized access to the Service.</li>
        <li>Do not use the Service in violation of any applicable law or regulation.</li>
      </ul>

      <h2>No affiliation</h2>
      <p>
        Zaibi Tools is an independent website. It is not affiliated with NADRA or any government office, and it does
        not issue, verify, or certify identity documents.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Service, including its software, design, and content, is owned by Asad Bukhari. You may not copy,
        redistribute, or resell the Service without permission. You retain all rights to the files you process.
      </p>

      <h2>No warranty</h2>
      <p>
        The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not
        guarantee that output will be error-free or fit for a particular purpose, including official or legal
        submission.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages
        arising from your use of the Service.
      </p>

      <h2>Third-party services</h2>
      <p>
        The Service may load third-party libraries and display third-party advertising. We are not responsible for the
        content or practices of those providers.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms at any time. Continued use of the Service after changes means you accept the revised
        terms.
      </p>
    </LegalPage>
  );
}
