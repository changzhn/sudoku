import { observable, action } from "mobx";
import Utils, { Controll } from './utils';
import { controllKeys } from './utils/constants';
import SudokuCls, { Grid } from './utils/SudokuCls';

export interface IStep {
  step: number | string;
  rowIdx: number; 
  colIdx: number; 
  prevShowNum: number | null;
};

export class SudokuStore {
  @observable public sudoku: SudokuCls = new SudokuCls(0);
  @observable public controllBar: Controll[] = [];
  @observable public choosedGrid: Grid | null = null;
  @observable public isWin: boolean = false;
  @observable public history: IStep[] = [];

  constructor() {
    this.startGame();
  }

  @action public startGame() {
    this.sudoku = new SudokuCls(30);
    this.controllBar = controllKeys.map(key => new Controll(key));
    this.choosedGrid= null;
    this.isWin = false;
  }
  
  @action public chooseGrid(grid: Grid) {
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
    this.addGrid2History(this.choosedGrid);
    this.sudoku.grids[rowIdx][colIdx].showNum = num;
    this.isOver();
  }

  @action public addGrid2History({ rowIdx, colIdx, showNum }: Grid): void {
    const step: IStep = {
      step: this.history.length + 1,
      rowIdx,
      colIdx,
      prevShowNum: showNum,
    };
    this.history.unshift(step);
  }

  @action public resetFromHistory(step: IStep) {
    const history = [...this.history];

    while(step !== history[0]) {
      const prevStep = history.shift();
      const { rowIdx, colIdx, prevShowNum } = prevStep as IStep;
      this.sudoku.grids[rowIdx][colIdx].showNum = prevShowNum;
    }

    this.choosedGrid = null;
    this.history = history;
  }

  @action public isOver() {
    this.isWin = Utils.isCorrectData(this.sudoku.incompleteArray);
  }
}

export default new SudokuStore();
