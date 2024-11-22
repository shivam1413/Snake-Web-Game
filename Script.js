var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var scoreElement = document.getElementById('score');
var levelElement = document.getElementById('level');
var gameOverElement = document.getElementById('game-over');
var eatSound = document.getElementById('eat-sound');
var gameoverSound = document.getElementById('gameover-sound');
var backgroundMusic = document.getElementById('background-music');

var grid = 16;
var count = 0;
var speed = 8;  // Slower movement speed
var level = 1;

var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4,
  color: '#00ff00',
  headColor: '#4CAF50',  // Darker shade for head
  bodyColor: '#81C784', // Lighter shade for body
};

var apple = {
  x: 320,
  y: 320,
  color: '#ff0000'
};

var score = 0;

// Get random integer between a range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Increase game difficulty with speed
function increaseDifficulty() {
  level = Math.floor(score / 5) + 1;
  speed = Math.max(8 - level, 4);  // Speed will increase with level, but won't go below 4
  levelElement.textContent = 'Level: ' + level;
}

// Game loop
function loop() {
  requestAnimationFrame(loop);

  // Slow down the loop to create a frame rate
  if (++count < speed) {
    return;
  }
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Move snake by its velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Wrap snake around edges of screen
  if (snake.x < 0) snake.x = canvas.width - grid;
  if (snake.x >= canvas.width) snake.x = 0;
  if (snake.y < 0) snake.y = canvas.height - grid;
  if (snake.y >= canvas.height) snake.y = 0;

  // Track snake's position
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // Limit snake length to maxCells
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Draw apple
  context.fillStyle = apple.color;
  context.beginPath();
  context.arc(apple.x + grid / 2, apple.y + grid / 2, grid / 2 - 2, 0, Math.PI * 2, false);
  context.fill();

  // Draw snake with a distinct head and body
  snake.cells.forEach(function (cell, index) {
    // Head has a different color than the body
    context.fillStyle = (index === 0) ? snake.headColor : snake.bodyColor;
    context.beginPath();
    context.arc(cell.x + grid / 2, cell.y + grid / 2, grid / 2 - 2, 0, Math.PI * 2, false);
    context.fill();

    // Check if snake eats apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      scoreElement.textContent = 'Score: ' + score;

      // Play eat sound
      eatSound.play();

      // Move apple to new random position
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;

      // Increase difficulty
      increaseDifficulty();
    }

    // Check if snake collides with itself
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver();
      }
    }
  });
}

// Listen to keyboard events to move the snake
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft' && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.key === 'ArrowUp' && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.key === 'ArrowRight' && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.key === 'ArrowDown' && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  } else if (e.key === 'Enter' && gameOverElement.style.display === 'block') {
    restartGame();
  }
});

// Game Over
function gameOver() {
  gameoverSound.play();
  gameOverElement.style.display = 'block';
}

// Restart the game
function restartGame() {
  snake.x = 160;
  snake.y = 160;
  snake.dx = grid;
  snake.dy = 0;
  snake.cells = [];
  snake.maxCells = 4;
  score = 0;
  scoreElement.textContent = 'Score: ' + score;
  gameOverElement.style.display = 'none';
  loop();
}

// Start the game loop
loop();
