import * as React from 'react';
import './index.css';
import { Block, rowKeys, colKeys } from '../../state';
import classnames from 'classnames';

interface IProps {
  checkerboardData: Block[][];
  blockClick: (block: Block) => void;
}

const Checkerboard: React.SFC<IProps> = ({ checkerboardData, blockClick }) => {

  return (
    <div className="checkerboard">
      <div className="coordinate-row">
        {
          colKeys.split('').map(key => (
            <span key={key} className="coordinate-block">{ key }</span>
          ))
        }
      </div>
      {
        checkerboardData.map((row, rowIdx) => {
          const cls = classnames({
            'checkerboard-row': true,
            'last-row': rowIdx === checkerboardData.length - 1,
            'multiple-of-three': rowIdx % 2 === 0,
          })
          return (
            <div key={rowIdx} className={cls}>
              {
                row.map((col, colIdx) => {
                  const blockCls = classnames({
                    'checkerboard-block': true,
                    'is-choosed': col.isChoosed,
                  });
                  return (
                    <span 
                      key={colIdx} 
                      className={blockCls}
                      onClick={() => blockClick(col)}
                    >
                      { col.num }
                    </span>
                  )
                })
              }
            </div>
          )
        })
      }
      <div className="coordinate-col">
        {
          rowKeys.split('').map(key => (
            <span key={key} className="coordinate-block">{ key }</span>
          ))
        }
      </div>
    </div>
  );
};

export default Checkerboard;
