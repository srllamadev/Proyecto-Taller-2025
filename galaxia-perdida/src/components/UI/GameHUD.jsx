import { useEffect } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { GAME_STATES } from '../../utils/constants';

function GameHUD() {
  const { 
    score, 
    player, 
    level, 
    gameState, 
    setGameState,
    resetGame,
    enemies,
    asteroids
  } = useGameStore();

  // Verificar game over
  useEffect(() => {
    if (player.health <= 0 && gameState === GAME_STATES.PLAYING) {
      setGameState(GAME_STATES.GAME_OVER);
    }
  }, [player.health, gameState, setGameState]);

  const restartGame = () => {
    resetGame();
  };

  if (gameState === GAME_STATES.GAME_OVER) {
    return (
      <div className="game-over-screen">
        <div className="game-over-content">
          <h1>MISIÓN FALLIDA</h1>
          <div className="final-stats">
            <p>Puntuación Final: <span className="score">{score}</span></p>
            <p>Nivel Alcanzado: <span className="level">{level}</span></p>
            <p>Enemigos Destruidos: <span className="enemies">{Math.floor(score / 50)}</span></p>
          </div>
          <button onClick={restartGame} className="restart-button">
            NUEVA MISIÓN
          </button>
        </div>
      </div>
    );
  }

  if (gameState !== GAME_STATES.PLAYING) {
    return null;
  }

  return (
    <>
      {/* HUD principal */}
      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">PUNTUACIÓN</span>
          <span className="hud-value">{score.toLocaleString()}</span>
        </div>
        
        <div className="hud-item">
          <span className="hud-label">NIVEL</span>
          <span className="hud-value">{level}</span>
        </div>
        
        {/* Barra de vida */}
        <div className="hud-item health-bar-container">
          <span className="hud-label">VIDA</span>
          <div className="health-bar">
            <div 
              className="health-fill"
              style={{ 
                width: `${player.health}%`,
                backgroundColor: player.health > 50 ? '#00ff00' : 
                               player.health > 25 ? '#ffff00' : '#ff0000'
              }}
            ></div>
          </div>
          <span className="hud-value">{player.health}/100</span>
        </div>
      </div>

      {/* Power-ups activos */}
      <div className="powerups-display">
        {player.powerUps.shield && (
          <div className="powerup-indicator shield">
            🛡️ ESCUDO ACTIVO
          </div>
        )}
        {player.powerUps.rapidFire && (
          <div className="powerup-indicator rapid-fire">
            ⚡ DISPARO RÁPIDO
          </div>
        )}
        {player.powerUps.doubleShot && (
          <div className="powerup-indicator double-shot">
            ⚡⚡ DOBLE DISPARO
          </div>
        )}
      </div>

      {/* Indicadores de estado */}
      <div className="status-indicators">
        <div className="status-item">
          <span>Enemigos: {enemies.length}</span>
        </div>
        <div className="status-item">
          <span>Asteroides: {asteroids.length}</span>
        </div>
      </div>

      {/* Indicador de vida baja */}
      {player.health <= 25 && (
        <div className="low-health-warning">
          ⚠️ VIDA CRÍTICA ⚠️
        </div>
      )}
    </>
  );
}

export default GameHUD;