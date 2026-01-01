// const board = document.querySelector(".board");
// const modal = document.querySelector(".modal");
// const startgamemodal = document.querySelector(".start-game");
// const gameovermodal = document.querySelector(".game-over");
// const startButton = document.querySelector(".btn-start");
// const restartButton = document.querySelector(".btn-restart");
// const scoreElement = document.querySelector("#score");
// const highScoreElement = document.querySelector("#high-score");
// const timeElement = document.querySelector("#time");

// const blockHeight = 50;
// const blockWidth = 50;

// let score = 0;
// let highScore = localStorage.getItem("highScore") || 0;
// let time = `00:00`;
// highScoreElement.innerText = highScore;

// const cols = Math.floor(board.clientWidth / blockWidth);
// const rows = Math.floor(board.clientHeight / blockHeight);

// let food = {
//   x: Math.floor(Math.random() * rows),
//   y: Math.floor(Math.random() * cols),
// };
// let intervalId = null;
// let timeIntervalId = null;
// const blocks = [];

// let snake = [
//   {
//     x: 1,
//     y: 3,
//   },
// ];

// let direction = "down";

// for (let row = 0; row < rows; row++) {
//   for (let col = 0; col < cols; col++) {
//     const block = document.createElement("div");
//     block.classList.add("block");
//     board.appendChild(block);
    
//     blocks[`${row}-${col}`] = block;
//   }
// }

// function render() {
//   // remove previous snake fill
//   snake.forEach((seg) => {
//     blocks[`${seg.x}-${seg.y}`].classList.remove("fill");
//   });

//   // remove previous food (only needed when we generate a new one)
//   blocks[`${food.x}-${food.y}`].classList.remove("food");

//   // calculate new head
//   let head;
//   if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
//   else if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
//   else if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };
//   else if (direction === "up") head = { x: snake[0].x - 1, y: snake[0].y };

//   // check wall collision
//   if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
//     clearInterval(intervalId);
//     modal.style.display = "flex";
//     startgamemodal.style.display = "none";
//     gameovermodal.style.display = "flex";
//     return;
//   }

//   // check self collision
//   if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
//     clearInterval(intervalId);
//     modal.style.display = "flex";
//     startgamemodal.style.display = "none";
//     gameovermodal.style.display = "flex";
//     return;
//   }

//   // add new head
//   snake.unshift(head);

//   // check if food eaten
//   if (head.x === food.x && head.y === food.y) {
//     score += 10;
//     scoreElement.innerText = score;
//     if (score > highScore) {
//       highScore = score;
//       localStorage.setItem("highScore", highScore.toString());
//       highScoreElement.innerText = highScore;
//     }

//     // generate new food
//     food = {
//       x: Math.floor(Math.random() * rows),
//       y: Math.floor(Math.random() * cols),
//     };
//   } else {
//     // remove tail if food not eaten
//     snake.pop();
//   }

//   // render snake
//   snake.forEach((seg) => {
//     blocks[`${seg.x}-${seg.y}`].classList.add("fill");
//   });

//   // render food
//   blocks[`${food.x}-${food.y}`].classList.add("food");
// }



// startButton.addEventListener("click", () => {
//   modal.style.display = "none";
//   intervalId = setInterval(() => {render();},300);
// timeIntervalId = setInterval(() => {
//     let [mins, secs] = time.split(":").map(Number);
//     if(secs === 59){
//         mins += 1;
//         secs = 0;
//     }
//     else{
//         secs += 1;
//     }
//     time = `${mins}:${secs}`
//     timeElement.innerText=time;
// },1000)
// });

// restartButton.addEventListener("click", restartgame);

// function restartgame() {
//   blocks[`${food.x}-${food.y}`].classList.remove("food");
//   snake.forEach((segment) => {
//     blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
//   });

//   score = 0;
//   time = `00:00`;

//   scoreElement.innerText = score;
//   timeElement.innerText = time;
//   highScoreElement.innerText = highScore;

//   modal.style.display = "none";
//   direction = "down";
//   snake = [{ x: 1, y: 3 }];
//   food = {
//     x: Math.floor(Math.random() * rows),
//     y: Math.floor(Math.random() * cols),
//   };
//   intervalId = setInterval(() => {
//     render();
//   }, 300);
// }

// addEventListener("keydown", (event) => {
//   if (event.key === "ArrowUp") {
//     direction = "up";
//   } else if (event.key === "ArrowLeft") {
//     direction = "left";
//   } else if (event.key === "ArrowDown") {
//     direction = "down";
//   } else if (event.key === "ArrowRight") {
//     direction = "right";
//   }
// });





// document.addEventListener("DOMContentLoaded", () => {
//   const board = document.querySelector(".board");
//   const modal = document.querySelector(".modal");
//   const startgamemodal = document.querySelector(".start-game");
//   const gameovermodal = document.querySelector(".game-over");
//   const startButton = document.querySelector(".btn-start");
//   const restartButton = document.querySelector(".btn-restart");
//   const pauseButton = document.querySelector(".btn-pause");
//   const scoreElement = document.querySelector("#score");
//   const highScoreElement = document.querySelector("#high-score");
//   const timeElement = document.querySelector("#time");

