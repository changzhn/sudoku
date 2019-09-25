import { App } from './App';
import { Controll } from './utils';
import { Grid } from './utils/SudokuCls';

export function startGame(this: App) {
  this.props.pageStore.startGame();
}

export function blockClick(this: App, grid: Grid) {
  if (grid.status.isInit) {
    return;
  }
  const { pageStore } = this.props;
  pageStore.chooseBlock(grid);
}

export function barClick(this: App, controll: Controll) {
  if (!controll.status) {
    return;
  }
  this.props.pageStore.fillNum(controll.num);
}