import * as React from 'react';
import { Controll } from '../../utils';
import { rownames, colnames } from '../../utils/constants';
import { Grid } from '../../utils/SudokuCls';

interface IProps {
  choosedGrid: Grid | null;
  controllBar: Controll[];
}

const GridStatus: React.SFC<IProps> = ({ choosedGrid }) => {
  const { rowIdx, colIdx, showNum } = choosedGrid as Grid;
  return (
    <div className="game-status-container">
      <h5>选中元素：</h5>
      <p>位置：{ colnames[colIdx] + ' ' + rownames[rowIdx] }</p>
      <p>填入：{ showNum }</p>
    </div>
  );
};

export default GridStatus;
