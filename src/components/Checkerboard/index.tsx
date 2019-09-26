import * as React from 'react';
import './index.css';
import classnames from 'classnames';
import { rownames, colnames } from '../../utils/constants';
import SudokuCls, { Grid } from '../../utils/SudokuCls';
import { observer } from 'mobx-react';

interface IProps {
  sudoku: SudokuCls;
  gridClick: (grid: Grid) => void;
}

const Checkerboard: React.SFC<IProps> = observer(({ sudoku, gridClick }) => {

  return (
    <div className="checkerboard">
      <div className="coordinate-row">
        {
          colnames.map(key => (
            <span key={key} className="coordinate-block">{ key }</span>
          ))
        }
      </div>
      {
        sudoku.grids.map((row, rowIdx) => {
          const cls = classnames({
            'checkerboard-row': true,
            'last-row': rowIdx === sudoku.grids.length - 1,
            'multiple-of-three': rowIdx % 3 === 2,
          })
          return (
            <div key={rowIdx} className={cls}>
              {
                row.map((grid, colIdx) => {
                  const gridCls = classnames({
                    'checkerboard-block': true,
                    'is-choosed': grid.status.isChoosed,
                    'is-inited': grid.status.isInit,
                  });
                  return (
                    <span 
                      key={colIdx} 
                      className={gridCls}
                      onClick={() => gridClick(grid)}
                    >
                      { grid.showNum }
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
          rownames.map(key => (
            <span key={key} className="coordinate-block">{ key }</span>
          ))
        }
      </div>
    </div>
  );
});

export default Checkerboard;
