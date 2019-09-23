import { observable, action } from "mobx";
import Utils, { Controll } from './utils';
import { IBlock } from './utils/interface';
import { controllKeys } from './utils/constants';
import SudokuBoard from './utils/SudokuBoard';

export class SudokuStore {
  public fullData: IBlock[][] = [];
	@observable public checkerboardData: IBlock[][] = [];
  @observable public controllBar: Controll[] = [];
  @observable public choosedBlock: IBlock | null = null;
  @observable public isWin: boolean = false;

  constructor() {
    this.startGame();
  }

  @action public startGame() {
    const sudokuBoard = new SudokuBoard(80);
    this.fullData = Utils.generateCheckerboardState(sudokuBoard.fullArray);
    this.checkerboardData = Utils.generateCheckerboardState(sudokuBoard.incompleteArray);
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
    });

    this.isOver();
  }

  @action public isOver() {
    let isWin = true;
    this.checkerboardData.forEach(row => {
      row.forEach(col => {
        if (!col.num) {
          isWin = false;
        }
      });
    });

    this.isWin = isWin;
  }
}

export default new SudokuStore();
