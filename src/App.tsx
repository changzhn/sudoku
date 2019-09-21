import React, { Component } from 'react';
import Checkerboard from './components/Checkerboard';
import ControllBar from './components/ControllBar';
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
    const { pageStore: { checkerboardData, controllBar } } = this.props;
    return (
      <div className="App">
        Sudoku Game
        <Checkerboard 
          checkerboardData={checkerboardData} 
          blockClick={events.blockClick.bind(this)}
        />
        <ControllBar 
          controllBar={controllBar} 
          barClick={events.barClick.bind(this)}
        />
      </div>
    );
  }
}

export default () => <App pageStore={pageStore} />;
