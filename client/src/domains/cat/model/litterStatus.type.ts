export const LITTER_STATUS = ['trained', 'not trained', 'unknown'] as const;

export type LitterStatus = (typeof LITTER_STATUS)[number];
