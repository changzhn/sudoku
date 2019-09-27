import * as React from 'react';
import { IStep } from '../../state';
import { observer } from 'mobx-react';
import './index.css';
import { rownames, colnames } from '../../utils/constants';

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
            {
              step.step === 0 ? 
              `开局` :
              `第${step.step}步  ${colnames[step.colIdx]} ${rownames[step.rowIdx]}`
            }
          </div>
        ))
      }
    </div>
  );
});

export default History;
