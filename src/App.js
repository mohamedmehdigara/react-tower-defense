import React from 'react';
import GameBoard from './components/GameBoard';
import Enemy from './components/Enemy';
import Tower from './components/Tower';

const App = () => {
  return (
    <div className="App">
      <GameBoard />
      <Enemy
        position={0}
        path={[0, 1, 2, 3, 4]} // Replace with your actual path array
        speed={5}
        health={100}
        damage={10}
        onEnemyReachedEnd={() => console.log('Enemy reached the end!')}
        onEnemyDestroyed={() => console.log('Enemy destroyed!')}
      />
      <Tower
        position={0}
        onClick={(position) => console.log('Tower clicked at position:', position)}
        type="Cannon"
        damage={50}
        range={10}
        isUpgradable={true}
        onUpgrade={(position) => console.log('Upgrade tower at position:', position)}
      />
    </div>
  );
};

export default App;
