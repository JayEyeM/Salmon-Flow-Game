// Background music
let musicSpeed = 1; // Initial music speed
let elapsedTime = 0;
const speedIncreaseInterval = 10; // Increase speed every 15 seconds

let audio;

document.addEventListener("keydown", function (e) {
  if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
    if (!audio || audio.paused) {
      playMusic(true);
    }
  }
});

let currentMusicSpeed = 1; // Variable to store the current music speed

function playMusic(play, volume = 0.2, speed = 1) {
  const maxMusicSpeed = 2;

  if (play) {
    if (!audio) {
      audio = new Audio("./Theme music.wav");
      audio.loop = true;
      audio.volume = volume;
      audio.playbackRate = Math.min(speed, maxMusicSpeed); // Set the playback speed
      audio.play();
      currentMusicSpeed = audio.playbackRate; // Remember the initial speed
    } else {
      if (audio.paused) {
        audio.play();
      }
      // Adjust the playback speed if the audio is already playing
      audio.playbackRate = Math.min(speed, maxMusicSpeed);
      currentMusicSpeed = audio.playbackRate; // Update the current speed
    }
  } else {
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0; // Reset the audio to the beginning of the loop
    }
  }
}

// Board and game variables

const beginner = 5;
const intermediate = 10;
const advanced = 15;

let board;
let boardWidth = 390;
let boardHeight = 480;
let context;

let fishermanWidth = 130;
let fishermanHeight = 250;
let fishermanX = 0;
let fishermanY = 0;
let fishermanImg;

let fisherman = {
  x: fishermanX,
  y: fishermanY,
  width: fishermanWidth,
  height: fishermanHeight,
};

let salmonWidth = 40;
let salmonHeight = 105;
let salmonX = boardWidth / 2.2;
let salmonY = boardHeight / 1.28;
let salmonImg;

let salmon = {
  x: salmonX,
  y: salmonY,
  width: salmonWidth,
  height: salmonHeight,
};

let obstacleArray = [];
let obstacleWidth = 50;
let obstacleHeight = 90;
let driftwoodImg;
let beaverImg;

let velocityX = 0;
let velocityY = 4;
let gravity = 5;

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  fishermanImg = new Image();
  fishermanImg.src = "./fishermanCharacter2.svg";
  fishermanImg.onload = function () {
    context.drawImage(
      fishermanImg,
      fisherman.x,
      fisherman.y,
      fisherman.width,
      fisherman.height
    );
  };

  salmonImg = new Image();
  salmonImg.src = "./finalSalmonCharacter.svg";
  salmonImg.onload = function () {
    context.drawImage(
      salmonImg,
      salmon.x,
      salmon.y,
      salmon.width,
      salmon.height
    );
  };

  driftwoodImg = new Image();
  driftwoodImg.src = "./driftwoodFinal.svg";

  beaverImg = new Image();
  beaverImg.src = "./beaverCharacter.svg";

  document.addEventListener("keydown", moveSalmon);

  obstacleManager();

  requestAnimationFrame(update);
};

let musicStopped = false;

function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    playMusic(false); // Stop music
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  context.drawImage(
    fishermanImg,
    fisherman.x,
    fisherman.y,
    fisherman.width,
    fisherman.height
  );

  salmon.x += velocityX;
  salmon.x = Math.max(salmon.x, 0);
  salmon.x = Math.min(salmon.x, board.width - salmon.width);

  context.drawImage(salmonImg, salmon.x, salmon.y, salmon.width, salmon.height);

  context.fillStyle = "rgb(255, 0, 0, 0.35)";
  context.beginPath();
  context.ellipse(
    salmon.x + salmon.width / 2,
    salmon.y + salmon.height / 2,
    salmon.width / 2,
    salmon.height / 2,
    0,
    0,
    2 * Math.PI
  );
  context.fill();
  context.closePath();

  context.fillStyle = "rgb(255, 0, 0, 0.35)";
  context.beginPath();
  context.rect(
    salmon.x - salmon.width / 8 + salmon.width / 2,
    salmon.y - salmon.height / 2 + salmon.height / 2,
    salmon.width / 4,
    salmon.height / 4,
    0,
    0,
    2 * Math.PI
  );
  context.fill();
  context.closePath();

  if (salmon.x + salmon.width > board.width) {
    gameOver = true;
  }

  for (let i = 0; i < obstacleArray.length; i++) {
    let obstacle = obstacleArray[i];
    obstacle.y += velocityY;
    context.drawImage(
      obstacle.img,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );

    context.fillStyle = "rgb(255, 0, 0, 0.35)";
    context.beginPath();
    context.ellipse(
      obstacle.x + obstacle.width / 2,
      obstacle.y + obstacle.height / 2,
      obstacle.width / 2,
      obstacle.height / 2,
      0,
      0,
      2 * Math.PI
    );
    context.fill();
    context.closePath();

    context.fillStyle = "rgb(255, 250, 0, 0.35)";
    context.beginPath();
    context.rect(
      obstacle.x + obstacle.width / 3,
      obstacle.y + obstacle.height / 1.4,
      obstacle.width / 3,
      obstacle.height / 4
    );
    context.fill();
    context.closePath();

    if (!obstacle.passed && salmon.y > obstacle.y + obstacle.height) {
      score += 1;
      obstacle.passed = true;
    }

    if (detectCollision(salmon, obstacle)) {
      gameOver = true;
    }
  }

  while (obstacleArray.length > 0 && obstacleArray[0].y < -obstacleHeight) {
    obstacleArray.shift();
  }

  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver && !musicStopped) {
    playMusic(false);
    musicStopped = true;
    context.fillText("GAME OVER", 5, 90);
  }

  if (!gameOver) {
    musicStopped = false;

    elapsedTime += 1 / 60;

    if (elapsedTime >= speedIncreaseInterval) {
      elapsedTime = 0;
      musicSpeed += 0.2;

      // Increase speed from the current speed
      playMusic(true, 0.2, currentMusicSpeed + 0.2);
    }
  }
}

