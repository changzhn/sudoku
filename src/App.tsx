import React, { Component } from 'react';
import Checkerboard from './components/Checkerboard';
import ControllBar from './components/ControllBar';
import pageStore, { Block, Controll } from './state';
import * as events from './events';
import './App.css';


interface IProps {
  pageStore: {
    checkerboardData: Block[][],
    controllBar: Controll[],
  };
}

export class App extends Component<IProps> {

  render() {
    const { pageStore: { checkerboardData, controllBar } } = this.props;
    return (
      <div className="App">
        Sudoku Game
        <Checkerboard 
          checkerboardData={checkerboardData} 
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
