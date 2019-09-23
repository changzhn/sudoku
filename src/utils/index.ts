import { IBlock } from './interface';
import { rowKeys, colKeys, controllKeys } from './constants';

export class Controll {
	public num: number | null;
	public status: boolean = false;

	constructor(num: number) {
		this.num = num;
	}
}

class Utils {
  public static generateControllBar(): Controll[] {
    return controllKeys.map(key => new Controll(key))
  }

  public static getPalaceKey(rowKey: number, colKey: number): number {
    const palaceKey = Math.floor(rowKey / 3) * 3 + Math.floor(colKey / 3) + 1;
    return palaceKey;
  }

  public static createBlock ({ num, rowKey, colKey }: { num: number | null, rowKey: number, colKey: number }): IBlock {
    const rowIdx = rowKeys.indexOf(rowKey);
    const colIdx = colKeys.indexOf(colKey);
    return {
      num,
      rowKey: rowIdx,
      colKey: colIdx,
      palaceKey: Utils.getPalaceKey(rowIdx, colIdx),
      isChoosed: false,
      isInitBlock: !!num,
    };
  }

  public static generateCheckerboardState(nums: Array<Array<number | null>>) {
    const checkerboardData: any = nums.map((row, rowIdx) => {
      const rowKey = rowKeys[rowIdx];
      return row.map((col, colIdx) => {
        const colKey = colKeys[colIdx];
        return Utils.createBlock({ num: col, rowKey, colKey });
      });
    });
    return checkerboardData;
  }
}

export default Utils;