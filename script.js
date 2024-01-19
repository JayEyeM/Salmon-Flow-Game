// Background music
let musicSpeed = 1; // Initial music speed
let elapsedTime = 0;
const speedIncreaseInterval = 15; // Increase speed every 15 seconds

let audio = new Audio("./Theme music.wav");
let gameOverAudio = new Audio("./gameOverSound.wav");

let muteButton = document.getElementById("mute-button");
let audioClips = [audio, gameOverAudio];

function toggleSound() {
  audio.muted = !audio.muted;
  gameOverAudio.muted = !gameOverAudio.muted;

  if (audio.muted || gameOverAudio.muted) {
    muteButton.textContent = "Unmute sound";
  } else {
    muteButton.textContent = "Mute sound";
  }
}




document.addEventListener("keydown", function (e) {
  if (e.code === "ArrowLeft" || e.code === "ArrowRight" || "e.code === Space") {
    e.preventDefault();
    if (!audio || audio.paused) {
      playMusic(true);
    }
  }
});

let currentMusicSpeed = 1; // Variable to store the current music speed

function playMusic(play, volume = 0.7, speed = 1) {
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
      audio.paused;
      audio.currentTime = 0; // Reset the audio to the beginning of the loop
    }
  }
}

// Board and game variables


let board;
let boardWidth = 390;
let boardHeight = 480;
let context;

let fishermanWidth = 130;
let fishermanHeight = 200;
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

const scoreText = document.getElementById('score-text');
const gameOverText = document.getElementById('game-over-text');
const levelText = document.getElementById('level-text');
let currentLevel;
let level = 1;

function drawLevel() {
  levelText.innerHTML = 'Level<br>' + level;
}

function drawScore() {
  scoreText.innerHTML = 'Score:<br>' + score;
}

function drawGameOver() {
  if (!gameOver) {
    gameOverText.textContent = '';
  } else if (gameOver) {
    gameOverText.innerHTML = 'Game <br> Over';
}
}
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");
  context.globalCompositeOperation='destination-over';

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

  driftwoodImg = new Image();
  driftwoodImg.src = "./driftwoodFinal.svg";

  beaverImg = new Image();
  beaverImg.src = "./beaverCharacter.svg";

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

  

  

  obstacleManager();
  requestAnimationFrame(update);
  currentLevel = levelCalculation(count);
};

let musicStopped = false;

let frameCount = 0;
let lastCountFrame = 0;
let count = countObstacles();


function countObstacles() {
if (frameCount !== lastCountFrame) {
  let count = 0;
  for (let i = 0; i < obstacleArray.length; i++) {
    if (obstacleArray[i].type === "beaver" || obstacleArray[i].type === "driftwood") {
      count++;
    }
  }
  //console.log("Updated obstacleArray:", obstacleArray);
  console.log("Count of Obstacles:", count);
  lastCountFrame = frameCount;

  if (count % 10 === 0) {
    level = levelCalculation(count);
  }

  let currentLevel = levelCalculation(count);

    return count;
  }
}

function levelCalculation(count) {
  if (count === 0) {
    return 1;
  } else {
    return Math.floor(count / 10) + 1;
    
  }
}

const maxVelocityY = 22;

function obstacleSpeedIncrease(level) {
  if (level++) {
    velocityY += 0.002;
    if (velocityY > maxVelocityY) {
      velocityY = maxVelocityY;
    }
    if (velocityY > 10) {
      document.addEventListener("keydown", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -12;
        }else if (e.code == "ArrowRight") {
          velocityX = 12;
        }
      });
      document.addEventListener("keyup", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -5.5;
        }else if (e.code == "ArrowRight") {
          velocityX = 5.5;
        }
      });
    }
    if (velocityY > 20) {
      document.addEventListener("keydown", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -14;
        }else if (e.code == "ArrowRight") {
          velocityX = 14;
        }
      });
      document.addEventListener("keyup", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -7.5;
        }else if (e.code == "ArrowRight") {
          velocityX = 7.5;
        }
      });
    }
  }
}

let jumpCount = 0;
let jumpsAreAvailable = true;
let jumpReloadTimeout;

function countJumps() {
  if (isSalmonJumping && jumpsAreAvailable) {
    const jumpIcon = document.querySelector(`#jump-icon-${jumpCount + 1}`);
    jumpIcon.style.display = 'none';
    isSalmonJumping = false;
    jumpCount++;

    if (jumpCount === 3) {
      jumpsAreAvailable = false;
      jumpReloadTimeout = setTimeout(() => {
        jumpsAreAvailable = true;
        resetJumpIcons();
      }, 15000);
    }
  }
}

