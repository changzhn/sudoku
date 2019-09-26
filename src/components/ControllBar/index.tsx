import * as React from 'react';
import { Controll } from '../../utils';
import './index.css';
import classnames from 'classnames';
import { Grid } from '../../utils/SudokuCls';

interface IProps {
  controllBar: Controll[];
  choosedGrid: Grid | null;
  barClick: (col: Controll) => void;
}

const ControllBar: React.SFC<IProps> = ({ controllBar, barClick, choosedGrid }) => {
  const clearCls = classnames({
    'controll-item': true,
    'clear': choosedGrid && choosedGrid.num,
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
      >del</span>
    </div>
  );
};

export default ControllBar;
