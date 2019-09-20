import { observable } from 'mobx';

export const colKeys = "ABCDEFGHI";
export const rowKeys = "123456789";

export class Block {
  @observable public num: number | null = null;
  public rowKey: string;
  public colKey: string;

  constructor(rowKey: string, colKey: string) {
    this.rowKey = rowKey;
    this.colKey = colKey;
  }
}

export const checkerboardData: Block[][] = Array(9)
	.fill(0)
	.map((row, rowIdx) => {
		// row
		const rowKey = rowKeys[rowIdx];

		return Array(9)
			.fill(0)
			.map((col, colIdx) => {
				const colKey = colKeys[colIdx];

				return new Block(rowKey, colKey);
			});
	});

export class Controll {
  @observable public num: number;
  @observable public status: boolean = true;

  constructor(num: number) {
    this.num = num;
  }
};

export const controllBar: Controll[] = rowKeys.split('').map(key => new Controll(+key));

class SudokuStore {
  @observable public checkerboardData: Block[][] = checkerboardData;
  @observable public controllBar: Controll[] = controllBar;
}

export default new SudokuStore();