import React, { Component } from 'react';
import Checkerboard from './components/Checkerboard';
import ControllBar from './components/ControllBar';
import BlockStatus from './components/BlockStatus';
import GameStatus from './components/GameStatus';
import { observer } from 'mobx-react';
import pageStore, { SudokuStore } from './state';
import * as events from './events';
import './App.css';


interface IProps {
  pageStore: SudokuStore;
}

@observer
export class App extends Component<IProps> {

  render() {
    const { pageStore: { sudoku, controllBar, choosedGrid, isWin } } = this.props;

    return (
      <div className="App">
        <div className="left">
          Sudoku Game { isWin ? 'win' : 'not win' }
          <Checkerboard 
            sudoku={sudoku} 
            blockClick={events.blockClick.bind(this)}
          />
          <ControllBar 
            controllBar={controllBar} 
            choosedGrid={choosedGrid}
            barClick={events.barClick.bind(this)}
          />
        </div>
        <div className="right">
          Dashboard
          <GameStatus 
            start={events.startGame.bind(this)}
          />
          {choosedGrid && <BlockStatus 
            choosedGrid={choosedGrid} 
            controllBar={controllBar} 
          />}
        </div>
      </div>
    );
  }
}

export default () => <App pageStore={pageStore} />;