function resetJumpIcons() {
  clearTimeout(jumpReloadTimeout);
  jumpCount = 0;
  const jumpIcons = document.querySelectorAll('.jump-icon');
  jumpIcons.forEach((jumpIcon) => {
    jumpIcon.style.display = 'inline-block';
  });
}

function jumpLimit() {
  if (!jumpsAreAvailable || jumpCount === 3) {
    isJumpInProgress = true;
  } else {
    isJumpInProgress = false;
  }
}

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
  

  salmon.x += velocityX;//adds velocity to the salmon x position when the left and right arrow keys are pressed
  salmon.x = Math.max(salmon.x, 0);//sets the salmon x position to 0 if it is less than 0
  salmon.x = Math.min(salmon.x, board.width - salmon.width);//sets the salmon x position to the board width minus the salmon width if it is greater than the board width minus the salmon width

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
  }//checks if the salmon x position is greater than the board width and sets gameOver to true if it is.

  for (let i = 0; i < obstacleArray.length; i++) {
    let obstacle = obstacleArray[i];
    obstacle.y += velocityY;//
    context.drawImage(
      obstacle.img,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );//draws the obstacle 
    

    
    moveBeaverFaster(i);
    
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
    );//draws the ellipse around the obstacle 
    context.fill();
    context.closePath();

    context.fillStyle = "rgb(255, 250, 0, 0.35)";
    context.beginPath();
    context.rect(
      obstacle.x + obstacle.width / 3,
      obstacle.y + obstacle.height / 1.4,
      obstacle.width / 3,
      obstacle.height / 4
    );//draws the rectangle around the ellipse around the obstacle 
    context.fill();
    context.closePath();

    if (!obstacle.passed && salmon.y < obstacle.y + obstacle.height) {
      score += 1;
      obstacle.passed = true;
    }//checks if the obstacle has passed the salmon and adds 1 to the score if it has.


      
      //if (score === 25) {
        //createIntermediateObstacles();
      
    

    if (detectCollision(salmon, obstacle)) {
      gameOver = true;
      gameOverAudio.play();//game over sound.
    }
  }

 while (obstacleArray.length > 0 && obstacleArray[0].y + obstacleArray[0].height <= 0) {
  obstacleArray.shift();
}



  if (gameOver && !musicStopped) {
    playMusic(false);
    musicStopped = true;
   
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
  frameCount++;
  countObstacles();
  drawLevel();
  drawScore();
  drawGameOver();
  countJumps();
  jumpLimit();
obstacleSpeedIncrease(level);

document.addEventListener("keydown", moveSalmon);


}//end of update function

function moveBeaverFaster(i){
    if (obstacleArray[i].type === "beaver" && level <= 5) {
      obstacleArray[i].y += velocityY * 0.2;
  
  }else if (obstacleArray[i].type === "beaver" && level > 5 && level <= 10) {
    obstacleArray[i].y += velocityY * 0.3;
}else if (obstacleArray[i].type === "beaver" && level > 10 && level <= 15) {
  obstacleArray[i].y += velocityY * 0.4;
}else if (obstacleArray[i].type === "beaver" && level > 15 && level <= 20) {
  obstacleArray[i].y += velocityY * 0.5;
}else if (obstacleArray[i].type === "beaver" && level > 20 && level <= 25) {
  obstacleArray[i].y += velocityY * 0.6;
}else if (obstacleArray[i].type === "beaver" && level > 25) {
  obstacleArray[i].y += velocityY * 0.7;
}
}

function renderObstacles(obstacleType) {
  if (obstacleType === "driftwood") {
    let randomDriftwoodY = -(Math.random() * (board.height - obstacleHeight) * 0.5);
    let randomDriftwoodX = Math.random() * (board.width - obstacleWidth);
    let driftwood = {
      type: "driftwood",
      img: driftwoodImg,
      x: randomDriftwoodX,
      y: randomDriftwoodY,
      width: obstacleWidth * 2,
      height: obstacleHeight - 45,
      passed: false,
    };

    let isOverlapping = obstacleArray.some((obstacle) => {
      return checkObstacleProximity(driftwood, obstacle);
    });

    if (!isOverlapping) {
      obstacleArray.push(driftwood);
    }
    //console.log("Updated obstacleArray:", obstacleArray);
  } else if (obstacleType === "beaver") {
    let randomBeaverY = -(Math.random() * (board.height - obstacleHeight) * 0.5);
    let randomBeaverX = Math.random() * (board.width - obstacleWidth);
    let beaver = {
      type: "beaver",
      img: beaverImg,
      x: randomBeaverX,
      y: randomBeaverY,
      width: obstacleWidth - 5,
      height: obstacleHeight + 20,
      passed: false,
    };
    
 

    let isOverlapping = obstacleArray.some((obstacle) => {
      return checkObstacleProximity(beaver, obstacle);
    });

    if (!isOverlapping) {
      obstacleArray.push(beaver);
      moveBeaverFaster(i);
    }
    //console.log("Updated obstacleArray:", obstacleArray);
    
  }
}

