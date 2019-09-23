import * as React from 'react';
import { IBlock } from '../../utils/interface';
import { Controll } from '../../utils';
import { rownames, colnames } from '../../utils/constants';

interface IProps {
  choosedBlock: IBlock | null;
  controllBar: Controll[];
}

const BlockStatus: React.SFC<IProps> = ({ choosedBlock }) => {
  const { rowKey, colKey, num } = choosedBlock as IBlock;
  return (
    <div className="game-status-container">
      <h5>选中元素：</h5>
      <p>位置：{ colnames[colKey] + ' ' + rownames[rowKey] }</p>
      <p>填入：{ num }</p>
    </div>
  );
};

export default BlockStatus;
