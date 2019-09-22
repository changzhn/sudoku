import { observable, action } from "mobx";
import someState, { initState } from "./initSquare";
import { IBlock } from './interface';

export const rowKeys = Array(9).fill(0).map((_, idx) => idx);
export const colKeys = rowKeys;
export const controllKeys = rowKeys.map(n => n + 1);

function getPalaceKey(rowKey: number, colKey: number): number {
  const palaceKey = Math.floor(rowKey / 3) * 3 + Math.floor(colKey / 3) + 1;
  return palaceKey;
}

function createCheckerboardState(nums: Array<Array<number | null>>) {
  const checkerboardData: any = nums.map((row, rowIdx) => {
    const rowKey = rowKeys[rowIdx];
    return row.map((col, colIdx) => {
      const colKey = colKeys[colIdx];
      return createBlock({ num: col, rowKey, colKey });
    });
  });
  return checkerboardData;
}

const createBlock: (opt: { num: number | null, rowKey: number, colKey: number }) => IBlock = 
  ({ num, rowKey, colKey }) => {
    const rowIdx = rowKeys.indexOf(rowKey);
    const colIdx = colKeys.indexOf(colKey);
    return {
      num,
      rowKey: rowIdx,
      colKey: colIdx,
      palaceKey: getPalaceKey(rowIdx, colIdx),
      isChoosed: false,
      isInitBlock: !!num,
    };
  };

export class Controll {
	@observable public num: number | null;
	@observable public status: boolean = false;

	constructor(num: number) {
		this.num = num;
	}
}

const controllBar: Controll[] = controllKeys.map(key => new Controll(key));

export class SudokuStore {
	@observable public checkerboardData: IBlock[][] = createCheckerboardState(initState);
  @observable public controllBar: Controll[] = controllBar;
  @observable public choosedBlock: IBlock | null = null;

  @action public startGame() {
    this.checkerboardData = createCheckerboardState(someState);
    this.controllBar = controllKeys.map(key => new Controll(key));
    this.choosedBlock = null;
  }
  
  @action public chooseBlock(block: IBlock) {
    if (this.choosedBlock) {
      this.choosedBlock.isChoosed = false;
    }
    block.isChoosed = true;
    this.choosedBlock = block;
    this.calcControllBar();
  }

  @action public calcControllBar() {
    const { rowKey: targetRowKey, colKey: targetColKey, palaceKey: targetPalaceKey } = this.choosedBlock as IBlock;
    const rowFilledNums: number[] = [];
    const colFilledNums: number[] = [];
    const palaceFilledNums: number[] = [];


    this.checkerboardData.forEach(row => {
      // 查找的数字不要包括该数据格的数据
      row.forEach(block => {
        const { palaceKey, rowKey, colKey, num } = block;
        if (!(rowKey === targetRowKey && colKey === targetColKey) && num) {
          if (rowKey === targetRowKey) {
            rowFilledNums.push(num);
          }

          if (colKey === targetColKey) {
            colFilledNums.push(num);
          }

          if (palaceKey === targetPalaceKey) {
            palaceFilledNums.push(num);
          }
        }
      })
    });

    const filledNums: Set<number> = new Set([...rowFilledNums, ...colFilledNums, ...palaceFilledNums]);
    const allNums: Set<number> = new Set(controllKeys);
    const activeNums: number[] = [...new Set([...allNums].filter(x => !filledNums.has(x)))];

    this.controllBar = this.controllBar.map(bar => {
      bar.status = activeNums.includes(bar.num as number);
      return bar;
    })

  }

  @action public fillNum(num: number | null) {
    if (!this.choosedBlock) {
      return;
    }
    const { rowKey, colKey } = this.choosedBlock;
    this.checkerboardData = this.checkerboardData.map(row => {
      row = row.map(col => {
        if (col.rowKey === rowKey && col.colKey === colKey) {
          col.num = num;
        }
        return col;
      })
      return row;
    })
  }
}

export default new SudokuStore();
