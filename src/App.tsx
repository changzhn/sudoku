import React, { Component } from 'react';
import Checkerboard from './components/Checkerboard';
import ControllBar from './components/ControllBar';
import GridStatus from './components/GridStatus';
import GameStatus from './components/GameStatus';
import History from './components/History';
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
    const { pageStore: { sudoku, controllBar, choosedGrid, isWin, history } } = this.props;

    return (
      <div className="App">
        <div className="left">
          Sudoku Game { isWin ? 'win' : 'not win' }
          <Checkerboard 
            sudoku={sudoku} 
            gridClick={events.gridClick.bind(this)}
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
          {history.length ? 
          <History 
            history={history} 
            stepClick={events.stepClick.bind(this)}
          /> : null}
          {choosedGrid && <GridStatus 
            choosedGrid={choosedGrid} 
            controllBar={controllBar} 
          />}
        </div>
      </div>
    );
  }
}

export default () => <App pageStore={pageStore} />;
