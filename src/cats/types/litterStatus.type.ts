export const LITTER_SRATUS = ['trained', 'not trained', 'unknown'] as const;

export type LitterStatus = (typeof LITTER_SRATUS)[number];
