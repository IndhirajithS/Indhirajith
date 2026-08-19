/**
 * Helper functions for calculating word counts, line-by-line diffs, and deltas between document versions.
 */

/**
 * Calculate total word count of a string.
 */
export const countWords = (text) => {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

/**
 * Compute word delta between two texts or versions.
 */
export const computeWordDelta = (text1, text2) => {
  const count1 = countWords(text1);
  const count2 = countWords(text2);
  const diff = count2 - count1;
  return {
    v1Count: count1,
    v2Count: count2,
    delta: diff,
    formattedDelta: diff > 0 ? `+${diff}` : `${diff}`
  };
};

/**
 * Generate a line-by-line diff between v1 and v2 content.
 */
export const computeLineDiff = (text1 = '', text2 = '') => {
  const lines1 = text1 ? text1.split('\n') : [];
  const lines2 = text2 ? text2.split('\n') : [];

  const diffResult = [];
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  let i = 0;
  let j = 0;

  while (i < lines1.length || j < lines2.length) {
    if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
      diffResult.push({
        type: 'unchanged',
        lineNoV1: i + 1,
        lineNoV2: j + 1,
        content: lines1[i]
      });
      unchanged++;
      i++;
      j++;
    } else if (j < lines2.length && (!lines1.includes(lines2[j], i))) {
      diffResult.push({
        type: 'addition',
        lineNoV1: null,
        lineNoV2: j + 1,
        content: lines2[j]
      });
      additions++;
      j++;
    } else if (i < lines1.length) {
      diffResult.push({
        type: 'deletion',
        lineNoV1: i + 1,
        lineNoV2: null,
        content: lines1[i]
      });
      deletions++;
      i++;
    }
  }

  return {
    diffLines: diffResult,
    summary: {
      additions,
      deletions,
      unchanged,
      totalLines: diffResult.length
    }
  };
};
