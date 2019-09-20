import { App } from './App';
import { Block, Controll } from './state';

export function blockClick(this: App, block: Block) {
  if (block.isInit) {
    return;
  }
  const { pageStore } = this.props;
  pageStore.chooseBlock(block);
}

export function barClick(this: App, controll: Controll) {
  if (!controll.status) {
    return;
  }
}