//   const blockHeight = 50;
//   const blockWidth = 50;

//   let score = 0;
//   let highScore = localStorage.getItem("highScore") || 0;
//   let totalSeconds = 0; // Timer in seconds
//   let intervalId = null;
//   let timeIntervalId = null;
//   let speed = 300;
//   const speedIncrement = 10;
//   let paused = false;

//   highScoreElement.innerText = highScore;

//   const blocks = {};

//   // Sounds
//   const eatSound = new Audio("eat.mp3");
//   const gameOverSound = new Audio("gameover.mp3");
//   // Calculate rows/cols
//   const cols = Math.floor(board.clientWidth / blockWidth);
//   const rows = Math.floor(board.clientHeight / blockHeight);
//   // Snake + Food
//   let snake = [
//     { x: 1, y: 3 },
//     { x: 1, y: 2 },
//   ];
//   let direction = "down";
//   let food = generateFood();

//   /* ---------------- CREATE BOARD ---------------- */
//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const block = document.createElement("div");
//       block.classList.add("block");
//       board.appendChild(block);
//       blocks[`${row}-${col}`] = block;
//     }
//   }

//   /* ---------------- FOOD GENERATION ---------------- */
//   function generateFood() {
//     let pos;
//     do {
//       pos = {
//         x: Math.floor(Math.random() * rows),
//         y: Math.floor(Math.random() * cols),
//       };
//     } while (snake.some((seg) => seg.x === pos.x && seg.y === pos.y));
//     return pos;
//   }

//   /* ---------------- RENDER ---------------- */
//   function render() {
//     if (paused) return;

//     // Clear snake and food
//     snake.forEach((seg) =>
//       blocks[`${seg.x}-${seg.y}`].classList.remove("fill", "head")
//     );
//     blocks[`${food.x}-${food.y}`].classList.remove("food");

//     // New head position
//     let head = { ...snake[0] };
//     if (direction === "up") head.x--;
//     if (direction === "down") head.x++;
//     if (direction === "left") head.y--;
//     if (direction === "right") head.y++;

//     // Wall collision
//     if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
//       return gameOver();
//     }

//     // Self collision
//     if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
//       return gameOver();
//     }

//     snake.unshift(head);

//     // Food eaten
//     if (head.x === food.x && head.y === food.y) {
//       score += 10;
//       scoreElement.innerText = score;

//       // Play eat sound
//       eatSound.currentTime = 0;
//       eatSound.play();

//       if (score > highScore) {
//         highScore = score;
//         localStorage.setItem("highScore", highScore);
//         highScoreElement.innerText = highScore;
//       }

//       food = generateFood();

//       // Increase speed
//       speed = Math.max(50, speed - speedIncrement);
//       restartInterval();
//     } else {
//       snake.pop();
//     }

//     // Draw snake
//     snake.forEach((seg, index) => {
//       const block = blocks[`${seg.x}-${seg.y}`];
//       if (index === 0) block.classList.add("head"); // Head
//       else block.classList.add("fill"); // Body
//     });

//     // Draw food
//     blocks[`${food.x}-${food.y}`].classList.add("food");
//   }

//   /* ---------------- GAME OVER ---------------- */
//   function gameOver() {
//     clearInterval(intervalId);
//     clearInterval(timeIntervalId);

//     gameOverSound.currentTime = 0;
//     gameOverSound.play();

//     modal.style.display = "flex";
//     startgamemodal.style.display = "none";
//     gameovermodal.style.display = "flex";
//   }

//   /* ---------------- RESTART INTERVAL ---------------- */
//   function restartInterval() {
//     clearInterval(intervalId);
//     intervalId = setInterval(render, speed);
//   }

//   /* ---------------- START TIMER ---------------- */
//   function startTimer() {
//     clearInterval(timeIntervalId);
//     timeIntervalId = setInterval(() => {
//       if (paused) return;
//       totalSeconds++;
//       const mins = Math.floor(totalSeconds / 60);
//       const secs = totalSeconds % 60;
//       timeElement.innerText = `${String(mins).padStart(2, "0")}:${String(
//         secs
//       ).padStart(2, "0")}`;
//     }, 1000);
//   }

//   /* ---------------- START GAME ---------------- */
//   startButton.addEventListener("click", () => {
//     modal.style.display = "none";
//     gameovermodal.style.display = "none";
//     paused = false;
//     totalSeconds = 0;
//     restartInterval();
//     startTimer();
//   });

//   /* ---------------- RESTART GAME ---------------- */
//   restartButton.addEventListener("click", () => {
//     clearInterval(intervalId);
//     clearInterval(timeIntervalId);

//     snake.forEach((seg) =>
//       blocks[`${seg.x}-${seg.y}`].classList.remove("fill", "head")
//     );
//     blocks[`${food.x}-${food.y}`].classList.remove("food");

//     score = 0;
//     totalSeconds = 0;
//     speed = 300;
//     direction = "down";
//     snake = [
//       { x: 1, y: 3 },
//       { x: 1, y: 2 },
//     ];
//     food = generateFood();

