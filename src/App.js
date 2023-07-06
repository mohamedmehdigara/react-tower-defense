import React from 'react';
import GameBoard from './components/GameBoard';
import Enemy from './components/Enemy';
import Tower from './components/Tower';

const App = () => {
  return (
    <div className="App">
      <GameBoard />
      <Enemy/>
      <Tower/>
    </div>
  );
};

export default App;
