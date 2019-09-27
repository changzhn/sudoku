import Utils from './index';
import { baseNums } from './constants';
import { observable } from "mobx";

export class Grid {
  public rowIdx: number;
	public colIdx: number;
	public _num: number | null = null;
	@observable public showNum: number | null = null;
  public belongToPalace: number;
  public availabelNums: number[] = [];
	public availabelIdx: number = 0; 
	@observable public status: {
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

class Palace {
	public palaceNum: number;
	public rowIdxStart: number;
	public rowIdxEnd: number;
	public colIdxStart: number;
	public colIdxEnd: number;
		
  constructor(palaceNum: number) {
    this.palaceNum = palaceNum;
    this.rowIdxStart = (Math.ceil(palaceNum / 3) - 1) * 3;
    this.rowIdxEnd = this.rowIdxStart + 3;

    let colRest = palaceNum % 3;
    if (colRest === 0) {
      colRest = 3;
    }
    this.colIdxStart = (colRest - 1) * 3;
    this.colIdxEnd = this.colIdxStart + 3;
  }
}

export default class Sudoku {
	@observable public grids: Grid[][] = [];
	public palaces: Palace[];
	public numberOfMumbers?: number;

	/**
	 * @param numberOfMumbers 开局留下的个数
	 */
	constructor(numberOfMumbers?: number) {
		this.numberOfMumbers = numberOfMumbers;
		this.palaces = baseNums.map(num => new Palace(num));
		this.reset();
		console.log(this.fullArray)
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
		// this.digHoles();
	}

	public generateGrids() {
		const grids = Array(9)
			.fill(0)
			.map((row, rowIdx) =>
				Array(9)
				.fill(0)
				.map((col, colIdx) => new Grid(rowIdx, colIdx))
			);
		return grids;
	}

	public fill() {
		this.initPalace(1, 5, 9);
		const others = [2, 3, 4, 6, 7, 8];
		for(let i = 0; i < others.length; i++) {
			const palaceNum = others[i];
			const isSucc = this.fillOnePalace(palaceNum);
			debugger
			if (!isSucc) {
				this.clearOnePalace(palaceNum);
				i--;
			}
		}
	}

	public fillFirstRow() {
		const randomNums = Utils.randomOne2Nine();
		this.grids[0].forEach(grid => {
			grid.num = randomNums.pop() as number;
		});
	}

	public initPalace(...palaceNums: number[]) {
    palaceNums.forEach(palaceNum => {
      const palace = this.palaces[palaceNum - 1];
      const { rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd } = palace;
      const randomNums = Utils.randomOne2Nine();
      for(let i = rowIdxStart; i < rowIdxEnd; i++) {
        for(let j = colIdxStart; j < colIdxEnd; j++) {
          this.grids[i][j].num = randomNums.pop() as number;
        }
      }
    });
	}
	
	public fillOnePalace(palaceNum: number, rowIdx?: number, colIdx?: number): any {
		const palace = this.palaces[palaceNum - 1];
		const { rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd } = palace;
		const startI = rowIdx || rowIdxStart;
		const startJ = colIdx || colIdxStart;

		for(let i = startI; i < rowIdxEnd; i++) {
			for(let j = colIdxStart; j < colIdxEnd; j++) {
				if (i === startI && j < startJ) {
					continue;
				}
				const grid = this.grids[i][j];
				const availabelNums = this.getAvailableNums(grid, 'num');
				if (availabelNums.length) {
					grid.availabelNums = availabelNums;
					grid.availabelIdx = 0;
					grid.num = availabelNums[grid.availabelIdx];
				} else {
					const result = this.toFlashBack(grid);
					if (result) {
						const { rowIdx: a, colIdx: b } = result;
						return this.fillOnePalace(palaceNum, a, b);
					}
					return false;
				}
			}
		}

		return true;
	}

	public clearOnePalace(palaceNum: number) {
		const palace = this.palaces[palaceNum - 1];
		const { rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd } = palace;
		for(let i = rowIdxStart; i < rowIdxEnd; i++) {
			for(let j = colIdxStart; j < colIdxEnd; j++) {
				this.grids[i][j].num = null;
			}
		}
	}

	// 回溯
	public toFlashBack(grid: Grid): any {
		const { rowIdx, colIdx, belongToPalace } = grid;
		const { rowIdxStart, colIdxStart } = this.palaces[belongToPalace - 1];

		if (rowIdx <= rowIdxStart && colIdx <= colIdxStart) {
			// 按 palace 回溯
			return false;
		} else if (colIdx <= colIdxStart) {
			// 按行
			return this.toFlashBackByRow(grid);
		} else {
			// 按列
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
		const { rowIdx, colIdx } = grid;
		let prevRowIdx = rowIdx - 1;
		// 清空上一行数据
		this.grids[prevRowIdx].forEach(grid => (grid.num = null));
		const prevGrid = this.grids[prevRowIdx][colIdx];
		const isSucc = this.fillNextNum(prevGrid);
		if (!isSucc) {
			return this.toFlashBack(prevGrid);
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
