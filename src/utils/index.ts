import { IBlock } from './interface';
import { rowKeys, colKeys, controllKeys,baseNums } from './constants';

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

  public static random(start: number, end: number) {
		return Math.floor(Math.random() * (end + 1 - start) + start);
	}

	public static randomOne2Nine() {
		const nums = [...baseNums];
		Utils.randomArray(nums);
		return nums;
	}

	public static randomArray(array: any[]) {
		const len = array.length - 1;
		Array(10)
			.fill(0)
			.forEach(() => {
				const start = Utils.random(0, len);
				const end = Utils.random(0, len);
				[array[start], array[end]] = [array[end], array[start]];
			});
	}
}

export default Utils;