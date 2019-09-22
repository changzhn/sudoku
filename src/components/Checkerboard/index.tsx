import * as React from 'react';
import './index.css';
import classnames from 'classnames';
import { IBlock } from '../../interface';

const rownames = '123456789';
const colnames = 'ABCDEFGHI';

interface IProps {
  checkerboardData: IBlock[][];
  blockClick: (block: IBlock) => void;
}

const Checkerboard: React.SFC<IProps> = ({ checkerboardData, blockClick }) => {

  return (
    <div className="checkerboard">
      <div className="coordinate-row">
        {
          colnames.split('').map(key => (
            <span key={key} className="coordinate-block">{ key }</span>
          ))
        }
      </div>
      {
        checkerboardData.map((row, rowIdx) => {
          const cls = classnames({
            'checkerboard-row': true,
            'last-row': rowIdx === checkerboardData.length - 1,
            'multiple-of-three': rowIdx % 3 === 2,
          })
          return (
            <div key={rowIdx} className={cls}>
              {
                row.map((col, colIdx) => {
                  const blockCls = classnames({
                    'checkerboard-block': true,
                    'is-choosed': col.isChoosed,
                    'is-inited': col.isInitBlock,
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
          rownames.split('').map(key => (
            <span key={key} className="coordinate-block">{ key }</span>
          ))
        }
      </div>
    </div>
  );
};

export default Checkerboard;
