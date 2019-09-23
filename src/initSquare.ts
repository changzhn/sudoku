export const initState: Array<Array<null>> = Array(9).fill(0).map(_ => Array(9).fill(null));

export const half: Array<Array<number | null>> = [
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

export const total = [ [ 8, 1, 2, 7, 5, 3, 6, 4, 9 ],
[ 9, 4, 3, 6, 8, 2, 1, 7, 5 ],
[ 6, 7, 5, 4, 9, 1, 2, 8, 3 ],
[ 1, 5, 4, 2, 3, 7, 8, 9, 6 ],
[ 3, 6, 9, 8, 4, 5, 7, 2, 1 ],
[ 2, 8, 7, 1, 6, 9, 5, 3, 4 ],
[ 5, 2, 1, 9, 7, 4, 3, 6, 8 ],
[ 4, 3, 8, 5, 2, 6, 9, 1, 7 ],
[ 7, 9, 6, 3, 1, 8, 4, 5, 2 ] ];
