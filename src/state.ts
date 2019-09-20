import { observable, action } from "mobx";
import initSquare from "./initSquare";

export const colKeys = "ABCDEFGHI";
export const rowKeys = "123456789";

export class Block {
	@observable public num: number | null = null;
  @observable public isChoosed: boolean = false;
	public rowKey: string;
  public colKey: string;
  public isInit: boolean;

	constructor(num: number | null, rowKey: string, colKey: string) {
		this.num = num;
		this.rowKey = rowKey;
    this.colKey = colKey;
    this.isInit = !!num;
	}
}

const checkerboardData: Block[][] = initSquare.map((row, rowIdx) => {
	// row
	const rowKey = rowKeys[rowIdx];

	return row.map((col, colIdx) => {
		const colKey = colKeys[colIdx];

		return new Block(col, rowKey, colKey);
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
	@observable public checkerboardData: Block[][] = checkerboardData;
  @observable public controllBar: Controll[] = controllBar;
  @observable public choosedBlock: Block | null = null;
  
  @action public chooseBlock(block: Block) {
    if (this.choosedBlock) {
      this.choosedBlock.isChoosed = false;
    }
    block.isChoosed = true;
    this.choosedBlock = block;
  }
}

export default new SudokuStore();
