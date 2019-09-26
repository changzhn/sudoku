import { observable, action } from "mobx";
import Utils, { Controll } from './utils';
import { controllKeys } from './utils/constants';
import SudokuCls, { Grid } from './utils/SudokuCls';

export class SudokuStore {
  @observable public sudoku: SudokuCls = new SudokuCls(0);
  @observable public controllBar: Controll[] = [];
  @observable public choosedGrid: Grid | null = null;
  @observable public isWin: boolean = false;

  constructor() {
    this.startGame();
  }

  @action public startGame() {
    this.sudoku = new SudokuCls(30);
    this.controllBar = controllKeys.map(key => new Controll(key));
    this.choosedGrid= null;
    this.isWin = false;
  }
  
  @action public chooseBlock(grid: Grid) {
    if (this.choosedGrid) {
      this.choosedGrid.status.isChoosed = false;
    }
    grid.status.isChoosed = true;
    this.choosedGrid = grid;
    this.calcControllBar();
  }

  @action public calcControllBar() {
    const activeNums: number[] = this.sudoku.getAvailableNums(this.choosedGrid as Grid, 'showNum');
    this.controllBar = this.controllBar.map(bar => {
      bar.status = activeNums.includes(bar.num as number);
      return bar;
    });
  }

  @action public fillNum(num: number | null) {
    if (!this.choosedGrid) {
      return;
    }
    const { rowIdx, colIdx } = this.choosedGrid;
    this.sudoku.grids[rowIdx][colIdx].showNum = num;
    this.isOver();
  }

  @action public isOver() {
    this.isWin = Utils.isCorrectData(this.sudoku.incompleteArray);
  }
}

export default new SudokuStore();
