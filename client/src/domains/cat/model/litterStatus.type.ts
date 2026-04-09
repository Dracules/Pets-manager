export const LITTER_STATUS = ['unknown', 'trained', 'not trained'] as const;

export type LitterStatus = (typeof LITTER_STATUS)[number];
