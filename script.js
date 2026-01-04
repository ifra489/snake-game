/* ---------------- SELECT ELEMENTS ---------------- */
const board = document.querySelector(".board");
const modal = document.querySelector(".modal");
const startgamemodal = document.querySelector(".start-game");
const gameovermodal = document.querySelector(".game-over");
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");
const pauseButton = document.querySelector(".btn-pause");
const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const timeElement = document.querySelector("#time");
const mobileButtons = document.querySelectorAll(".mobile-controls button");

/* ---------------- GAME SETTINGS ---------------- */
const DESKTOP_CELL = 50;
const MOBILE_CELL = 28;

let score = 0;
let highScore = Number(localStorage.getItem("highScore") || 0);
let time = "00:00";
let speed = 300; // ms
const speedIncrement = 10;

let intervalId = null;
let timeIntervalId = null;
let paused = false;

highScoreElement.innerText = highScore;

const blocks = {};

let cols = 0;
let rows = 0;

/* ---------------- BOARD BUILDER ---------------- */
function buildBoard() {
  const isMobile = window.innerWidth <= 768;
  const desiredCell = isMobile ? MOBILE_CELL : DESKTOP_CELL;

  // clear existing
  board.innerHTML = "";
  for (const k in blocks) delete blocks[k];

  if (isMobile) {
    cols = Math.max(6, Math.floor(board.clientWidth / desiredCell));
    rows = cols;
    board.style.width = "";
    board.style.height = "";
  } else {
    // Desktop: let CSS make the board fill the available area (full-screen-like).
    // Compute cols/rows from the actual board size so cells remain a sensible size.
    board.style.width = "";
    board.style.height = "";
    cols = Math.max(6, Math.floor(board.clientWidth / desiredCell));
    rows = Math.max(6, Math.floor(board.clientHeight / desiredCell));
  }

  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = document.createElement("div");
      block.classList.add("block");
      block.dataset.row = row;
      block.dataset.col = col;
      board.appendChild(block);
      blocks[`${row}-${col}`] = block;
    }
  }
}

/* ---------------- SNAKE & FOOD ---------------- */
let snake = [ { x: 1, y: 2 }, { x: 1, y: 1 } ];
let direction = "right";
let food = null;

/* ---------------- SOUND EFFECTS (optional) ---------------- */
let eatSound = null;
let gameOverSound = null;
try { eatSound = new Audio("eat.mp3"); } catch (e) {}
try { gameOverSound = new Audio("gameover.mp3"); } catch (e) {}

/* ---------------- FOOD GENERATION ---------------- */
function generateFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
  } while (snake.some((seg) => seg.x === pos.x && seg.y === pos.y));
  return pos;
}

/* ---------------- RENDER GAME ---------------- */
function render() {
  if (paused) return;

  // Clear previous snake and food safely
  snake.forEach((seg) => {
    const b = blocks[`${seg.x}-${seg.y}`];
    if (b) b.classList.remove("fill", "head");
  });
  if (food) {
    const fb = blocks[`${food.x}-${food.y}`];
    if (fb) fb.classList.remove("food");
  }

  // Move head
  let head = { ...snake[0] };
  if (direction === "up") head.x--;
  if (direction === "down") head.x++;
  if (direction === "left") head.y--;
  if (direction === "right") head.y++;

  // Check collisions (walls and self)
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) return gameOver();
  if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) return gameOver();

  snake.unshift(head);

  // Check food
  if (food && head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.innerText = score;
    if (eatSound) { eatSound.currentTime = 0; eatSound.play().catch(() => {}); }
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreElement.innerText = highScore;
    }
    food = generateFood();
    speed = Math.max(50, speed - speedIncrement);
    restartInterval();
  } else {
    snake.pop();
  }

  // Draw snake
  snake.forEach((seg, index) => {
    const b = blocks[`${seg.x}-${seg.y}`];
    if (!b) return;
    if (index === 0) b.classList.add("head");
    else b.classList.add("fill");
  });

  // Draw food
  if (food) {
    const fb = blocks[`${food.x}-${food.y}`];
    if (fb) fb.classList.add("food");
  }
}

/* ---------------- GAME OVER ---------------- */
function gameOver() {
  clearInterval(intervalId);
  clearInterval(timeIntervalId);
  if (gameOverSound) { gameOverSound.currentTime = 0; gameOverSound.play().catch(() => {}); }
  modal.style.display = "flex";
  startgamemodal.style.display = "none";
  gameovermodal.style.display = "flex";
}

/* ---------------- INTERVAL HANDLING ---------------- */
function restartInterval() {
  clearInterval(intervalId);
  intervalId = setInterval(render, speed);
}

/* ---------------- TIMER ---------------- */
function startTimer() {
  clearInterval(timeIntervalId);
  time = "00:00";
  timeElement.innerText = time;
  timeIntervalId = setInterval(() => {
    if (paused) return;
    let [m, s] = time.split(":").map(Number);
    s++;
    if (s === 60) { m++; s = 0; }
    time = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    timeElement.innerText = time;
  }, 1000);
}

