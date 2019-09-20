import * as React from 'react';
import { Controll } from '../../state';
import './index.css';
import classnames from 'classnames';

interface IProps {
  controllBar: Controll[];
  barClick: (col: Controll) => void;
}

const ControllBar: React.SFC<IProps> = ({ controllBar, barClick }) => {
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
              key={col.num} 
              className={cls}
              onClick={() => barClick(col)}
            >{ col.num }</span>
          )
        })
      }
    </div>
  );
};

export default ControllBar;
