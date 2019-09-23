import * as React from 'react';
import { Controll } from '../../utils';
import './index.css';
import classnames from 'classnames';
import { IBlock } from '../../utils/interface';

interface IProps {
  controllBar: Controll[];
  choosedBlock: IBlock | null;
  barClick: (col: Controll) => void;
}

const ControllBar: React.SFC<IProps> = ({ controllBar, barClick, choosedBlock }) => {
  const clearCls = classnames({
    'controll-item': true,
    'clear': choosedBlock && choosedBlock.num,
  });
  return (
    <div className="controll-bar">
      {
        controllBar.map(col => {
          const cls = classnames({
            'controll-item': true,
            'active': col.status,
            'forbidden': !col.status,
          })
          return (
            <span 
              key={col.num as number} 
              className={cls}
              onClick={() => barClick(col)}
            >{ col.num }</span>
          )
        })
      }
      <span 
        className={clearCls}
        onClick={() => barClick({ status: true, num: null })}
      >X</span>
    </div>
  );
};

export default ControllBar;