/* ---------------- START / RESTART / PAUSE ---------------- */
startButton.addEventListener("click", () => {
  modal.style.display = "none";
  gameovermodal.style.display = "none";
  paused = false;
  score = 0; scoreElement.innerText = score;
  speed = 300;
  // initialize board and game state
  buildBoard();
  snake = [ { x: 1, y: 2 }, { x: 1, y: 1 } ];
  direction = "right";
  food = generateFood();
  restartInterval();
  startTimer();
});

restartButton.addEventListener("click", () => {
  clearInterval(intervalId);
  clearInterval(timeIntervalId);
  // clear visuals
  snake.forEach((seg) => {
    const b = blocks[`${seg.x}-${seg.y}`]; if (b) b.classList.remove("fill", "head");
  });
  if (food) { const fb = blocks[`${food.x}-${food.y}`]; if (fb) fb.classList.remove("food"); }
  // Reset game variables
  score = 0; scoreElement.innerText = score;
  speed = 300; direction = "down"; paused = false;
  snake = [ { x: 1, y: 3 }, { x: 1, y: 2 } ];
  food = generateFood();
  modal.style.display = "none";
  restartInterval();
  startTimer();
});

pauseButton.addEventListener("click", () => {
  paused = !paused;
  pauseButton.innerText = paused ? "Resume" : "Pause";
});

/* ---------------- CONTROLS ---------------- */
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

mobileButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const dir = btn.getAttribute("data-dir");
    if (dir === "up" && direction !== "down") direction = "up";
    if (dir === "down" && direction !== "up") direction = "down";
    if (dir === "left" && direction !== "right") direction = "left";
    if (dir === "right" && direction !== "left") direction = "right";
  });
});

/* ---------------- RESIZE HANDLING ---------------- */
let resizeTimeout = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    clearInterval(intervalId);
    clearInterval(timeIntervalId);
    buildBoard();
    snake = [ { x: 1, y: 2 }, { x: 1, y: 1 } ];
    direction = "right";
    food = generateFood();
    score = 0; scoreElement.innerText = score;
    modal.style.display = "flex";
    startgamemodal.style.display = "flex";
    gameovermodal.style.display = "none";
  }, 250);
});

/* ---------------- INITIALIZE ---------------- */
buildBoard();
food = generateFood();

/* ---------------- MOBILE SWIPE CONTROLS (mobile-only) ---------------- */
(function installSwipeControls() {
  // Only enable swipe controls on devices narrower than 1381px
  if (window.innerWidth >= 1381) return;

  let startX = null;
  let startY = null;
  const MIN_SWIPE = 30; // px

  function onTouchStart(e) {
    if (!e.touches || e.touches.length > 1) return; // ignore multi-touch
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  }

  function onTouchMove(e) {
    // Prevent page scrolling while interacting with the board
    if (startX === null || startY === null) return;
    // We must call preventDefault to stop the browser from scrolling
    if (e.cancelable) e.preventDefault();
  }

  function onTouchEnd(e) {
    if (startX === null || startY === null) return;
    const t = (e.changedTouches && e.changedTouches[0]) || null;
    if (!t) { startX = startY = null; return; }
    const endX = t.clientX;
    const endY = t.clientY;
    const dx = endX - startX;
    const dy = endY - startY;

    // reset start coords
    startX = startY = null;

    // Ignore small moves
    if (Math.abs(dx) < MIN_SWIPE && Math.abs(dy) < MIN_SWIPE) return;

    // Decide direction by dominant axis to avoid diagonals
    if (Math.abs(dx) > Math.abs(dy)) {
      // horizontal swipe
      if (dx > 0) {
        // swipe right
        if (direction !== "left") {
          direction = "right";
          if (navigator.vibrate) navigator.vibrate(30);
        }
      } else {
        // swipe left
        if (direction !== "right") {
          direction = "left";
          if (navigator.vibrate) navigator.vibrate(30);
        }
      }
    } else {
      // vertical swipe
      if (dy > 0) {
        // swipe down
        if (direction !== "up") {
          direction = "down";
          if (navigator.vibrate) navigator.vibrate(30);
        }
      } else {
        // swipe up
        if (direction !== "down") {
          direction = "up";
          if (navigator.vibrate) navigator.vibrate(30);
        }
      }
    }
  }

  // Attach listeners to the board. Use non-passive so preventDefault works.
  board.addEventListener("touchstart", onTouchStart, { passive: true });
  board.addEventListener("touchmove", onTouchMove, { passive: false });
  board.addEventListener("touchend", onTouchEnd, { passive: true });

  // Also prevent window-level touchmove when starting on the board
  // so the page doesn't scroll while the user is swiping the game area.
  board.addEventListener("touchcancel", () => { startX = startY = null; }, { passive: true });

  // Optional: if the device rotates or resizes to desktop width, remove swipe handlers
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1381) {
      board.removeEventListener("touchstart", onTouchStart);
      board.removeEventListener("touchmove", onTouchMove);
      board.removeEventListener("touchend", onTouchEnd);
    }
  });
})();










