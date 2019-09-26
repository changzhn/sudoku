import * as React from 'react';
import { IStep } from '../../state';
import { observer } from 'mobx-react';
import './index.css';

interface IProps {
  history: IStep[];
  stepClick: (step: IStep) => void;
}

const History: React.SFC<IProps> = observer(({ history, stepClick }) => {
  return (
    <div className="game-status-container history-container">
      {
        history.map(step => (
          <div key={step.step} className="history-step" onClick={() => stepClick(step)}>
            第{step.step}步
          </div>
        ))
      }
    </div>
  );
});

export default History;
