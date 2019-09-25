import Utils from './index';
import { baseNums } from './constants';

export class Grid {
  public rowIdx: number;
	public colIdx: number;
	public _num: number | null = null;
	public showNum: number | null = null;
  public belongToPalace: number;
  public availabelNums: number[] = [];
	public availabelIdx: number = 0; 
	public status: {
		isInit: boolean,
		isChoosed: boolean,
	} = {
		isInit: true,
		isChoosed: false,
	};

	constructor(rowIdx: number, colIdx: number) {
		this.rowIdx = rowIdx;
		this.colIdx = colIdx;
		this.belongToPalace = Utils.getPalaceKey(rowIdx, colIdx);
	}

	public get num(): number | null {
		return this._num;
	}

	public set num(num: number | null) {
		this.showNum = num;
		this._num = num;
	}

	public next() {
		this.availabelIdx += 1;
		return this.availabelNums[this.availabelIdx];
	}
}

export default class Sudoku {
	public grids: Grid[][] = [];
	public numberOfMumbers?: number;

	/**
	 * @param numberOfMumbers 开局留下的个数
	 */
	constructor(numberOfMumbers?: number) {
		this.numberOfMumbers = numberOfMumbers;
		this.reset();
	}

	public get fullArray() {
		return this.toArray('num');
	}

	public get incompleteArray() {
		return this.toArray('showNum');
	}

	public reset() {
		this.grids = this.generateGrids();
		this.fill();
		this.digHoles();
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

	public fill() {
		this.fillFirstRow();
    this.fillRows();
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
		for (let i = startRowIdx; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (i === startRowIdx && j < startColIdx) {
					continue;
				}
				const grid = this.grids[i][j];
				const availabelNums = this.getAvailableNums(grid, 'num');
				if (availabelNums.length) {
					grid.availabelNums = availabelNums;
					grid.availabelIdx = 0;
					grid.num = availabelNums[grid.availabelIdx];
				} else {
					const { rowIdx: a, colIdx: b } = this.toFlashBack(grid);
					return this.fillRows(a, b);
				}
			}
		}
	}

	// 回溯
	public toFlashBack(grid: Grid): any {
		const { colIdx } = grid;

		if (colIdx === 0) {
			return this.toFlashBackByRow(grid);
		} else {
			return this.toFlashBackByCol(grid);
		}
	}

	// 按列
	public toFlashBackByCol(grid: Grid): any {
		const { rowIdx, colIdx } = grid;
		const prevGrid = this.grids[rowIdx][colIdx - 1];
		const isSucc = this.fillNextNum(prevGrid);
		if (!isSucc) {
			return this.toFlashBack(prevGrid);
		}
		return {
			rowIdx,
			colIdx
		};
	}

	// 按行
	public toFlashBackByRow(grid: Grid): any {
		const { rowIdx } = grid;
		let prevRowIdx = rowIdx - 1;
		// 清空上一行数据
		this.grids[prevRowIdx].forEach(grid => (grid.num = null));
		const prevGrid = this.grids[prevRowIdx][0];
		const isSucc = this.fillNextNum(prevGrid);
		if (!isSucc) {
			return this.toFlashBackByRow(prevGrid);
		}
		return {
			rowIdx: prevGrid.rowIdx,
			colIdx: prevGrid.colIdx
		};
	}

	public fillNextNum(grid: Grid) {
		const nextNum = grid.next();
		grid.num = nextNum;
		if (!nextNum) {
			grid.availabelIdx = 0;
		}
		return !!nextNum;
	}

	public getAvailableNums({
		rowIdx: targetRowIdx,
		colIdx: targetColIdx,
		belongToPalace: targetBelongToPalaca
	}: Grid, key: 'num' | 'showNum') {
		const occupiedRowNums: number[] = [];
		const occupiedColNums: number[] = [];
		const occupiedPalaceNums: number[] = [];
		this.grids.forEach(row => {
			row.forEach(grid => {
				if (grid[key]) {
					const { rowIdx, colIdx, belongToPalace } = grid;
					if (rowIdx === targetRowIdx) {
						occupiedRowNums.push(grid[key] as number);
					}
					if (colIdx === targetColIdx) {
						occupiedColNums.push(grid[key] as number);
					}
					if (belongToPalace === targetBelongToPalaca) {
						occupiedPalaceNums.push(grid[key] as number);
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

	public toArray(key: 'num' | 'showNum') {
		return this.grids.map(row => row.map(grid => grid[key]));
	}

	public digHoles() {
		const holes = 81 - (this.numberOfMumbers || 30);
		let digs = 0;
		while(digs < holes) {
			const i = Utils.random(0, 8);
			const j = Utils.random(0, 8);
			if (this.grids[i][j]) {
				this.grids[i][j].showNum = null;
				this.grids[i][j].status.isInit = false;
				digs++;
			}
		}
	}
}
