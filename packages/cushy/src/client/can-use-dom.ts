export const canUseDOM = typeof window !== 'undefined' && 'document' in window && 'createElement' in window.document;
