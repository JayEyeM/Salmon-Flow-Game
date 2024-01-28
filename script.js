// Background music
let musicSpeed = 1; // Initial music speed
let elapsedTime = 0;
const speedIncreaseInterval = 15; // Increase speed every 15 seconds

let audio = new Audio("./Theme music.wav");
audio.loop = true;
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


let isColliding = false;

document.addEventListener("keydown", function (e) {
  if (e.code === "ArrowLeft" || e.code === "ArrowRight" || "e.code === Space") {
    e.preventDefault();
    if (!audio || audio.paused) {
      playMusic(true);
    }
  }

  if (gameOver && (e.code === "ArrowLeft" || e.code === "ArrowRight" || e.code === "Space")) {
    audio.currentTime = 0;
    playMusic(true);
    gameOver = false;
    obstacleArray = [];
    score = 0;
  }
});

let currentMusicSpeed = 1; // Variable to store the current music speed

function playMusic(play) {
  const maxMusicSpeed = 2;

  if (play) {
    if (audio.paused || audio.currentTime >= audio.duration) {
      audio.currentTime = 0; // Reset the audio to the beginning
      audio.playbackRate = Math.min(musicSpeed, maxMusicSpeed);
      audio.play();
    }
  } else {
    audio.pause();
  }
}


// Board and game variables





let board = document.getElementById("board");
let boardWidth = document.getElementById("board").offsetWidth;
let boardHeight = document.getElementById("board").offsetHeight;
let boardDiv = document.getElementById("board-div");
let context = board.getContext("2d");




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

let salmonWidth = 50;
let salmonHeight = 115;
let salmonX = boardWidth / 2.2;
let salmonY = boardHeight - salmonHeight;
let salmonImg;

let salmon = {
  x: salmonX,
  y: salmonY,
  width: salmonWidth,
  height: salmonHeight,
};

let obstacleArray = [];
let obstacleWidth = 70;
let obstacleHeight = 110;
let driftwoodImg;
let beaverImg;

let velocityX = 0;
let velocityY = 6;
let gravity = 5;
const maxVelocityY = 54;

let isUpdating = false;
let gameOver = false;
let score = 0;

const scoreText = document.getElementById('score-text');
const gameOverText = document.getElementById('game-over-text');
const levelText = document.getElementById('level-text');
let currentLevel;
let level = 1;