//     scoreElement.innerText = score;
//     timeElement.innerText = "00:00";

//     modal.style.display = "none";
//     paused = false;
//     restartInterval();
//     startTimer();
//   });

//   /* ---------------- PAUSE BUTTON ---------------- */
//   pauseButton.addEventListener("click", () => {
//     paused = !paused;
//     pauseButton.innerText = paused ? "Resume" : "Pause";
//   });

//   /* ---------------- KEYBOARD CONTROLS ---------------- */
//   addEventListener("keydown", (e) => {
//     if (e.key === "ArrowUp" && direction !== "down") direction = "up";
//     if (e.key === "ArrowDown" && direction !== "up") direction = "down";
//     if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
//     if (e.key === "ArrowRight" && direction !== "left") direction = "right";
//   });

//   /* ---------------- MOBILE CONTROLS ---------------- */
//   document.querySelectorAll(".mobile-controls button").forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const dir = btn.getAttribute("data-dir");
//       if (dir === "up" && direction !== "down") direction = "up";
//       if (dir === "down" && direction !== "up") direction = "down";
//       if (dir === "left" && direction !== "right") direction = "left";
//       if (dir === "right" && direction !== "left") direction = "right";
//     });
//   });
// });



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
const blockHeight = 50;
const blockWidth = 50;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let time = "00:00";
let speed = 300; // ms
const speedIncrement = 10;

let intervalId = null;
let timeIntervalId = null;
let paused = false;

highScoreElement.innerText = highScore;

const blocks = {};

/* ---------------- BOARD SIZE ---------------- */
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

/* ---------------- SNAKE & FOOD ---------------- */
let snake = [
  { x: 1, y: 3 }, // head
  { x: 1, y: 2 }, // body
];
let direction = "down";
let food = generateFood();

/* ---------------- CREATE BOARD ---------------- */
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

/* ---------------- SOUND EFFECTS ---------------- */
const eatSound = new Audio("eat.mp3");
const gameOverSound = new Audio("gameover.mp3");

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

  // Clear snake
  snake.forEach((seg) =>
    blocks[`${seg.x}-${seg.y}`].classList.remove("fill", "head")
  );

  // Clear food
  blocks[`${food.x}-${food.y}`].classList.remove("food");

  // Move head
  let head = { ...snake[0] };
  if (direction === "up") head.x--;
  if (direction === "down") head.x++;
  if (direction === "left") head.y--;
  if (direction === "right") head.y++;

  // Check collisions
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) return gameOver();
  if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) return gameOver();

  snake.unshift(head);

  // Check food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.innerText = score;

    // Play eating sound
    eatSound.currentTime = 0;
    eatSound.play();

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreElement.innerText = highScore;
    }

    food = generateFood();
    speed = Math.max(50, speed - speedIncrement); // speed up
    restartInterval();
  } else {
    snake.pop();
  }

  // Draw snake
  snake.forEach((seg, index) => {
    const block = blocks[`${seg.x}-${seg.y}`];
    if (index === 0) block.classList.add("head");
    else block.classList.add("fill");
  });

  // Draw food
  blocks[`${food.x}-${food.y}`].classList.add("food");
}

/* ---------------- GAME OVER ---------------- */
function gameOver() {
  clearInterval(intervalId);
  clearInterval(timeIntervalId);

  gameOverSound.currentTime = 0;
  gameOverSound.play();

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
    if (s === 60) {
      m++;
      s = 0;
    }
    time = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    timeElement.innerText = time;
  }, 1000);
}

/* ---------------- START GAME ---------------- */
startButton.addEventListener("click", () => {
  modal.style.display = "none";
  gameovermodal.style.display = "none";
  paused = false;
  restartInterval();
  startTimer();
});

/* ---------------- RESTART GAME ---------------- */
restartButton.addEventListener("click", () => {
  clearInterval(intervalId);
  clearInterval(timeIntervalId);

  // Clear snake and food
  snake.forEach((seg) =>
    blocks[`${seg.x}-${seg.y}`].classList.remove("fill", "head")
  );
  blocks[`${food.x}-${food.y}`].classList.remove("food");

  // Reset game variables
  score = 0;
  speed = 300;
  direction = "down";
  paused = false;

  snake = [
    { x: 1, y: 3 },
    { x: 1, y: 2 },
  ];
  food = generateFood();

  scoreElement.innerText = score;

  modal.style.display = "none";
  restartInterval();
  startTimer(); // start timer after restart
});

/* ---------------- PAUSE BUTTON ---------------- */
pauseButton.addEventListener("click", () => {
  paused = !paused;
  pauseButton.innerText = paused ? "Resume" : "Pause";
});

/* ---------------- KEYBOARD CONTROLS ---------------- */
addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

/* ---------------- MOBILE BUTTON CONTROLS ---------------- */
mobileButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const dir = btn.getAttribute("data-dir");
    if (dir === "up" && direction !== "down") direction = "up";
    if (dir === "down" && direction !== "up") direction = "down";
    if (dir === "left" && direction !== "right") direction = "left";
    if (dir === "right" && direction !== "left") direction = "right";
  });
});
