import React from 'react';
import GameCanvas from './components/GameCanvas';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: 'black' }}>
      <GameCanvas />
    </div>
  );
}

export default App;
