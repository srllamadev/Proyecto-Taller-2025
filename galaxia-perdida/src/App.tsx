import GameScene from './components/GameScene/GameScene'
import GameHUD from './components/UI/GameHUD'
import AudioManager from './components/Effects/AudioManager'
import { useGameStore } from './hooks/useGameStore'
import { GAME_STATES } from './utils/constants'
import './App.css'

function App() {
  const { gameState, setGameState, score, player } = useGameStore()

  const startGame = () => {
    setGameState(GAME_STATES.PLAYING)
  }

  const showMenu = gameState === GAME_STATES.MENU

  return (
    <>
      <AudioManager />
      {showMenu ? (
        <div className="menu-container">
          <h1 className="game-title">
            GALAXIA PERDIDA
          </h1>
          <p className="game-subtitle">
            Esquiva asteroides, destruye enemigos y sobrevive en el espacio profundo
          </p>
          <button 
            onClick={startGame}
            className="start-button"
          >
            INICIAR MISIÓN
          </button>
          <div className="controls-info">
            <p>Controles:</p>
            <p>WASD - Mover nave | ESPACIO - Disparar | P - Pausa</p>
          </div>
        </div>
      ) : (
        <>
          <GameScene />
          <GameHUD />
        </>
      )}
    </>
  )
}

export default App
