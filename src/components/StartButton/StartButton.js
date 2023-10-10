import React from 'react';

const StartButton = ({ onClick }) => {
  return (
    <div className="start-button">
      <button onClick={onClick}>Start Game</button>
    </div>
  );
};

export default StartButton;
