export const AD_NETWORK_DOMAIN = 'www.highrevenueformat.com';

export const ADS = {
  mediumRectangle: { width: 300, height: 250, key: 'cbdc4b8cc1f4807ada89b24237faae15' },
  leaderboard: { width: 728, height: 90, key: '264ca94a6fb1c791f0d8c3108d33aae6' },
  mobileBanner: { width: 320, height: 50, key: 'b14ff2e851aba105f9e042037ec04682' }
} as const;

export type AdUnit = (typeof ADS)[keyof typeof ADS];
