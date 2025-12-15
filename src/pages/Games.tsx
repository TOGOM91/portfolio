import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, RotateCcw, Play } from 'lucide-react';
import snake from '../snake.jpg';
import memory from '../memory.jpg';
import flappy from '../flappy.jpg';
import sliding from '../slidding.jpg';
import tetris from '../tetris.jpg';
import bird from '../bird.png';


// =================== INTERFACES ===================
interface MemoryCard {
  id: string;
  logoName: string;
  logoUrl: string;
  flipped: boolean;
  matched: boolean;
}
interface PuzzleTile {
  id: number;
  empty?: boolean;
}
interface Tetromino {
  shape: number[][];
  color: string;
}

// =================== TETRIS GAME COMPONENT ===================
const TETROMINOES: { [key: string]: Tetromino } = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0f0',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0000f0',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#f0a000',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#f0f000',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00f000',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#a000f0',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#f00000',
  },
};

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const createEmptyBoard = (): number[][] =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0));

interface TetrisGameProps {
  onBack: () => void;
}

const TetrisGame: React.FC<TetrisGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const dropCounterRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const boardRef = useRef<number[][]>(createEmptyBoard());
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const currentPieceRef = useRef<Tetromino | null>(null);
  const piecePosRef = useRef({ x: 0, y: 0 });

  const dropInterval = 1000;

  // --- Fonctions utilitaires ---
  const collide = (board: number[][], shape: number[][], pos: { x: number; y: number }): boolean => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          if (
            !board[y + pos.y] ||
            board[y + pos.y][x + pos.x] !== 0 ||
            x + pos.x < 0 ||
            x + pos.x >= COLS ||
            y + pos.y >= ROWS
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const merge = (board: number[][], shape: number[][], pos: { x: number; y: number }): number[][] => {
    const newBoard = board.map((row) => row.slice());
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          newBoard[y + pos.y][x + pos.x] = 1;
        }
      }
    }
    return newBoard;
  };

  const sweepRows = (board: number[][]): { board: number[][]; lines: number } => {
    let lines = 0;
    const newBoard = board.reduce((acc, row) => {
      if (row.every((cell) => cell !== 0)) {
        lines++;
        acc.unshift(Array(COLS).fill(0));
      } else {
        acc.push(row);
      }
      return acc;
    }, [] as number[][]);
    return { board: newBoard, lines };
  };

  const rotateMatrix = (matrix: number[][]): number[][] => {
    const N = matrix.length;
    const result: number[][] = [];
    for (let x = 0; x < N; x++) {
      result[x] = [];
      for (let y = 0; y < N; y++) {
        result[x][y] = matrix[N - 1 - y][x];
      }
    }
    return result;
  };

  const randomTetromino = (): Tetromino => {
    const keys = Object.keys(TETROMINOES);
    const rand = keys[Math.floor(Math.random() * keys.length)];
    return TETROMINOES[rand];
  };

  const resetPiece = () => {
    currentPieceRef.current = randomTetromino();
    piecePosRef.current = {
      x: Math.floor(COLS / 2) - Math.floor(currentPieceRef.current.shape[0].length / 2),
      y: 0,
    };
    if (collide(boardRef.current, currentPieceRef.current.shape, piecePosRef.current)) {
      setGameOver(true);
      cancelAnimationFrame(requestRef.current);
    }
  };

  const initGame = () => {
    setScore(0);
    boardRef.current = createEmptyBoard();
    setGameOver(false);
    resetPiece();
  };

  const drop = () => {
    piecePosRef.current.y += 1;
    if (collide(boardRef.current, currentPieceRef.current!.shape, piecePosRef.current)) {
      piecePosRef.current.y -= 1;
      const newBoard = merge(boardRef.current, currentPieceRef.current!.shape, piecePosRef.current);
      const { board: sweptBoard, lines } = sweepRows(newBoard);
      boardRef.current = sweptBoard;
      setScore((prev) => prev + lines * 10);
      resetPiece();
    }
    dropCounterRef.current = 0;
  };

  const update = (time = 0) => {
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    dropCounterRef.current += deltaTime;
    if (dropCounterRef.current > dropInterval) {
      drop();
    }
    draw();
    if (!gameOver) requestRef.current = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

    boardRef.current.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          ctx.fillStyle = '#444';
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeStyle = '#222';
          ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      });
    });

    if (currentPieceRef.current) {
      const { shape, color } = currentPieceRef.current;
      const pos = piecePosRef.current;
      ctx.fillStyle = color;
      shape.forEach((row, yy) => {
        row.forEach((cell, xx) => {
          if (cell !== 0) {
            ctx.fillRect((xx + pos.x) * BLOCK_SIZE, (yy + pos.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeStyle = '#000';
            ctx.strokeRect((xx + pos.x) * BLOCK_SIZE, (yy + pos.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          }
        });
      });
    }
  };

  // -- Contrôle Tetris via boutons tactiles et clavier
  const handleTetrisControl = (action: string) => {
    if (gameOver || !currentPieceRef.current) return;
    const { x, y } = piecePosRef.current;
    switch (action) {
      case 'left':
        if (!collide(boardRef.current, currentPieceRef.current.shape, { x: x - 1, y })) {
          piecePosRef.current.x -= 1;
        }
        break;
      case 'right':
        if (!collide(boardRef.current, currentPieceRef.current.shape, { x: x + 1, y })) {
          piecePosRef.current.x += 1;
        }
        break;
      case 'down':
        drop();
        break;
      case 'rotate':
        const rotated = rotateMatrix(currentPieceRef.current.shape);
        if (!collide(boardRef.current, rotated, { x, y })) {
          currentPieceRef.current.shape = rotated;
        }
        break;
    }
  };

  useEffect(() => {
    const handleKeyDownTetris = (e: KeyboardEvent) => {
      if (!currentPieceRef.current || gameOver) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowLeft':
          handleTetrisControl('left');
          break;
        case 'ArrowRight':
          handleTetrisControl('right');
          break;
        case 'ArrowDown':
          handleTetrisControl('down');
          break;
        case 'ArrowUp':
          handleTetrisControl('rotate');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDownTetris, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDownTetris);
  }, [gameOver]);

  useEffect(() => {
    initGame();
    lastTimeRef.current = 0;
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="md:max-w-[300px] mx-auto"> {/* Conteneur fixe sur PC */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs hover:bg-gray-300"
          >
            Back
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center flex-grow">
            Tetris
          </h2>
          <div style={{ width: '60px' }}></div>
        </div>
        <div className="p-2">
          <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={COLS * BLOCK_SIZE}
              height={ROWS * BLOCK_SIZE}
              className="block mx-auto border border-gray-300 dark:border-gray-700 md:w-[300px] md:h-[600px] w-full h-auto"
            />
          </div>
          {gameOver && (
            <div className="mt-2 text-center text-gray-900 dark:text-white">
              <h2 className="text-xl font-bold">Game Over!</h2>
              <p className="text-base">Your score: {score}</p>
              <button
                onClick={() => {
                  initGame();
                  lastTimeRef.current = 0;
                  requestRef.current = requestAnimationFrame(update);
                }}
                className="mt-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
              >
                Restart Game
              </button>
            </div>
          )}
          <div className="flex justify-center space-x-2 mt-2">
            <button
              onClick={() => handleTetrisControl('left')}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 text-xs"
            >
              Left
            </button>
            <button
              onClick={() => handleTetrisControl('rotate')}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 text-xs"
            >
              Rotate
            </button>
            <button
              onClick={() => handleTetrisControl('right')}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 text-xs"
            >
              Right
            </button>
            <button
              onClick={() => handleTetrisControl('down')}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 text-xs"
            >
              Down
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// =================== FIN TETRIS GAME ===================


// =================== FLAPPY BIRD GAME ===================
interface FlappyProps {
  onBack: () => void;
}

const FlappyBirdGame: React.FC<FlappyProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const scoreRef = useRef<number>(0);

  // Dimensions réactives selon la taille d'écran
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 400, height: 600 });
  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth > 768) {
        setCanvasDimensions({ width: 250, height: 400 });
      } else {
        setCanvasDimensions({ width: 400, height: 600 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const gravity = 0.1;
  const jumpStrength = -3;
  const birdSize = 30;
  const birdX = 50;
  const birdY = useRef<number>(canvasDimensions.height / 2);
  const birdVelocity = useRef<number>(0);

  // Image de l'oiseau
  const birdImage = useRef<HTMLImageElement>(new Image());
  useEffect(() => {
    birdImage.current.src = bird;
  }, []);

  

  const pipeWidth = 50;
  const gapHeight = 120;
  const pipeSpeed = 1;
  const pipes = useRef<Array<{ x: number; gapY: number }>>([]);

  const initFlappy = () => {
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    birdY.current = canvasDimensions.height / 2;
    birdVelocity.current = 0;
    const minGapY = 50;
    const maxGapY = canvasDimensions.height - gapHeight - 150;
    pipes.current = [
      {
        x: canvasDimensions.width,
        gapY: Math.random() * (maxGapY - minGapY) + minGapY,
      },
    ];
  };

  const updateFlappy = (time = 0) => {
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Mise à jour de l'oiseau
    birdVelocity.current += gravity;
    birdY.current += birdVelocity.current;

    // Mise à jour des tuyaux
    pipes.current = pipes.current.map((pipe) => ({
      ...pipe,
      x: pipe.x - pipeSpeed,
    }));
    if (pipes.current.length && pipes.current[pipes.current.length - 1].x < canvasDimensions.width - 150) {
      const minGapY = 50;
      const maxGapY = canvasDimensions.height - gapHeight - 150;
      pipes.current.push({
        x: canvasDimensions.width,
        gapY: Math.random() * (maxGapY - minGapY) + minGapY,
      });
    }
    if (pipes.current.length && pipes.current[0].x + pipeWidth < 0) {
      pipes.current.shift();
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }

    // Collisions
    if (birdY.current + birdSize > canvasDimensions.height || birdY.current < 0) {
      setGameOver(true);
      cancelAnimationFrame(requestRef.current);
      return;
    }
    for (let pipe of pipes.current) {
      if (birdX + birdSize > pipe.x && birdX < pipe.x + pipeWidth) {
        if (birdY.current < pipe.gapY || birdY.current + birdSize > pipe.gapY + gapHeight) {
          setGameOver(true);
          cancelAnimationFrame(requestRef.current);
          return;
        }
      }
    }

    drawFlappy();
    if (!gameOver) {
      requestRef.current = requestAnimationFrame(updateFlappy);
    }
  };

  const drawFlappy = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);

    // Fond
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);

    // Oiseau
    if (birdImage.current.complete) {
      ctx.drawImage(birdImage.current, birdX, birdY.current, birdSize, birdSize);
    } else {
      ctx.fillStyle = '#ff0';
      ctx.fillRect(birdX, birdY.current, birdSize, birdSize);
    }

    // Dessin des tuyaux avec dégradé et contour
    for (let pipe of pipes.current) {
      const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
      gradient.addColorStop(0, '#2E8B57');
      gradient.addColorStop(1, '#3CB371');
      ctx.fillStyle = gradient;
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapY);
      ctx.fillRect(pipe.x, pipe.gapY + gapHeight, pipeWidth, canvasDimensions.height - (pipe.gapY + gapHeight));
      ctx.strokeStyle = '#1E6B47';
      ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.gapY);
      ctx.strokeRect(pipe.x, pipe.gapY + gapHeight, pipeWidth, canvasDimensions.height - (pipe.gapY + gapHeight));
    }

    // Score affiché via scoreRef
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${scoreRef.current}`, 10, 30);
  };

  const handleFlappyJump = () => {
    if (!gameOver) {
      birdVelocity.current = jumpStrength;
    }
  };

  // Démarrage du jeu au clic ou à la touche
  const startGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
      initFlappy();
      lastTimeRef.current = 0;
      requestRef.current = requestAnimationFrame(updateFlappy);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        if (!gameStarted) {
          startGame();
        } else {
          handleFlappyJump();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);

  const handleCanvasClick = () => {
    if (!gameStarted) {
      startGame();
    } else {
      handleFlappyJump();
    }
  };

  useEffect(() => {
    initFlappy();
    // eslint-disable-next-line
  }, [canvasDimensions]);

  const restartGame = () => {
    cancelAnimationFrame(requestRef.current);
    setGameStarted(false);
    setGameOver(false);
    initFlappy();
  };

  return (
    <div className="max-w-sm mx-auto"> {/* Conteneur réduit */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs hover:bg-gray-300"
          >
            Back
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center flex-grow">
            Flappy Bird
          </h2>
          <div style={{ width: '60px' }}></div>
        </div>
        <div className="p-2">
          <div className="relative bg-gray-900 p-2 rounded-lg cursor-pointer" onClick={handleCanvasClick}>
            <canvas
              ref={canvasRef}
              width={canvasDimensions.width}
              height={canvasDimensions.height}
              className="border border-gray-700 block mx-auto md:w-[250px] md:h-[400px] w-full h-auto"
            />
            {!gameStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <p className="text-white text-sm font-bold">Click or press Space to start</p>
              </div>
            )}
          </div>

          {gameOver && (
            <div className="mt-2 text-center text-gray-900 dark:text-white">
              <h2 className="text-xl font-bold">Game Over!</h2>
              <p className="text-base">Your score: {scoreRef.current}</p>
              <button
                onClick={restartGame}
                className="mt-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
              >
                Restart Game
              </button>
            </div>
          )}

          {!gameOver && gameStarted && (
            <div className="flex justify-center mt-2">
              <button
                onClick={handleFlappyJump}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 text-sm"
              >
                Jump
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// =================== FIN FLAPPY BIRD ===================


// =================== SNAKE GAME ===================
const Games: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const snakeScoreRef = useRef<number>(0);

  // ======== SNAKE GAME ========
  const canvasRefSnake = useRef<HTMLCanvasElement>(null);
  const requestRefSnake = useRef<number>();
  const snakeRef = useRef({
    x: 160,
    y: 160,
    dx: 20,
    dy: 0,
    cells: [] as { x: number; y: number }[],
    maxCells: 4,
  });
  const appleRef = useRef<{ x: number; y: number }>({ x: 300, y: 300 });
  const lastTimeRefSnake = useRef<number>(0);
  const [snakeHS, setSnakeHS] = useState(0);

  // Dimensions réactives pour le Snake
  const [snakeDimensions, setSnakeDimensions] = useState({ width: 400, height: 400 });
  useEffect(() => {
    const updateSnakeDimensions = () => {
      if (window.innerWidth > 768) {
        setSnakeDimensions({ width: 400, height: 400 });
      } else {
        setSnakeDimensions({ width: 400, height: 400 });
      }
    };
    updateSnakeDimensions();
    window.addEventListener('resize', updateSnakeDimensions);
    return () => window.removeEventListener('resize', updateSnakeDimensions);
  }, []);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('snakeHighScore');
    if (storedHighScore) {
      setSnakeHS(parseInt(storedHighScore, 10));
    }
  }, []);

  // -- Contrôle Snake via boutons tactiles
  const handleSnakeControl = (direction: string) => {
    if (gameOver) return;
    const snake = snakeRef.current;
    switch (direction) {
      case 'left':
        if (snake.dx === 0) {
          snake.dx = -20;
          snake.dy = 0;
        }
        break;
      case 'up':
        if (snake.dy === 0) {
          snake.dx = 0;
          snake.dy = -20;
        }
        break;
      case 'down':
        if (snake.dy === 0) {
          snake.dx = 0;
          snake.dy = 20;
        }
        break;
      case 'right':
        if (snake.dx === 0) {
          snake.dx = 20;
          snake.dy = 0;
        }
        break;
    }
  };

  const startSnakeGame = () => {
    if (!canvasRefSnake.current) return;
    setScore(0);
    snakeScoreRef.current = 0;
    setGameOver(false);
    snakeRef.current = {
      x: 160,
      y: 160,
      dx: 20,
      dy: 0,
      cells: [],
      maxCells: 4,
    };
    appleRef.current = getRandomApplePosition(snakeDimensions.width, snakeDimensions.height, 20);
    lastTimeRefSnake.current = 0;

    const gameLoop = (timestamp: number) => {
      if (!canvasRefSnake.current) return;
      if (gameOver) return;
      if (timestamp - lastTimeRefSnake.current >= 1000 / 15) {
        lastTimeRefSnake.current = timestamp;
        updateSnakeGame();
      }
      if (!gameOver) {
        requestRefSnake.current = requestAnimationFrame(gameLoop);
      }
    };
    requestRefSnake.current = requestAnimationFrame(gameLoop);
  };

  const getRandomApplePosition = (cw: number, ch: number, gridSize: number) => {
    const maxX = Math.floor(cw / gridSize) - 1;
    const maxY = Math.floor(ch / gridSize) - 1;
    return {
      x: Math.floor(Math.random() * maxX) * gridSize,
      y: Math.floor(Math.random() * maxY) * gridSize,
    };
  };

  const updateSnakeGame = () => {
    const canvas = canvasRefSnake.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const snake = snakeRef.current;
    const apple = appleRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Wrap around edges
    if (snake.x < 0) {
      snake.x = canvas.width - 20;
    } else if (snake.x >= canvas.width) {
      snake.x = 0;
    }
    if (snake.y < 0) {
      snake.y = canvas.height - 20;
    } else if (snake.y >= canvas.height) {
      snake.y = 0;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    // Draw apple
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(apple.x, apple.y, 20, 20);
    ctx.strokeStyle = '#c0392b';
    ctx.strokeRect(apple.x, apple.y, 20, 20);

    // Draw snake
    snake.cells.forEach((cell, index) => {
      if (index === 0) {
        ctx.fillStyle = '#2ecc71';
        ctx.strokeStyle = '#27ae60';
      } else {
        ctx.fillStyle = '#3498db';
        ctx.strokeStyle = '#2980b9';
      }
      ctx.fillRect(cell.x, cell.y, 20, 20);
      ctx.strokeRect(cell.x, cell.y, 20, 20);
    });

    // Eat apple
    if (snake.x === apple.x && snake.y === apple.y) {
      snake.maxCells++;
      snakeScoreRef.current += 10;
      setScore(snakeScoreRef.current);
      appleRef.current = getRandomApplePosition(canvas.width, canvas.height, 20);
    }

    // Self collision + high score update
    for (let i = 1; i < snake.cells.length; i++) {
      if (snake.x === snake.cells[i].x && snake.y === snake.cells[i].y) {
        const newHighScore = Math.max(snakeHS, snakeScoreRef.current);
        setSnakeHS(newHighScore);
        localStorage.setItem('snakeHighScore', newHighScore.toString());
        setGameOver(true);
        return;
      }
    }
  };

  const resetSnakeGame = () => {
    startSnakeGame();
  };

  useEffect(() => {
    if (activeGame === 'snake') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOver) return;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
        }
        switch (e.key) {
          case 'ArrowLeft':
            handleSnakeControl('left');
            break;
          case 'ArrowUp':
            handleSnakeControl('up');
            break;
          case 'ArrowRight':
            handleSnakeControl('right');
            break;
          case 'ArrowDown':
            handleSnakeControl('down');
            break;
        }
      };
      window.addEventListener('keydown', handleKeyDown, { passive: false });
      startSnakeGame();
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        cancelAnimationFrame(requestRefSnake.current!);
      };
    }
    // eslint-disable-next-line
  }, [activeGame, gameOver]);

  // ======== MEMORY GAME ========
  const [memoryDeck, setMemoryDeck] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [pairsFound, setPairsFound] = useState<number>(0);
  const [memoryAttempts, setMemoryAttempts] = useState<number>(5);

  const baseLogos = [
    {
      logoName: 'JS',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg',
    },
    {
      logoName: 'HTML',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg',
    },
    {
      logoName: 'CSS',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg',
    },
    {
      logoName: 'PHP',
      logoUrl: 'https://www.php.net/images/logos/php-logo.svg',
    },
  ];

  const createMemoryDeck = (): MemoryCard[] => {
    let deck: MemoryCard[] = [];
    baseLogos.forEach((logo) => {
      deck.push({
        id: crypto.randomUUID(),
        logoName: logo.logoName,
        logoUrl: logo.logoUrl,
        flipped: false,
        matched: false,
      });
      deck.push({
        id: crypto.randomUUID(),
        logoName: logo.logoName,
        logoUrl: logo.logoUrl,
        flipped: false,
        matched: false,
      });
    });
    deck.sort(() => Math.random() - 0.5);
    return deck;
  };

  const handleMemoryCardClick = (index: number) => {
    if (gameOver || memoryAttempts <= 0) return;
    if (memoryDeck[index].flipped || memoryDeck[index].matched) return;
    const updatedDeck = [...memoryDeck];
    updatedDeck[index].flipped = true;
    setMemoryDeck(updatedDeck);
    if (flippedCards.length === 0) {
      setFlippedCards([index]);
    } else if (flippedCards.length === 1) {
      const firstIndex = flippedCards[0];
      const firstCard = updatedDeck[firstIndex];
      const secondCard = updatedDeck[index];
      if (firstCard.logoName === secondCard.logoName) {
        updatedDeck[firstIndex].matched = true;
        updatedDeck[index].matched = true;
        setMemoryDeck(updatedDeck);
        setPairsFound((p) => p + 1);
      } else {
        setMemoryAttempts((prev) => prev - 1);
        setTimeout(() => {
          const revertDeck = [...updatedDeck];
          revertDeck[firstIndex].flipped = false;
          revertDeck[index].flipped = false;
          setMemoryDeck(revertDeck);
        }, 1000);
      }
      setFlippedCards([]);
    }
  };

  const startMemoryGame = () => {
    setScore(0);
    setGameOver(false);
    setPairsFound(0);
    setMemoryAttempts(5);
    const newDeck = createMemoryDeck();
    setMemoryDeck(newDeck);
  };

  useEffect(() => {
    if (activeGame === 'memory') {
      startMemoryGame();
    }
    // eslint-disable-next-line
  }, [activeGame]);

  useEffect(() => {
    if (pairsFound === 4) {
      setGameOver(true);
    }
  }, [pairsFound]);

  useEffect(() => {
    if (memoryAttempts <= 0 && pairsFound < 4) {
      setGameOver(true);
    }
  }, [memoryAttempts, pairsFound]);

  // ======== SLIDING PUZZLE ========
  const [puzzle, setPuzzle] = useState<PuzzleTile[]>([]);
  const [moves, setMoves] = useState(0);

  const createPuzzle = (): PuzzleTile[] => {
    const arr: PuzzleTile[] = [];
    for (let i = 1; i <= 8; i++) {
      arr.push({ id: i });
    }
    arr.push({ id: 0, empty: true });
    arr.sort(() => Math.random() - 0.5);
    return arr;
  };

  const startPuzzle = () => {
    setMoves(0);
    setGameOver(false);
    const newPuzzle = createPuzzle();
    setPuzzle(newPuzzle);
  };

  useEffect(() => {
    if (activeGame === 'puzzle') {
      startPuzzle();
    }
    // eslint-disable-next-line
  }, [activeGame]);

  const puzzleIndexToCoords = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return { row, col };
  };

  const coordsToPuzzleIndex = (row: number, col: number) => {
    return row * 3 + col;
  };

  const handlePuzzleClick = (index: number) => {
    if (gameOver) return;
    const emptyIndex = puzzle.findIndex((tile) => tile.empty);
    if (emptyIndex < 0) return;
    const { row: emptyRow, col: emptyCol } = puzzleIndexToCoords(emptyIndex);
    const { row, col } = puzzleIndexToCoords(index);
    const isAdjacent =
      (Math.abs(emptyRow - row) === 1 && emptyCol === col) ||
      (Math.abs(emptyCol - col) === 1 && emptyRow === row);
    if (isAdjacent) {
      const updatedPuzzle = [...puzzle];
      [updatedPuzzle[emptyIndex], updatedPuzzle[index]] = [
        updatedPuzzle[index],
        updatedPuzzle[emptyIndex],
      ];
      setPuzzle(updatedPuzzle);
      setMoves((m) => m + 1);
      checkPuzzleWin(updatedPuzzle);
    }
  };

  const checkPuzzleWin = (currentPuzzle: PuzzleTile[]) => {
    for (let i = 0; i < currentPuzzle.length - 1; i++) {
      if (currentPuzzle[i].id !== i + 1) return;
    }
    setGameOver(true);
  };

  const resetPuzzle = () => {
    startPuzzle();
  };

  // ======== LISTE DES JEUX AVEC =======
  const games = [
    {
      id: 'snake',
      title: 'Snake Game',
      description: 'Classic Snake game. Use arrow keys or on-screen buttons to eat apples!',
      image: snake,
    },
    {
      id: 'memory',
      title: 'Memory Game',
      description: 'Flip the cards, match the pairs, and put your memory to the test!',
      image: memory,
    },
    {
      id: 'puzzle',
      title: 'Sliding Puzzle',
      description: 'Slide the tiles to arrange them in the correct order. Complete the puzzle to win!',
      image: sliding
    },
    {
      id: 'tetris',
      title: 'Tetris',
      description: 'Classic Tetris. Rotate & drop tetrominoes to clear lines and score points!',
      image: tetris
    },
    {
      id: 'flappyBird',
      title: 'Flappy Bird',
      description: 'Tap or press space/up arrow to keep the bird in the air and avoid pipes!',
      image: flappy
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Title & Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Interactive <span className="text-purple-600 dark:text-purple-400">Games</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Test your skills with these JavaScript-powered games. Have fun and try to beat the high scores!
          </p>
        </motion.div>

        {/* MAIN MENU */}
        {!activeGame && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {games.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ y: -10 }}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
                }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{game.title}</h3>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {game.description}
                  </p>
                  <button
                    onClick={() => setActiveGame(game.id)}
                    className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-300 flex items-center justify-center text-sm"
                  >
                    <Play size={18} className="mr-2" /> Play Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* FLAPPY BIRD */}
        {activeGame === 'flappyBird' && (
          <FlappyBirdGame onBack={() => setActiveGame(null)} />
        )}

        {/* SNAKE GAME UI */}
        {activeGame === 'snake' && (
          <motion.div
            className="md:max-w-[400px] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <Gamepad2 className="mr-2 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Snake Game</h3>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Trophy className="mr-1 text-yellow-500" size={18} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      High Score: {snakeHS}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveGame(null)}
                    className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-300 transition-colors duration-300"
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="p-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    Score: {score}
                  </div>
                  {gameOver && (
                    <button
                      onClick={resetSnakeGame}
                      className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white flex items-center transition-colors duration-300 text-sm"
                    >
                      <RotateCcw size={16} className="mr-2" /> Restart
                    </button>
                  )}
                </div>

                <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRefSnake}
                    width={snakeDimensions.width}
                    height={snakeDimensions.height}
                    className="block mx-auto border border-gray-300 dark:border-gray-700 md:w-[400px] md:h-[400px] w-full h-auto"
                  />
                  {gameOver && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                      <h3 className="text-2xl font-bold text-white mb-2">Game Over!</h3>
                      <p className="text-gray-300 mb-4">Your score: {score}</p>
                      <button
                        onClick={resetSnakeGame}
                        className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center transition-colors duration-300"
                      >
                        <RotateCcw size={16} className="mr-2" /> Play Again
                      </button>
                    </div>
                  )}
                </div>

                {!gameOver && (
                  <div className="flex justify-center space-x-2 mt-2">
                    <button
                      onClick={() => handleSnakeControl('left')}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 text-sm"
                    >
                      Left
                    </button>
                    <button
                      onClick={() => handleSnakeControl('up')}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 text-sm"
                    >
                      Up
                    </button>
                    <button
                      onClick={() => handleSnakeControl('down')}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 text-sm"
                    >
                      Down
                    </button>
                    <button
                      onClick={() => handleSnakeControl('right')}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 text-sm"
                    >
                      Right
                    </button>
                  </div>
                )}

                <div className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                  <p className="font-medium mb-1">How to play:</p>
                  <ul className="list-disc list-inside">
                    <li>Use arrow keys or on-screen buttons</li>
                    <li>Eat the red apples to grow</li>
                    <li>Avoid colliding with yourself</li>
                    <li>Game runs at 15 FPS for a retro feel</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MEMORY GAME UI */}
        {activeGame === 'memory' && (
          <motion.div
            className="max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <Gamepad2 className="mr-2 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Memory Game
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveGame(null)}
                    className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-300 transition-colors duration-300"
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="p-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Match all 4 pairs!
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Attempts: {memoryAttempts}
                  </p>
                </div>
                {gameOver && (
                  <div className="mb-2 text-green-600 dark:text-green-400">
                    {pairsFound === 4 ? 'You found all pairs!' : 'Out of attempts!'}
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2 justify-items-center">
                  {memoryDeck.map((card, index) => {
                    const isFlipped = card.flipped || card.matched;
                    return (
                      <motion.div
                        key={card.id}
                        onClick={() => handleMemoryCardClick(index)}
                        whileTap={{ scale: 1.1 }}
                        variants={{
                          initial: { rotateY: 0 },
                          flipped: {
                            rotateY: 180,
                            transition: { duration: 0.4, ease: 'easeInOut' },
                          },
                        }}
                        initial="initial"
                        animate={isFlipped ? 'flipped' : 'initial'}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 cursor-pointer perspective [transform-style:preserve-3d] ${card.matched ? 'cursor-default' : ''}`}
                      >
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center rounded shadow bg-gray-200 dark:bg-gray-700 backface-hidden"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <span className="text-gray-400 dark:text-gray-500 text-xl">?</span>
                        </motion.div>
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center rounded shadow bg-gray-200 dark:bg-gray-700 [transform:rotateY(180deg)] backface-hidden"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <img src={card.logoUrl} alt={card.logoName} className="w-10 h-10 object-contain" />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {gameOver && (
                  <button
                    onClick={startMemoryGame}
                    className="mt-2 px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300 text-sm"
                  >
                    Restart
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SLIDING PUZZLE UI */}
        {activeGame === 'puzzle' && (
          <motion.div
            className="max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <Gamepad2 className="mr-2 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Sliding Puzzle
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveGame(null)}
                    className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-300 transition-colors duration-300"
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="p-2">
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Arrange the tiles in order!
                </p>
                {gameOver && (
                  <div className="mb-2 text-green-600 dark:text-green-400">
                    Puzzle Completed!
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 w-64 mx-auto">
                  {puzzle.map((tile, index) => (
                    <div
                      key={index}
                      onClick={() => !tile.empty && !gameOver && handlePuzzleClick(index)}
                      className={`h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-xl font-bold text-gray-900 dark:text-white rounded cursor-pointer transition-all duration-200 ${
                        tile.empty ? 'bg-gray-100 dark:bg-gray-800 cursor-default' : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {!tile.empty && tile.id}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between items-center text-gray-700 dark:text-gray-300">
                  <p>Moves: {moves}</p>
                  {gameOver && (
                    <button
                      onClick={resetPuzzle}
                      className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white flex items-center transition-colors duration-300 text-sm"
                    >
                      <RotateCcw size={16} className="mr-2" /> Restart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TETRIS GAME */}
        {activeGame === 'tetris' && (
          <TetrisGame onBack={() => setActiveGame(null)} />
        )}
      </div>
    </div>
  );
};

export default Games;
