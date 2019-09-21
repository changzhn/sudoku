import { observable, action } from "mobx";
import initSquare from "./initSquare";
import { IBlock } from './interface';

export const rowKeys = Array(9).fill(0).map((_, idx) => idx);
export const colKeys = rowKeys;
export const controllKeys = rowKeys.map(n => n + 1);

function getPalaceKey(rowKey: number, colKey: number): number {
  const palaceKey = Math.floor(rowKey / 3) * 3 + Math.floor(colKey / 3) + 1;
  return palaceKey;
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

const checkerboardData: any = initSquare.map((row, rowIdx) => {
	// row
	const rowKey = rowKeys[rowIdx];

	return row.map((col, colIdx) => {
		const colKey = colKeys[colIdx];

		// return new Block(col, rowKey, colKey);
		return createBlock({ num: col, rowKey, colKey });
	});
});

export class Controll {
	@observable public num: number;
	@observable public status: boolean = true;

	constructor(num: number) {
		this.num = num;
	}
}

const controllBar: Controll[] = controllKeys.map(key => new Controll(key));

export class SudokuStore {
	@observable public checkerboardData: IBlock[][] = checkerboardData;
  @observable public controllBar: Controll[] = controllBar;
  @observable public choosedBlock: IBlock | null = null;
  @observable public x: number = 0;
  
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
      row.forEach(block => {
        const { palaceKey, rowKey, colKey } = block;
        if (block.num) {
          if (rowKey === targetRowKey) {
            rowFilledNums.push(block.num);
          }

          if (colKey === targetColKey) {
            colFilledNums.push(block.num);
          }

          if (palaceKey === targetPalaceKey) {
            palaceFilledNums.push(block.num);
          }
        }
      })
    });

    const filledNums: Set<number> = new Set([...rowFilledNums, ...colFilledNums, ...palaceFilledNums]);
    const allNums: Set<number> = new Set(controllKeys);
    const activeNums: number[] = [...new Set([...allNums].filter(x => !filledNums.has(x)))];

    this.controllBar = this.controllBar.map(bar => {
      bar.status = activeNums.includes(bar.num);
      return bar;
    })

    console.log(activeNums);
  }
}

export default new SudokuStore();
