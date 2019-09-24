import Utils from './index';
import { baseNums } from './constants';

export class Grid {
  public rowIdx: number;
  public colIdx: number;
  public num: number | null = null;
  public belongToPalace: number;
  public availabelNums: number[] = [];
  public availabelIdx: number = 0; 

	constructor(rowIdx: number, colIdx: number) {
		this.rowIdx = rowIdx;
		this.colIdx = colIdx;
		this.belongToPalace = Utils.getPalaceKey(rowIdx, colIdx);
	}

	next() {
		this.availabelIdx += 1;
		return this.availabelNums[this.availabelIdx];
	}
}

export default class SudokuStore {
  public grids: Grid[][];
	public fullArray: number[][];
	public incompleteArray: Array<Array<number | null>>;

	constructor(num?: number) {
		this.grids = this.generateGrids();
		this.fillFirstRow();
    this.fillRows();
		this.fullArray = this.toArray() as number[][];
		this.incompleteArray = this.digHoles(num || 30);
	}

	public generateGrids() {
		const grids = Array(9)
			.fill(0)
			.map((row, rowIdx) =>
				Array(9)
					.fill(0)
					.map((col, colIdx) => {
						const grid = new Grid(rowIdx, colIdx);
						return grid;
					})
			);
		return grids;
	}

	public fillFirstRow() {
		const randomNums = Utils.randomOne2Nine();
		this.grids[0].forEach(grid => {
			grid.num = randomNums.pop() as number;
		});
	}

	public fillRows(startRowIdx?: number, startColIdx?: number): any {
    startRowIdx = startRowIdx || 1;
    startColIdx = startColIdx || 0;
		for (let i = 1; i < 9; i++) {
			if (i < startRowIdx) {
				continue;
			}
			for (let j = 0; j < 9; j++) {
				if (i === startRowIdx && j < startColIdx) {
					continue;
				}
				const grid = this.grids[i][j];
				const availabelNums = this.getAvailableNums(grid);
				if (availabelNums.length) {
					grid.availabelNums = availabelNums;
					grid.num = availabelNums[grid.availabelIdx];
				} else {
					const { rowIdx: a, colIdx: b } = this.toFlashBack(grid);
					return this.fillRows(a, b);
				}
			}
		}
	}

	// FIXME: 整理
	public toFlashBack(grid: Grid): any {
		const { rowIdx, colIdx } = grid;
		if (colIdx !== 0) {
			// 列
			const prevGrid = this.grids[rowIdx][colIdx - 1];
			const isSucc = this.fillNextNum(prevGrid);
			if (!isSucc) {
				return this.toFlashBack(prevGrid);
			}

			return {
				rowIdx,
				colIdx
			};

		} else {
			// 行
			let isSucc = false;
			let prevRowIdx = rowIdx;
			while(!isSucc) {
				prevRowIdx--;
				if (prevRowIdx === 0) {
					return {
						rowIdx: 1,
						colIdx: 0,
					}
				}
				// 清空上一行数据
				this.grids[prevRowIdx].forEach(grid => (grid.num = null));
				const prevGrid = this.grids[prevRowIdx][0];
				isSucc = this.fillNextNum(prevGrid);
				return {
					rowIdx: prevGrid.rowIdx,
					colIdx: prevGrid.colIdx
				};
			}
		}
	}

	fillNextNum(grid: Grid) {
		const nextNum = grid.next();
		grid.num = nextNum;
		if (!nextNum) {
			grid.availabelIdx = 0;
		}
		return !!nextNum;
	}

	getAvailableNums({
		rowIdx: targetRowIdx,
		colIdx: targetColIdx,
		belongToPalace: targetBelongToPalaca
	}: Grid) {
		const occupiedRowNums: number[] = [];
		const occupiedColNums: number[] = [];
		const occupiedPalaceNums: number[] = [];
		this.grids.forEach(row => {
			row.forEach(grid => {
				if (grid.num) {
					const { rowIdx, colIdx, belongToPalace, num } = grid;
					if (rowIdx === targetRowIdx) {
						occupiedRowNums.push(num);
					}
					if (colIdx === targetColIdx) {
						occupiedColNums.push(num);
					}
					if (belongToPalace === targetBelongToPalaca) {
						occupiedPalaceNums.push(num);
					}
				}
			});
		});

		const occupiedNums = new Set([
			...occupiedRowNums,
			...occupiedColNums,
			...occupiedPalaceNums
		]);
		const allNums = new Set(baseNums);
		const availabelNums = [
			...new Set([...allNums].filter(x => !occupiedNums.has(x)))
		];
		if (availabelNums.length) {
			Utils.randomArray(availabelNums);
		}
		return availabelNums;
	}

	toArray() {
		return this.grids.map(row => row.map(grid => grid.num));
	}

	digHoles(num: number) {
		const fullArray: Array<Array<number | null>> = this.fullArray.map(row => row.map(grid => grid));
		const holes = 81 - num;
		let digs = 0;
		while(digs < holes) {
			const i = Utils.random(0, 8);
			const j = Utils.random(0, 8);
			if (fullArray[i][j]) {
				fullArray[i][j] = null;
				digs++;
			}
		}
		return fullArray
	}
}
