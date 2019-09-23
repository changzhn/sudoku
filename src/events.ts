import { App } from './App';
import { Controll } from './utils';
import { IBlock } from './utils/interface';

export function startGame(this: App) {
  this.props.pageStore.startGame();
}

export function blockClick(this: App, block: IBlock) {
  if (block.isInitBlock) {
    return;
  }
  const { pageStore } = this.props;
  pageStore.chooseBlock(block);
}

export function barClick(this: App, controll: Controll) {
  if (!controll.status) {
    return;
  }
  this.props.pageStore.fillNum(controll.num);
}