function getRandomXPosition(obstacleWidth) {
  let randomX = Math.random() * (board.width - obstacleWidth);//generates a random x position
  let proximityThreshold = 100;//sets the proximity threshold to 100 pixels between the new obstacle and existing obstacles

  while (obstacleArray.some((obstacle) => Math.abs(obstacle.x - randomX) < proximityThreshold)) {
    randomX = Math.random() * (board.width - obstacleWidth);
  } //checks if the random x position is close to an existing obstacle and generates a new random x position if it is.

  return randomX;//returns the random x position
}

function checkObstacleProximity(newObstacle, existingObstacle) {
  let proximityThreshold = 100;

  return (
    newObstacle.x < existingObstacle.x + existingObstacle.width + proximityThreshold &&
    newObstacle.x + newObstacle.width + proximityThreshold > existingObstacle.x &&
    newObstacle.y < existingObstacle.y + existingObstacle.height + proximityThreshold &&
    newObstacle.y + newObstacle.height + proximityThreshold > existingObstacle.y
  );
}//checks if the new obstacle is close to an existing obstacle

function obstacleManager() {
  if (gameOver) {
    return;
  }

  setInterval(renderObstacles, 500, "driftwood");//creates a new driftwood every 500ms
  setInterval(renderObstacles, 500, "beaver");//creates a new beaver every 500ms
}

let isSalmonJumping = false;

let jumpHeight = 40;
let originalY = salmon.y;
let isJumpInProgress = false;
let isFallInProgress = false;
function fall(){
isFallInProgress = true;

  setTimeout(function(){
    isSalmonJumping = false;
    salmon.y = salmon.y + 40;
    isJumpInProgress = false;
  }, 1000);
}

function jump(){
  if(isJumpInProgress) {
    return;
  }
    salmon.y = salmon.y - jumpHeight;
    isJumpInProgress = true;
    isSalmonJumping = true;
    fall();
    collisionDetectionDelayer();
    
}

function collisionDetectionDelayer() {
  setTimeout(() => {
    isFallInProgress = false;
  }, 3000);
}

function moveSalmon(e) {
  if (e.code == "ArrowLeft") {
    if (salmon.x - velocityX >= 0) {
      velocityX = -10;
    } else {
      velocityX = 0;
    }
  } else if (e.code == "ArrowRight") {
    if (salmon.x + salmon.width < board.width) {
      velocityX = 10;
    } else {
      salmon.x = board.width - salmon.width;
    }
  } else if (e.code === "Space") {
    jump();
  } else if (e.code === "KeyS") {
    velocityY = maxVelocityY;
  }

  if (salmon.x < 0) {
    salmon.x = 0;
  }
  
  if (gameOver) {
    salmon.x = salmonX;//sets the salmon x position to 0
  obstacleArray = [];//clears the obstacle array
  score = 0;//sets the score to 0
  gameOver = false;//sets the game over to false

  gameOverLogic();
}
}

function gameOverLogic(){
  if (gameOver) {

    // Stop the music if it is playing
    playMusic(false);

    // Restart music for a new round
    playMusic(true);
  }
}

let isColliding = false;
function detectCollision(ellipse1, ellipse2) {
  if (isSalmonJumping || isFallInProgress) {
    return false;
  }

  let dx = ellipse1.x + ellipse1.width / 2 - (ellipse2.x + ellipse2.width / 2);
  let dy = 
    ellipse1.y + ellipse1.height / 2 - (ellipse2.y + ellipse2.height / 2);
  let distance = Math.sqrt(dx * dx + dy * dy);

  isColliding = true;

  return (
    distance <= ellipse1.width / 2 + ellipse2.width / 2 &&
    distance <= ellipse1.height / 2 + ellipse2.height / 2
  );
}

function noCollision() {
  if(!isFallInProgress) {
    isColliding = false;
  }
 }


document.addEventListener("keyup", function (e) {
  if (e.code == "ArrowLeft") {
    velocityX = -3.5;
    isSalmonJumping = false;
  }else if (e.code == "ArrowRight") {
    velocityX = 3.5;
    isSalmonJumping = false;
  }
});

const instructionsButton = document.getElementById("instructions-button");
const instructionsWindow = document.getElementById("instructionsWindow");
const closeInstructionsButton = document.getElementById("closeInstructionsButton");

instructionsButton.addEventListener("click", showInstructions);
closeInstructionsButton.addEventListener("click", closeInstructions);

function showInstructions() {
  instructionsWindow.style.display = "block";
}

function closeInstructions() {
  instructionsWindow.style.display = "none";
}

