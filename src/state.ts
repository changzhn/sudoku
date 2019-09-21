import { observable, action } from "mobx";
import initSquare from "./initSquare";
import { IBlock } from './interface';

export const colKeys = "ABCDEFGHI";
export const rowKeys = "123456789";

const createBlock: (opt: { num: number | null, rowKey: string, colKey: string }) => IBlock = 
  ({ num, rowKey, colKey }) => ({
    num,
    rowKey,
    colKey,
    isChoosed: false,
    isInitBlock: !!num,
  });

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

const controllBar: Controll[] = rowKeys
	.split("")
	.map(key => new Controll(+key));

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
  }
}

export default new SudokuStore();