function renderObstacles(obstacleType) {
  if (obstacleType === "driftwood") {
    let randomDriftwoodY = -10;
    let randomDriftwoodX = Math.random() * (board.width - obstacleWidth);
    let driftwood = {
      img: driftwoodImg,
      x: randomDriftwoodX,
      y: randomDriftwoodY,
      width: obstacleWidth * 2,
      height: obstacleHeight - 45,
      passed: false,
    };

    let isOverlapping = obstacleArray.some((obstacle) => {
      return (
        driftwood.x < obstacle.x + obstacle.width &&
        driftwood.x + driftwood.width > obstacle.x &&
        driftwood.y < obstacle.y + obstacle.height &&
        driftwood.y + driftwood.height > obstacle.y
      );
    });

    if (!isOverlapping) {
      obstacleArray.push(driftwood);
    }
  } else if (obstacleType === "beaver") {
    let randomBeaverY = -10;
    let randomBeaverX = Math.random() * (board.width - obstacleWidth);
    let beaver = {
      img: beaverImg,
      x: randomBeaverX,
      y: randomBeaverY,
      width: obstacleWidth - 5,
      height: obstacleHeight + 20,
      passed: false,
    };

    let isOverlapping = obstacleArray.some((obstacle) => {
      return (
        beaver.x < obstacle.x + obstacle.width &&
        beaver.x + beaver.width > obstacle.x &&
        beaver.y < obstacle.y + obstacle.height &&
        beaver.y + beaver.height > obstacle.y
      );
    });

    if (!isOverlapping) {
      obstacleArray.push(beaver);
    }
  }
}

function obstacleManager() {
  if (gameOver) {
    return;
  }

  let obstacleType = Math.random() < 0.5 ? "driftwood" : "beaver";

  setInterval(() => {
    for (let i = 0; i < beginner; i++) {
      if (score < beginner) {
        renderObstacles(obstacleType);
      }
    }
  }, Math.random() * 3000);
}

//   if (score < intermediate && score > beginner) {
//     setInterval(renderObstacles(obstacleType), Math.random() * 5000);
//   }
// }

function moveSalmon(e) {
  if (e.code == "ArrowLeft") {
    if (salmon.x - velocityX >= 0) {
      velocityX = -7;
    } else {
      velocityX = 0;
    }
  } else if (e.code == "ArrowRight") {
    if (salmon.x + salmon.width < board.width) {
      velocityX = 7;
    } else {
      salmon.x = board.width - salmon.width;
    }
  } else if (e.code == "Space") {
    velocityY = 5;
  }

  if (salmon.x < 0) {
    salmon.x = 0;
  }

  if (gameOver) {
    salmon.x = salmonX;
    obstacleArray = [];
    score = 0;
    gameOver = false;

    // Stop the music if it is playing
    playMusic(false);

    // Restart music for a new round
    playMusic(true);
  }
}

function detectCollision(ellipse1, ellipse2) {
  let dx = ellipse1.x + ellipse1.width / 2 - (ellipse2.x + ellipse2.width / 2);
  let dy =
    ellipse1.y + ellipse1.height / 2 - (ellipse2.y + ellipse2.height / 2);
  let distance = Math.sqrt(dx * dx + dy * dy);

  return (
    distance <= ellipse1.width / 2 + ellipse2.width / 2 &&
    distance <= ellipse1.height / 2 + ellipse2.height / 2
  );
}

document.addEventListener("keyup", function (e) {
  if (e.code == "ArrowLeft" || e.code == "ArrowRight") {
    velocityX = 0;
  }
});