function adjustBoardProperties() {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let container = document.getElementById('container');
  let textLayerBoardDiv = document.getElementById('text-layer-board-div');
  let textLayer = document.getElementById('text-layer');
  let texts = document.getElementById('texts');
  let levelText = document.getElementById('level-text');
  let scoreText = document.getElementById('score-text');
  let gameOverText = document.getElementById('game-over-text');
  let jumpPara = document.getElementById('jump-para');
  let buttonDiv = document.getElementById('button-div');
  let jumpIcon1 = document.getElementById('jump-icon-1');
  let jumpIcon2 = document.getElementById('jump-icon-2');
  let jumpIcon3 = document.getElementById('jump-icon-3');
  let muteButton = document.getElementById('mute-button');
  let instructionsButton = document.getElementById('instructions-button');
  let startButton = document.getElementById('start-button');
  let body = document.querySelector('body');
  let jumpIconDiv = document.getElementById('jump-icon-div');
  let overlay = document.getElementById('overlay');
  let heading1 = document.querySelector('h1');
  if (windowWidth < windowHeight) {
    heading1.style.fontSize = '11vw';
    heading1.style.marginBottom = '15px';
    overlay.style.fontSize = '5vw';
    jumpIconDiv.style.marginTop = '0px';
    jumpIconDiv.style.height = '100%';
    body.style.height = 'auto';
    body.style.width = '100%';
    board.style.width = '100%';
    board.style.height = 'auto';
    boardDiv.style.alignItems = 'none';
    boardDiv.style.width = '90%';
    container.style.height = 'auto';
    container.style.width = '90%';
    textLayerBoardDiv.style.flexDirection = 'column';
    textLayerBoardDiv.style.alignItems = 'none';
    textLayerBoardDiv.style.width = '100%';
    textLayerBoardDiv.style.height = 'auto';
    textLayerBoardDiv.style.paddingBottom = '10%';
    textLayerBoardDiv.style.marginBottom = '10%';
    textLayer.style.width = '90%';
    textLayer.style.height = 'auto';
    textLayer.style.paddingBottom = '0px';
    textLayer.style.flexDirection = 'column-reverse';
    texts.style.height = 'auto';
    texts.style.width = '100%';
    texts.style.display = 'grid';
    texts.style.gridTemplateRows = 'repeat(1, 1fr)';
    texts.style.gridTemplateColumns = 'repeat(2, 1fr)';
    texts.style.rowGap = '0px';
    texts.style.columnGap = '0px';
    buttonDiv.style.marginTop = '0px';
    buttonDiv.style.marginBottom = '0px';
    buttonDiv.style.height = 'auto';
    buttonDiv.style.width = '100%';
    buttonDiv.style.display = 'grid';
    buttonDiv.style.gridTemplateRows = 'repeat(1, 3fr)';
    buttonDiv.style.gridTemplateColumns = 'repeat(3, 3fr)';
    buttonDiv.style.rowGap = '0px';
    buttonDiv.style.columnGap = '0px';
    buttonDiv.style.flexDirection = 'row';
    levelText.style.fontSize = '5vw';
    scoreText.style.fontSize = '5vw';
    gameOverText.style.fontSize = '5vw';
    gameOverText.style.paddingBottom = '15px';
    jumpPara.style.fontSize = '5vw';
    jumpPara.style.marginBottom = '0';
    jumpIcon1.style.width = '15vw';
    jumpIcon2.style.width = '15vw';
    jumpIcon3.style.width = '15vw';
    muteButton.style.fontSize = '2.5vw';
    muteButton.style.height = '3rem';
    instructionsButton.style.fontSize = '2.5vw';
    instructionsButton.style.height = '3rem';
    startButton.style.height = '3rem';
    startButton.style.fontSize = '2.5vw';
  } else if (windowWidth > windowHeight) {
    heading1.style.fontSize = '';
    heading1.style.marginBottom = '';
    overlay.style.fontSize = '';
    jumpIconDiv.style.marginTop = '';
    jumpIconDiv.style.height = '';
    body.style.height = '';
    body.style.width = '';
    board.style.width = '';
    board.style.height = '';
    boardDiv.style.alignItems = '';
    boardDiv.style.width = '';
    container.style.height = '';
    container.style.width = '';
    textLayerBoardDiv.style.flexDirection = '';
    textLayerBoardDiv.style.alignItems = '';
    textLayerBoardDiv.style.width = '';
    textLayerBoardDiv.style.height = '';
    textLayerBoardDiv.style.paddingBottom = '';
    textLayerBoardDiv.style.marginBottom = '';
    textLayer.style.width = '';
    textLayer.style.height = '';
    textLayer.style.paddingBottom = '';
    textLayer.style.flexDirection = '';
    texts.style.height = '';
    texts.style.width = '';
    texts.style.display = '';
    texts.style.gridTemplateRows = '';
    texts.style.gridTemplateColumns = '';
    texts.style.rowGap = '';
    texts.style.columnGap = '';
    buttonDiv.style.marginTop = '';
    buttonDiv.style.marginBottom = '';
    buttonDiv.style.height = '';
    buttonDiv.style.width = '';
    buttonDiv.style.display = '';
    buttonDiv.style.gridTemplateRows = '';
    buttonDiv.style.gridTemplateColumns = '';
    buttonDiv.style.rowGap = '';
    buttonDiv.style.columnGap = '';
    buttonDiv.style.flexDirection = '';
    levelText.style.fontSize = '';
    scoreText.style.fontSize = '';
    gameOverText.style.fontSize = '';
    gameOverText.style.paddingBottom = '';
    jumpPara.style.fontSize = '';
    jumpPara.style.marginBottom = '';
    jumpIcon1.style.width = '';
    jumpIcon2.style.width = '';
    jumpIcon3.style.width = '';
    muteButton.style.fontSize = '';
    muteButton.style.height = '';
    instructionsButton.style.fontSize = '';
    instructionsButton.style.height = '';
    startButton.style.height = '';
    startButton.style.fontSize = '';
  }
}
adjustBoardProperties();

const resizeObserver = new ResizeObserver(adjustBoardProperties);
resizeObserver.observe(document.body);
window.addEventListener('resize', adjustBoardProperties);

function drawLevel() {
  levelText.innerHTML = 'Level<br>' + level;
}

function drawScore() {
  scoreText.innerHTML = 'Score<br>' + score;
}

function drawGameOver() {
  if (!gameOver) {
    gameOverText.textContent = '';
  } else if (gameOver) {
    gameOverText.innerHTML = 'Game <br> Over';
}
}
window.onload = function () {
  adjustBoardProperties();
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
  currentLevel = levelCalculation(count);
  startUpdateLoop();
};//end of onload

