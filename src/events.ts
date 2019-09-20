import { App } from './App';
import { Block, Controll } from './state';

export function barClick(this: App, controll: Controll) {
  if (!controll.status) {
    return;
  }
}