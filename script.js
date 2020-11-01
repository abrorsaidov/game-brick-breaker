const rulesBtn = document.getElementById("rules-btn");
const rules = document.getElementById("rules");
const closeBtn = document.getElementById("close-btn");
const canvas = document.getElementById("canvas");
const gif = document.querySelector(".gif");
const ctx = canvas.getContext("2d");
// console.log("asdasdasd");

// let randomRGB4 = Math.floor(Math.random() * 256);
// let randomRGB5 = Math.floor(Math.random() * 256);
// let randomRGB6 = Math.floor(Math.random() * 256);
// canvas.style.backgroundColor = `rgba(${randomRGB4}, ${randomRGB5}, ${randomRGB6}, 0.7)`;

let score = 0;
let randomRGB1 = Math.floor(Math.random() * 256);
let randomRGB2 = Math.floor(Math.random() * 256);
let randomRGB3 = Math.floor(Math.random() * 256);
const winImgSrc = "https://media.giphy.com/media/EWWdvQngcLt6g/giphy.gif";
const loseImgSrc = "https://media.giphy.com/media/dkuZHIQsslFfy/giphy.gif";

const brickRowCount = 9;
const brickColumnCount = 5;

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${randomRGB1},${randomRGB2},${randomRGB3}, 1)`;
  ctx.fill();
  ctx.closePath();
}

//Draw paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = `rgba(${randomRGB1},${randomRGB2},${randomRGB3}, 1)`;
  ctx.fill();

  ctx.closePath();
}

// Draw score
function drawScore() {
  ctx.font = "20px monospace";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

console.log(ctx);
// Draw bricks
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);

      //canvas.style.backgroundColor = `rgba(${randomRGB1}, ${randomRGB2}, ${randomRGB3}, 0.7)`;
      ctx.fillStyle = brick.visible
        ? `rgba(${randomRGB2},${randomRGB3},${randomRGB1}, 1)`
        : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}
// Move paddle
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
}
// Move Ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // wall right/left
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  // wall top/bottom
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  //paddle hit
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  gif.addEventListener("click", (e) => {
    //console.log(e.target);
    if (e.target.innerText === "Play again") {
      //ball.dy = 4;
      gif.classList.add("hidden");
      canvas.style.display = "block";
      bricks.forEach((column) => {
        column.forEach((brick) => {
          brick.visible = true;
        });
      });
    }
  });

  // Reset
  // function reset() {
  //   gif.classList.add("hidden");
  //   canvas.style.display = "block";
  //   bricks.forEach((column) => {
  //     column.forEach((brick) => {
  //       brick.visible = true;
  //     });
  //   });
  // }

  // Brick Collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  if (ball.y + ball.size > canvas.height) {
    bricks.forEach((column) => {
      column.forEach((brick) => {
        brick.visible = true;
      });
    });
    score = 0;
  }
}

function increaseScore() {
  score++;
  //if (score === 2) {
  if (score % (brickRowCount * brickColumnCount) === 0) {
    canvas.style.display = "none";
    gif.classList.remove("hidden");
    gif.innerHTML = ` <h2>You won!!!</h2> <img src=${winImgSrc} class="gifClass" /> <button class="btn playAgain" >Play again</button> `;
  }
}

function update() {
  movePaddle();

  // Draw everything
  draw();
  requestAnimationFrame(update);
}
update();

// Draw everything
function draw() {
  moveBall();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// KeyDown
function keyDown(e) {
  if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  } else if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  }
}

// KeyUp
function keyUp(e) {
  if (
    e.key === "Left" ||
    e.key === "ArrowLeft" ||
    e.key === "Right" ||
    e.key === "ArrowRight"
  ) {
    paddle.dx = 0;
  }
}

// Keyboard events
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Rules and shit
rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
  setTimeout(() => {
    rulesBtn.style.opacity = "0";
  }, 10);
});
closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
  setTimeout(() => {
    rulesBtn.style.opacity = "1";
  }, 10);
});