function startUpdateLoop() {
  document.addEventListener('keydown', handleKeyDown);
}
function handleKeyDown(e) {
  console.log(e.code);
  if (!isUpdating && e.code === 'KeyR') {
    
    isUpdating = true;
    requestAnimationFrame(update);
  }
}

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

  currentLevel = levelCalculation(count);

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



function obstacleSpeedIncrease(level) {
  if (level++) {
    velocityY += 0.01;
    if (velocityY > maxVelocityY) {
      velocityY = maxVelocityY;
    }
    if (velocityY > 10 && velocityY < 20) {
      document.addEventListener("keydown", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -12;
        }else if (e.code == "ArrowRight") {
          velocityX = 12;
        }
      });
      document.addEventListener("keyup", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -6.5;
        }else if (e.code == "ArrowRight") {
          velocityX = 6.5;
        }
      });
    }
    if (velocityY > 20 && velocityY < 35) {
      document.addEventListener("keydown", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -16;
        }else if (e.code == "ArrowRight") {
          velocityX = 16;
        }
      });
      document.addEventListener("keyup", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -8.5;
        }else if (e.code == "ArrowRight") {
          velocityX = 8.5;
        }
      });
    }
    if (velocityY > 35 && velocityY < 50) {
      document.addEventListener("keydown", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -18;
        }else if (e.code == "ArrowRight") {
          velocityX = 18;
        }
      });
      document.addEventListener("keyup", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -9.5;
        }else if (e.code == "ArrowRight") {
          velocityX = 9.5;
        }
      });
    }
    if (velocityY > 50 && velocityY <= maxVelocityY) {
      document.addEventListener("keydown", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -25;
        }else if (e.code == "ArrowRight") {
          velocityX = 25;
        }
      });
      document.addEventListener("keyup", function (e) {
        if (e.code == "ArrowLeft") {
          velocityX = -12.5;
        }else if (e.code == "ArrowRight") {
          velocityX = 12.5;
        }
      });

      jumpsAreAvailable = false;
      let overlay = document.getElementById("overlay");

      if(!jumpsAreAvailable && maxVelocityY){
        

        isJumpInProgress = false;
        isFallInProgress = false;
        overlay.style.visibility = "visible";
        board.style.boxShadow = "0px 0px 20px 20px lightsalmon";
      }else {
        overlay.style.visibility = "hidden";
        board.style.boxShadow = "none";
        
      }
    }
  }
}

let jumpCount = 0;
let jumpsAreAvailable = true;
let jumpReloadTimeout;
let isJumpRenewalInProgress = false;

