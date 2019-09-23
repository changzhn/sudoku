export const rowKeys = Array(9).fill(0).map((_, idx) => idx);
export const colKeys = rowKeys;
export const controllKeys = rowKeys.map(n => n + 1);
export const rownames = '123456789'.split('');
export const colnames = 'ABCDEFGHI'.split('');