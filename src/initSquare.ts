export const initState: Array<Array<null>> = Array(9).fill(0).map(_ => Array(9).fill(null));

const d: Array<Array<number | null>> = [
  [null, 7, null, null, null, 8, null, null, null],
  [null, null, null, 4, null, null, 2, null, null],
  [2, null, 9, null, null, null, 8, null, null],
  [null, null, 8, null, null, 7, null, null, 2],
  [null, 6, null, null, null, 4, null, 3, 9],
  [null, null, 4, 5, 9, null, null, null, null],
  [null, 8, null, null, 3, null, null, 2, null],
  [9, null, null, 6, null, null, null, null, 8],
  [3, null, 7, null, null, 5, null, 6, null],
];

export default d;