function countJumps() {
  if (isSalmonJumping && jumpsAreAvailable) {
    const jumpIcon = document.querySelector(`#jump-icon-${jumpCount + 1}`);
    jumpIcon.style.display = 'none';
    isSalmonJumping = false;
    jumpCount++;

    if (jumpCount === 3) {
      jumpsAreAvailable = false;
      isJumpRenewalInProgress = true;
      jumpReloadTimeout = setTimeout(() => {
        jumpsAreAvailable = true;
        isJumpRenewalInProgress = false;
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
  if (isJumpRenewalInProgress) {
    isJumpInProgress = false;
  }
}




function update() {
  isUpdating = true;
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);
  adjustBoardProperties();

  if (gameOver) {
    startUpdateLoop();
    isUpdating = false;
    playMusic(false); // Stop music
    return;
  }

  

  let salmonRect = {
    x: salmon.x - salmon.width / 8 + salmon.width / 2.6,
    y: salmon.y - salmon.height / 2 + salmon.height/1.9,
    width: salmon.width / 2,
    height: salmon.height
  };
  
  

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

  context.fillStyle = "rgba(255, 0, 0, 0)";
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

  context.fillStyle = "rgba(255, 0, 0, 0)";
  context.fillRect(
    salmonRect.x,
    salmonRect.y,
    salmonRect.width,
    salmonRect.height
    );




  if (salmon.x + salmon.width > board.width) {
    gameOver = true;
  }//checks if the salmon x position is greater than the board width and sets gameOver to true if it is.


  for (let i = 0; i < obstacleArray.length; i++) {
    let obstacle = obstacleArray[i];
    obstacle.y += velocityY;//
    if (
      obstacle.x + obstacle.width > fisherman.x &&
      obstacle.x < fisherman.x + fisherman.width &&
      obstacle.y + obstacle.height > fisherman.y &&
      obstacle.y < fisherman.y + fisherman.height - 80
    ) {
      obstacle.hidden = true;
    } else {
      obstacle.hidden = false;
    }

    if (!obstacle.hidden) {
      context.drawImage(
        obstacle.img,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
    }

    
    moveBeaverFaster(i);

    let obstacleRect = {
      x: obstacle.x + obstacle.width / 3,
      y: obstacle.y + obstacle.height - 12,
      width: obstacle.width / 3,
      height: obstacle.height / 8
    };
    
    
    
    context.fillStyle = "rgba(255, 0, 0, 0)";
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

    context.fillStyle = "rgba(255, 250, 0, 0)";
    context.beginPath();
    context.fillStyle = "rgba(255, 250, 0, 0)";
context.beginPath();
context.fillRect(
  obstacleRect.x,
    obstacleRect.y,
    obstacleRect.width,
    obstacleRect.height
);
context.fill();
context.closePath();


    if (!obstacle.passed && salmon.y < obstacle.y + obstacle.height) {
      score += 1;
      obstacle.passed = true;
    }//checks if the obstacle has passed the salmon and adds 1 to the score if it has.


      
      //if (score === 25) {
        //createIntermediateObstacles();
      
    

        if (detectEllipseEllipseCollision(salmon, obstacle) || detectRectangleRectangleCollision(salmonRect, obstacleRect)) {
          gameOver = true;
          gameOverAudio.play(); // game over sound.
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
      playMusic(true, 0.2, currentMusicSpeed + 0.2);//increases the music speed by 0.2 and plays the music with the new speed 
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
adjustBoardProperties();

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
      moveBeaverFaster(obstacleArray.length - 1);
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
    isColliding = false;
  }, 1000);
}


function jump(){
  if(isJumpInProgress || isFallInProgress || !jumpsAreAvailable || isJumpRenewalInProgress) {
    return;
  }
    salmon.y = salmon.y - jumpHeight;
    isJumpInProgress = true;
    isSalmonJumping = true;
    isColliding = false;
    fall();
    collisionDetectionDelayer();
    countJumps();
}

function collisionDetectionDelayer() {
  setTimeout(() => {
    isFallInProgress = false;
    detectEllipseEllipseCollision();
    detectRectangleRectangleCollision();
    isJumpInProgress = false;
    isColliding = true;
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
    audio.currentTime = 0;
    audio.loop = false;

    gameOverAudio.play();
    gameOverAudio.loop = false;

  }
}


function detectRectangleRectangleCollision(rectangle1, rectangle2) {
  if (!rectangle1 || !rectangle2) {
    return false;
  }

  if (isJumpInProgress || isFallInProgress) {
    return false; // Ignore collisions during jump and fall
  }

  // Check if the small rectangles overlap
  return (
    rectangle1.x < rectangle2.x + rectangle2.width &&
    rectangle1.x + rectangle1.width > rectangle2.x &&
    rectangle1.y < rectangle2.y + rectangle2.height &&
    rectangle1.y + rectangle1.height > rectangle2.y
  );
}

function detectEllipseEllipseCollision(ellipse1, ellipse2) {
  if (!ellipse1 || !ellipse2) {
    return false;
  }

  if (isJumpInProgress || isFallInProgress) {
    return false; // Ignore collisions during jump and fall
  }

  // Check for collisions after the third jump (no need to check the 15-second renewal time)
  if (jumpCount === 3 && !isJumpInProgress && !isFallInProgress) {
    let dx = ellipse1.x + ellipse1.width / 2 - (ellipse2.x + ellipse2.width / 2);
    let dy = ellipse1.y + ellipse1.height / 2 - (ellipse2.y + ellipse2.height / 2);
    let distance = Math.sqrt(dx * dx + dy * dy);

    isColliding = distance < ellipse1.width / 2 + ellipse2.width / 2;
    return isColliding;
  } else {
    // Check for collisions during the first and second jump phases
    if (!isJumpInProgress && !isFallInProgress) {
      let dx = ellipse1.x + ellipse1.width / 2 - (ellipse2.x + ellipse2.width / 2);
      let dy = ellipse1.y + ellipse1.height / 2 - (ellipse2.y + ellipse2.height / 2);
      let distance = Math.sqrt(dx * dx + dy * dy);

      isColliding = distance < ellipse1.width / 2 + ellipse2.width / 2;
      return isColliding;
    } else {
      return false;
    }
  }
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

