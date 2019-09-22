import * as React from 'react';
import './index.css';
import avatar from '../../assets/avatar.jpeg';

interface IProps {
  start: () => void;
}

const GameStatus: React.SFC<IProps> = ({ start }) => {
  return (
    <div className="game-status-container">
      <div className="game-user">
        <img className="avatar" src={avatar} />
        <span>changzhenan</span>
      </div>
      <button className="btn btn-primary btn-sm" onClick={start}>开始</button> &nbsp;
      <button className="btn btn-warning btn-sm" onClick={start}>暂停</button>
    </div>
  );
};

export default GameStatus;
