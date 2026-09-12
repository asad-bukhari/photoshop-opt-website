'use client';

import { AD_NETWORK_DOMAIN } from '@/lib/data/ads';

interface AdBannerProps {
  width: number;
  height: number;
  adKey: string;
  className?: string;
  lazy?: boolean;
  showLabel?: boolean;
}

function buildSnippet(width: number, height: number, adKey: string): string {
  return [
    '<!doctype html><html><head><meta charset="utf-8">',
    '<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>',
    '</head><body>',
    '<script type="text/javascript">',
    `atOptions = { 'key' : '${adKey}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };`,
    '<\/script>',
    `<script type="text/javascript" src="https://${AD_NETWORK_DOMAIN}/${adKey}/invoke.js"><\/script>`,
    '</body></html>'
  ].join('');
}

export function AdBanner({
  width,
  height,
  adKey,
  className = '',
  lazy = false,
  showLabel = true
}: AdBannerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {showLabel && (
        <span className="mb-1 font-mono text-[9px] uppercase tracking-widest text-ink-soft/60 dark:text-rule/60">
          Advertisement
        </span>
      )}
      <div
        className="overflow-hidden rounded-lg border border-line bg-paper-2 dark:border-rule dark:bg-ink-2"
        style={{ width, height, maxWidth: '100%' }}
      >
        <iframe
          title="Advertisement"
          width={width}
          height={height}
          loading={lazy ? 'lazy' : 'eager'}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
          srcDoc={buildSnippet(width, height, adKey)}
          style={{ border: 0, display: 'block' }}
        />
      </div>
    </div>
  );
}
