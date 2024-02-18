let musicStopped = false;

let jumpCount = 0;
let jumpsAreAvailable = true;
let jumpReloadTimeout;
let isJumpRenewalInProgress = false;

let frameCount = 0;
let lastCountFrame = 0;
let count = countObstacles();

const resizeObserver = new ResizeObserver(adjustBoardProperties);
let overlay = document.getElementById("overlay");

let gameOverOverlay = document.getElementById("game-over-text-div");
let welcomeText = document.getElementById("game-over-text2");
let scoreText2 = document.getElementById("score-text2");
let hightscoreText = document.getElementById("highscore-text");
let playGameButton = document.getElementById("play-game-button");
let playGameButtonLabel = document.getElementById("play-game-button-label");
let showLabelsButton = document.getElementById("showLabelsButton");
let toolTip1 = document.getElementById("toolTip1");
let toolTip2 = document.getElementById("toolTip2");
let toolTip3 = document.getElementById("toolTip3");
let toolTip4 = document.getElementById("toolTip4");
let toolTip5 = document.getElementById("toolTip5");
let toolTip6 = document.getElementById("toolTip6");
let toolTip7 = document.getElementById("toolTip7");
let allToolTips = [
  toolTip1,
  toolTip2,
  toolTip3,
  toolTip4,
  toolTip5,
  toolTip6,
  toolTip7,
];
let isToolTipsEnabled = false;
function toggleToolTips() {
  isToolTipsEnabled = !isToolTipsEnabled;
  allToolTips.forEach((toolTip) => {
    toolTip.style.display = isToolTipsEnabled ? "block" : "none";
  });
  if (isToolTipsEnabled === false) {
    showLabelsButton.innerHTML = "Show Button Labels";
  } else {
    showLabelsButton.innerHTML = "Hide Button Labels";
  }
}
// Board and game variables

let board = document.getElementById("board");
let boardWidth = document.getElementById("board").offsetWidth;
let boardHeight = document.getElementById("board").offsetHeight;
let boardDiv = document.getElementById("board-div");
let context = board.getContext("2d");

// let fishermanWidth = boardWidth / 5;
// let fishermanHeight = boardHeight / 4;
// let fishermanX = 0;
// let fishermanY = 0;
// let fishermanImg;

// let fisherman = {
//   x: fishermanX,
//   y: fishermanY,
//   width: fishermanWidth,
//   height: fishermanHeight,
// };
let fliesEaten = false;
let fliesWidth = boardWidth / 9;
let fliesHeight = boardHeight / 9;
let fliesX = 0;
let fliesY = 0;
let fliesImg;

let flies = {
  x: fliesX,
  y: fliesY,
  width: fliesWidth,
  height: fliesHeight,
};

let salmonWidth = boardWidth / 12;
let salmonHeight = boardHeight / 6;
let salmonX = boardWidth / 2.1;
let salmonY = boardHeight - salmonHeight;
let salmonImg;

let salmon = {
  x: salmonX,
  y: salmonY,
  width: salmonWidth,
  height: salmonHeight,
};
let salmonRect;
let fliesArray = [];
let obstacleArray = [];
let obstacleWidth = boardWidth / 8;
let obstacleHeight = boardHeight / 6;
let driftwoodImg;
let beaverImg;

let group1ImagesArray = [
  "./beaverObstacleImageChoices/boatFisherman.svg",
  "./beaverObstacleImageChoices/ducky.svg",
  "./beaverObstacleImageChoices/rubberBoot.svg",
  "./beaverObstacleImageChoices/carTire.svg",
  "./beaverCharacter.svg",
];
let group2ImagesArray = [
  "./driftwoodObstacleImageChoices/fishingNet.svg",
  "./driftwoodObstacleImageChoices/scubaDiver.svg",
  "./driftwoodObstacleImageChoices/tinCan.svg",
  "./driftwoodObstacleImageChoices/floatingBabe.svg",
  "./driftwoodFinal.svg",
];

function getRandomImage(array) {
  return array[Math.floor(Math.random() * array.length)];
}

let velocityX = 0;
let velocityY = 4;
const maxVelocityY = 30;

let isUpdating = false;
let gameOver = false;
let score = 0;

const scoreText = document.getElementById("score-text");
const gameOverText = document.getElementById("game-over-text");
const levelText = document.getElementById("level-text");
let currentLevel;
let level = 1;
let ellipse1;
let ellipse2;

// Background music
let musicSpeed = 1; // Initial music speed

let audio = new Audio("./Theme music.wav");
audio.loop = true;
let gameOverAudio = new Audio("./gameOverSound.wav");

let muteButton = document.getElementById("mute-button");
let audioClips = [audio, gameOverAudio];
let isMuted = false;
let soundMutedIcon = "./soundMutedIcon.svg";
let muteButtonInfoPopup = document.getElementById("infoPopup2");

function updateMuteButtonIcon() {
  if (isMuted) {
    muteButton.style.backgroundImage = `url(${soundMutedIcon})`;
    muteButtonInfoPopup.innerHTML = "Un-mute Sound";
    toolTip2.innerHTML = "Un-mute Sound";
  } else {
    muteButton.style.backgroundImage = "";
    muteButtonInfoPopup.textContent = "Mute Sound";
    toolTip2.textContent = "Mute Sound";
  }
}

function toggleSound() {
  isMuted = !isMuted;
  audioClips.forEach((audioClip) => {
    audioClip.muted = isMuted;
  });
  updateMuteButtonIcon();
}

let isColliding = false;
const maxMusicSpeed = 2;
let currentMusicSpeed = 1; // Variable to store the current music speed

function playMusic(play) {
  if (play) {
    if (audio && audio.readyState >= 2 && audio.paused) {
      audio.currentTime = 0;
      audio.playbackRate = Math.min(musicSpeed, maxMusicSpeed);
      console.log("Setting playback rate:", audio.playbackRate);
      audio.play().catch((error) => console.error("Audio play error:", error));
    } else {
      audio.playbackRate = Math.min(musicSpeed, maxMusicSpeed);
      console.log("Setting playback rate:", audio.playbackRate);
    }
  } else {
    if (!audio.paused) {
      audio.pause();
    }
  }
}

let previousLevel = 0;

function musicSpeedIncrease(level) {
  if (level !== previousLevel) {
    musicSpeed += 0.1;
    if (musicSpeed > maxMusicSpeed) {
      musicSpeed = maxMusicSpeed;
    }
    previousLevel = level;
    console.log("Increase that music speed to:", musicSpeed);
  }
}

window.onload = function () {
  adjustBoardProperties();
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");
  context.globalCompositeOperation = "destination-over";

  gameOverOverlay.style.display = "block";

  welcomeText.innerHTML = "Happy Swimming!";

  // fishermanImg = new Image();
  // fishermanImg.src = "./fishermanCharacter2.svg";
  // fishermanImg.onload = function () {
  //   context.drawImage(
  //     fishermanImg,
  //     fisherman.x,
  //     fisherman.y,
  //     fisherman.width,
  //     fisherman.height
  //   );
  // };

  fliesImg = new Image();
  fliesImg.src = "./fliesImage.svg";

  // driftwoodImg = new Image();
  // driftwoodImg.src = randomDriftwoodImages;

  // beaverImg = new Image();
  // beaverImg.src = randomBeaverImages;

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
  fliesManager();
  currentLevel = levelCalculation(count);
}; //end of onload

function updateHighscore() {
  let currentHighscore = getHighscore();

  if (score > currentHighscore) {
    localStorage.setItem("highScoreText", score);
  }
}
function getHighscore() {
  return parseInt(localStorage.getItem("highScoreText")) || 0;
}

function drawScores() {
  getHighscore();
  updateHighscore();

  scoreText2.innerHTML = `Score: ${score}`;
  hightscoreText.innerHTML = `High Score: ${getHighscore()}`;
}

function adjustBoardProperties() {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let container = document.getElementById("container");
  let textLayerBoardDiv = document.getElementById("text-layer-board-div");
  let textLayer = document.getElementById("text-layer");
  let texts = document.getElementById("texts");
  let levelText = document.getElementById("level-text");
  let scoreText = document.getElementById("score-text");
  let gameOverText = document.getElementById("game-over-text");
  let jumpPara = document.getElementById("jump-para");
  let buttonDiv = document.getElementById("button-div");
  let jumpIcon1 = document.getElementById("jump-icon-1");
  let jumpIcon2 = document.getElementById("jump-icon-2");
  let jumpIcon3 = document.getElementById("jump-icon-3");
  let muteButton = document.getElementById("mute-button");
  let instructionsButton = document.getElementById("instructions-button");

  let body = document.querySelector("body");
  let jumpIconDiv = document.getElementById("jump-icon-div");
  let overlay = document.getElementById("overlay");
  let touchScreenButtonDiv = document.getElementById("touchScreenDiv");
  let playGameButtonLabel = document.getElementById("play-game-button-label");
  let heading1 = document.getElementById("heading1");
  let instructionsWindow = document.getElementById("instructionsWindow");
  let infoPopup = document.querySelector(".popup");

  if (windowWidth < windowHeight) {
    showLabelsButton.style.display = "block";
    muteButtonInfoPopup.style.top = "-10%";
    muteButtonInfoPopup.style.left = "45%";
    muteButtonInfoPopup.style.font = "2.5vw 'Orbitron', sans-serif";
    infoPopup.style.top = "-10%";
    infoPopup.style.left = "-10%";
    infoPopup.style.font = "2.5vw 'Orbitron', sans-serif";
    instructionsWindow.style.width = "100vw";
    instructionsWindow.style.height = "100%";
    instructionsWindow.style.left = "0%";
    heading1.style.fontSize = "12vw";
    playGameButtonLabel.style.display = "none";
    touchScreenDiv.style.display = "grid";
    gameOverOverlay.style.height = "90%";
    gameOverOverlay.style.width = "80%";
    gameOverOverlay.style.margin = "-70px 0px 0px 0px";
    gameOverOverlay.style.padding = "5px 5px 5px 5px";
    welcomeText.style.fontSize = "7vw";
    scoreText2.style.fontSize = "6vw";
    hightscoreText.style.fontSize = "6vw";
    playGameButton.style.fontSize = "6.5vw";
    playGameButtonLabel.style.fontSize = "4vw";
    overlay.style.fontSize = "5vw";
    jumpIconDiv.style.marginTop = "0px";
    jumpIconDiv.style.height = "100%";
    body.style.height = "auto";
    body.style.width = "100%";
    board.style.width = "100%";
    board.style.height = "auto";
    boardDiv.style.alignItems = "none";
    boardDiv.style.width = "90%";
    container.style.height = "auto";
    container.style.width = "90%";
    textLayerBoardDiv.style.flexDirection = "column";
    textLayerBoardDiv.style.alignItems = "none";
    textLayerBoardDiv.style.width = "100%";
    textLayerBoardDiv.style.height = "auto";
    textLayerBoardDiv.style.paddingBottom = "10%";
    textLayerBoardDiv.style.marginBottom = "10%";
    textLayer.style.width = "90%";
    textLayer.style.height = "auto";
    textLayer.style.paddingBottom = "0px";
    textLayer.style.flexDirection = "column-reverse";
    texts.style.height = "auto";
    texts.style.width = "100%";
    texts.style.display = "grid";
    texts.style.gridTemplateRows = "repeat(1, 1fr)";
    texts.style.gridTemplateColumns = "repeat(2, 1fr)";
    texts.style.rowGap = "0px";
    texts.style.columnGap = "0px";
    buttonDiv.style.marginTop = "0px";
    buttonDiv.style.marginBottom = "0px";
    buttonDiv.style.height = "auto";
    buttonDiv.style.width = "100%";
    buttonDiv.style.display = "grid";
    buttonDiv.style.gridTemplateRows = "repeat(1, 2fr)";
    buttonDiv.style.gridTemplateColumns = "repeat(2, 2fr)";
    buttonDiv.style.rowGap = "0px";
    buttonDiv.style.columnGap = "0px";
    buttonDiv.style.flexDirection = "row";
    levelText.style.fontSize = "5vw";
    scoreText.style.fontSize = "5vw";
    gameOverText.style.display = "none";
    jumpPara.style.fontSize = "5vw";
    jumpPara.style.marginBottom = "0";
    jumpIcon1.style.width = "15vw";
    jumpIcon2.style.width = "15vw";
    jumpIcon3.style.width = "15vw";
    muteButton.style.fontSize = "4vw";
    muteButton.style.height = "15vw";
    instructionsButton.style.fontSize = "4vw";
    instructionsButton.style.height = "15vw";
  } else if (windowWidth > windowHeight) {
    toolTip1.style.display = "none";
    toolTip2.style.display = "none";
    toolTip3.style.display = "none";
    toolTip4.style.display = "none";
    toolTip5.style.display = "none";
    toolTip6.style.display = "none";
    toolTip7.style.display = "none";
    showLabelsButton.style.display = "";
    muteButtonInfoPopup.style.top = "";
    muteButtonInfoPopup.style.left = "";
    muteButtonInfoPopup.style.font = "";
    infoPopup.style.top = "";
    infoPopup.style.left = "";
    infoPopup.style.font = "";
    instructionsWindow.style.width = "";
    instructionsWindow.style.height = "";
    instructionsWindow.style.left = "";
    heading1.style.fontSize = "";
    playGameButtonLabel.style.display = "";
    touchScreenButtonDiv.style.display = "none";
    gameOverOverlay.style.height = "";
    gameOverOverlay.style.width = "";
    gameOverOverlay.style.margin = "";
    gameOverOverlay.style.padding = "";
    welcomeText.style.fontSize = "";
    scoreText2.style.fontSize = "";
    hightscoreText.style.fontSize = "";
    playGameButton.style.fontSize = "";
    playGameButtonLabel.style.fontSize = "";
    overlay.style.fontSize = "";
    jumpIconDiv.style.marginTop = "";
    jumpIconDiv.style.height = "";
    body.style.height = "";
    body.style.width = "";
    board.style.width = "";
    board.style.height = "";
    boardDiv.style.alignItems = "";
    boardDiv.style.width = "";
    container.style.height = "";
    container.style.width = "";
    textLayerBoardDiv.style.flexDirection = "";
    textLayerBoardDiv.style.alignItems = "";
    textLayerBoardDiv.style.width = "";
    textLayerBoardDiv.style.height = "";
    textLayerBoardDiv.style.paddingBottom = "";
    textLayerBoardDiv.style.marginBottom = "";
    textLayer.style.width = "";
    textLayer.style.height = "";
    textLayer.style.paddingBottom = "";
    textLayer.style.flexDirection = "";
    texts.style.height = "";
    texts.style.width = "";
    texts.style.display = "";
    texts.style.gridTemplateRows = "";
    texts.style.gridTemplateColumns = "";
    texts.style.rowGap = "";
    texts.style.columnGap = "";
    buttonDiv.style.marginTop = "";
    buttonDiv.style.marginBottom = "";
    buttonDiv.style.height = "";
    buttonDiv.style.width = "";
    buttonDiv.style.display = "";
    buttonDiv.style.gridTemplateRows = "";
    buttonDiv.style.gridTemplateColumns = "";
    buttonDiv.style.rowGap = "";
    buttonDiv.style.columnGap = "";
    buttonDiv.style.flexDirection = "";
    levelText.style.fontSize = "";
    scoreText.style.fontSize = "";
    gameOverText.style.display = "";
    jumpPara.style.fontSize = "";
    jumpPara.style.marginBottom = "";
    jumpIcon1.style.width = "";
    jumpIcon2.style.width = "";
    jumpIcon3.style.width = "";
    muteButton.style.fontSize = "";
    muteButton.style.height = "";
    instructionsButton.style.fontSize = "";
    instructionsButton.style.height = "";
  }
}

function drawLevel() {
  levelText.innerHTML = "Level<br>" + level;
}

function drawScore() {
  scoreText.innerHTML = "Score<br>" + score;
}

function drawGameOver() {
  if (!gameOver) {
    gameOverText.textContent = "";
  } else if (gameOver) {
    gameOverText.innerHTML = "Game <br> Over";
  }
}

function countObstacles() {
  if (frameCount !== lastCountFrame) {
    let count = 0;
    for (let i = 0; i < obstacleArray.length; i++) {
      if (
        obstacleArray[i].type === "beaver" ||
        obstacleArray[i].type === "driftwood"
      ) {
        count++;
      }
    }
    //console.log("Updated obstacleArray:", obstacleArray);
    console.log("Count of Obstacles:", count);
    lastCountFrame = frameCount;

    if (count % 10 === 0) {
      level = levelCalculation(count);
    }

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

function countJumps() {
  if (isSalmonJumping && jumpsAreAvailable) {
    const jumpIcon = document.querySelector(`#jump-icon-${jumpCount + 1}`);
    jumpIcon.style.display = "none";
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
  const jumpIcons = document.querySelectorAll(".jump-icon");
  jumpIcons.forEach((jumpIcon) => {
    jumpIcon.style.display = "inline-block";
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

let updateAnimation;

function update() {
  if (gameOver) {
    console.log("updating stopped");
    isUpdating = false;
    // Stop music

    return;
  }

  console.log("Updating...");
  if (!gameOver) {
    updateAnimation = requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    console.log(level);

    musicSpeedIncrease(level);
    playMusic(true);

    let salmonRect = {
      x: salmon.x - salmon.width / 8 + salmon.width / 2.6,
      y: salmon.y - salmon.height / 2 + salmon.height / 1.9,
      width: salmon.width / 2,
      height: salmon.height,
    };

    // context.drawImage(
    //   fishermanImg,
    //   fisherman.x,
    //   fisherman.y,
    //   fisherman.width,
    //   fisherman.height
    // );

    salmon.x += velocityX; //adds velocity to the salmon x position when the left and right arrow keys are pressed
    salmon.x = Math.max(salmon.x, 0); //sets the salmon x position to 0 if it is less than 0
    salmon.x = Math.min(salmon.x, board.width - salmon.width); //sets the salmon x position to the board width minus the salmon width if it is greater than the board width minus the salmon width

    context.drawImage(
      salmonImg,
      salmon.x,
      salmon.y,
      salmon.width,
      salmon.height
    );

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
    } //checks if the salmon x position is greater than the board width and sets gameOver to true if it is.

    for (let i = 0; i < fliesArray.length; i++) {
      let flies = fliesArray[i];
      flies.y += velocityY; //
      flies.hidden = false;

      if (
        !flies.eaten &&
        flies.x + flies.width > salmon.x &&
        flies.x < salmon.x + salmon.width &&
        flies.y + flies.height > salmon.y &&
        flies.y < salmon.y + salmon.height
      ) {
        flies.eaten = true;
        flies.hidden = true;
        score += 5;
      }
      if (!flies.eaten) {
        flies.hidden = false;
        context.drawImage(
          flies.img,
          flies.x,
          flies.y,
          flies.width,
          flies.height
        );
      }
    }

    for (let i = 0; i < obstacleArray.length; i++) {
      let obstacle = obstacleArray[i];
      obstacle.y += velocityY; //
      // if (
      //   obstacle.x + obstacle.width > fisherman.x &&
      //   obstacle.x < fisherman.x + fisherman.width &&
      //   obstacle.y + obstacle.height > fisherman.y &&
      //   obstacle.y < fisherman.y + fisherman.height - 80
      // ) {
      //   obstacle.hidden = true;
      // } else {
      //   obstacle.hidden = false;
      // }

      // if (!obstacle.hidden) {
      context.drawImage(
        obstacle.img,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );

      moveBeaverFaster(i);

      let obstacleRect = {
        x: obstacle.x + obstacle.width / 3,
        y: obstacle.y + obstacle.height - 12,
        width: obstacle.width / 3,
        height: obstacle.height / 8,
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
      ); //draws the ellipse around the obstacle
      context.fill();
      context.closePath();

      context.fillStyle = "rgba(255, 0, 0, 0)";
      context.beginPath();
      context.fillStyle = "rgba(255, 0, 0, 0)";
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
      } //checks if the obstacle has passed the salmon and adds 1 to the score if it has.

      //if (score === 25) {
      //createIntermediateObstacles();

      if (
        detectEllipseEllipseCollision(salmon, obstacle) ||
        detectRectangleRectangleCollision(salmonRect, obstacleRect)
      ) {
        gameOver = true;
        gameOverLogic();
      }
    }

    if (gameOver && !musicStopped) {
      playMusic(false);
      musicStopped = true;
    }

    if (!gameOver) {
      musicStopped = false;
    }

    frameCount++;
    countObstacles();
    drawLevel();
    drawScore();
    drawGameOver();
    countJumps();
    jumpLimit();
    obstacleSpeedIncrease(level);

    //gameOverLogic(salmonRect, obstacleArray);

    document.addEventListener("keydown", moveSalmon);
  }
} //end of update function

function moveBeaverFaster(i) {
  if (obstacleArray[i].type === "beaver" && level <= 5) {
    obstacleArray[i].y += velocityY * 0.2;
  } else if (obstacleArray[i].type === "beaver" && level > 5 && level <= 10) {
    obstacleArray[i].y += velocityY * 0.3;
  } else if (obstacleArray[i].type === "beaver" && level > 10 && level <= 15) {
    obstacleArray[i].y += velocityY * 0.4;
  } else if (obstacleArray[i].type === "beaver" && level > 15 && level <= 20) {
    obstacleArray[i].y += velocityY * 0.5;
  } else if (obstacleArray[i].type === "beaver" && level > 20 && level <= 25) {
    obstacleArray[i].y += velocityY * 0.6;
  } else if (obstacleArray[i].type === "beaver" && level > 25) {
    obstacleArray[i].y += velocityY * 0.7;
  }
}

function renderFlies(fliesType) {
  if (fliesType === "flies") {
    let randomFliesY = -(Math.random() * (board.height - fliesHeight) * 0.5);
    let randomFliesX = Math.random() * (board.width - fliesWidth);
    let newFlies = {
      type: "flies",
      img: fliesImg,
      x: randomFliesX,
      y: randomFliesY,
      width: fliesWidth * 2,
      height: fliesHeight / 1.5,
      passed: false,
    };

    let isOverlapping = fliesArray.some((existingFlies) => {
      return checkFliesProximity(newFlies, existingFlies);
    });

    if (!isOverlapping) {
      fliesArray.push(newFlies);
    }
  }
}

function getRandomXPositionOfFlies(fliesWidth) {
  let randomX = Math.random() * (board.width - fliesWidth); //generates a random x position
  let proximityThreshold = 100; //sets the proximity threshold to 100 pixels between the new obstacle and existing obstacles

  while (
    fliesArray.some((flies) => Math.abs(flies.x - randomX) < proximityThreshold)
  ) {
    randomX = Math.random() * (board.width - fliesWidth);
  } //checks if the random x position is close to an existing obstacle and generates a new random x position if it is.

  return randomX; //returns the random x position
}

function checkFliesProximity(newFlies, existingFlies) {
  let proximityThreshold = 100;

  return (
    newFlies.x < existingFlies.x + existingFlies.width + proximityThreshold &&
    newFlies.x + newFlies.width + proximityThreshold > existingFlies.x &&
    newFlies.y < existingFlies.y + existingFlies.height + proximityThreshold &&
    newFlies.y + newFlies.height + proximityThreshold > existingFlies.y
  );
}

function fliesManager() {
  if (gameOver) {
    return;
  }

  setInterval(renderFlies, 8000, "flies"); //creates a new driftwood every 500ms
}

function renderObstacles(obstacleType) {
  if (obstacleType === "driftwood") {
    let randomDriftwoodImagesSrc = getRandomImage(group2ImagesArray);
    let randomDriftWoodImages = new Image();
    randomDriftWoodImages.src = randomDriftwoodImagesSrc;
    let randomDriftwoodY = -(
      Math.random() *
      (board.height - obstacleHeight) *
      0.5
    );
    let randomDriftwoodX = Math.random() * (board.width - obstacleWidth);
    let driftwood = {
      type: "driftwood",
      img: randomDriftWoodImages,
      x: randomDriftwoodX,
      y: randomDriftwoodY,
      width: obstacleWidth * 2,
      height: obstacleHeight / 1.5,
      passed: false,
    };
    if (
      randomDriftwoodImagesSrc ===
      "./driftwoodObstacleImageChoices/floatingBabe.svg"
    ) {
      driftwood = {
        type: "driftwood",
        img: randomDriftWoodImages,
        x: randomDriftwoodX,
        y: randomDriftwoodY,
        width: obstacleWidth * 3,
        height: obstacleHeight * 1.05,
        passed: false,
      };
    }
    if (
      randomDriftwoodImagesSrc ===
      "./driftwoodObstacleImageChoices/scubaDiver.svg"
    ) {
      driftwood = {
        type: "driftwood",
        img: randomDriftWoodImages,
        x: randomDriftwoodX,
        y: randomDriftwoodY,
        width: obstacleWidth / 1.05,
        height: obstacleHeight / 1.6,
        passed: false,
      };
    }

    let isOverlapping = obstacleArray.some((obstacle) => {
      return checkObstacleProximity(driftwood, obstacle);
    });

    if (!isOverlapping) {
      obstacleArray.push(driftwood);
    }
    //console.log("Updated obstacleArray:", obstacleArray);
  } else if (obstacleType === "beaver") {
    let randomBeaverImagesSrc = getRandomImage(group1ImagesArray);
    let randomBeaverImages = new Image();
    randomBeaverImages.src = randomBeaverImagesSrc;
    let randomBeaverY = -(
      Math.random() *
      (board.height - obstacleHeight) *
      0.5
    );
    let randomBeaverX = Math.random() * (board.width - obstacleWidth);
    let beaver = {
      type: "beaver",
      img: randomBeaverImages,
      x: randomBeaverX,
      y: randomBeaverY,
      width: obstacleWidth / 1.1,
      height: obstacleHeight / 0.8,
      passed: false,
    };

    if (
      randomBeaverImagesSrc === "./beaverObstacleImageChoices/boatFisherman.svg"
    ) {
      beaver = {
        type: "beaver",
        img: randomBeaverImages,
        x: randomBeaverX,
        y: randomBeaverY,
        width: obstacleWidth * 1.15,
        height: obstacleHeight * 2.22,
        passed: false,
      };
    }
    if (randomBeaverImagesSrc === "./beaverObstacleImageChoices/carTire.svg") {
      beaver = {
        type: "beaver",
        img: randomBeaverImages,
        x: randomBeaverX,
        y: randomBeaverY,
        width: obstacleWidth * 1.15,
        height: obstacleHeight,
        passed: false,
      };
    }

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
  let randomX = Math.random() * (board.width - obstacleWidth); //generates a random x position
  let proximityThreshold = 100; //sets the proximity threshold to 100 pixels between the new obstacle and existing obstacles

  while (
    obstacleArray.some(
      (obstacle) => Math.abs(obstacle.x - randomX) < proximityThreshold
    )
  ) {
    randomX = Math.random() * (board.width - obstacleWidth);
  } //checks if the random x position is close to an existing obstacle and generates a new random x position if it is.

  return randomX; //returns the random x position
}

function checkObstacleProximity(newObstacle, existingObstacle) {
  let proximityThreshold = 100;

  return (
    newObstacle.x <
      existingObstacle.x + existingObstacle.width + proximityThreshold &&
    newObstacle.x + newObstacle.width + proximityThreshold >
      existingObstacle.x &&
    newObstacle.y <
      existingObstacle.y + existingObstacle.height + proximityThreshold &&
    newObstacle.y + newObstacle.height + proximityThreshold > existingObstacle.y
  );
} //checks if the new obstacle is close to an existing obstacle

function obstacleManager() {
  if (gameOver) {
    return;
  }

  setInterval(renderObstacles, 500, "driftwood"); //creates a new driftwood every 500ms
  setInterval(renderObstacles, 500, "beaver"); //creates a new beaver every 500ms
}

let isSalmonJumping = false;

let jumpHeight = 40;
let originalY = salmon.y;
let isJumpInProgress = false;
let isFallInProgress = false;
function fall() {
  isFallInProgress = true;

  setTimeout(function () {
    isSalmonJumping = false;
    salmon.y = salmon.y + 40;
    isJumpInProgress = false;
    isColliding = false;
  }, 1000);
}

function jump() {
  if (
    isJumpInProgress ||
    isFallInProgress ||
    !jumpsAreAvailable ||
    isJumpRenewalInProgress
  ) {
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

function obstacleSpeedIncrease(level) {
  if (level) {
    velocityY += 0.02;

    if (velocityY > maxVelocityY) {
      velocityY = maxVelocityY;
    }
  }
  if (velocityY >= maxVelocityY) {
    board.style.boxShadow = "0px 0px 30px 30px lightSalmon";
    jumpsAreAvailable = false;
    isSalmonJumping = false;
    isJumpInProgress = false;
    isFallInProgress = false;
    overlay.style.visibility = "visible";
  } else {
    board.style.boxShadow = "none";
    overlay.style.visibility = "hidden";
  }
}

function handleSalmonVelocity(e, leftVelocity, rightVelocity) {
  if (e.code == "ArrowLeft") {
    velocityX = leftVelocity;
  } else if (e.code == "ArrowRight") {
    velocityX = rightVelocity;
  }
}

function handleSalmonDriftVelocity() {
  velocityX = velocityX * 0.65;
}

function moveSalmon(e) {
  if (velocityY > 0 && velocityY <= 10) {
    handleSalmonVelocity(e, -8, 8);
    handleSalmonDriftVelocity();
  } else if (velocityY > 10 && velocityY <= 15) {
    handleSalmonVelocity(e, -12, 12);
    handleSalmonDriftVelocity();
  } else if (velocityY > 15 && velocityY <= 20) {
    handleSalmonVelocity(e, -16, 16);
    handleSalmonDriftVelocity();
  } else if (velocityY > 20 && velocityY <= 25) {
    handleSalmonVelocity(e, -20, 20);
    handleSalmonDriftVelocity();
  } else if (velocityY > 25 && velocityY <= maxVelocityY) {
    handleSalmonVelocity(e, -24, 24);
    handleSalmonDriftVelocity();
  }
  if (e.code === "Space") {
    jump();
  }
  if (e.code === "KeyS") {
    velocityY = maxVelocityY;
  }
  if (salmon.x < 0) {
    salmon.x = 0;
  } else if (salmon.x > board.width - salmon.width) {
    salmon.x = board.width - salmon.width;
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
  if (
    rectangle1.x < rectangle2.x + rectangle2.width &&
    rectangle1.x + rectangle1.width > rectangle2.x &&
    rectangle1.y < rectangle2.y + rectangle2.height &&
    rectangle1.y + rectangle1.height > rectangle2.y
  ) {
    isColliding = true;
    isUpdating = false;
    gameOver = true;
    gameOverLogic();
    console.log("Rectangle Collision detected");
  }
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
    let dx =
      ellipse1.x + ellipse1.width / 2 - (ellipse2.x + ellipse2.width / 2);
    let dy =
      ellipse1.y + ellipse1.height / 2 - (ellipse2.y + ellipse2.height / 2);
    let distance = Math.sqrt(dx * dx + dy * dy);

    isColliding = distance < ellipse1.width / 2 + ellipse2.width / 2;
    if (isColliding) {
      console.log("Ellipse Collision detected 1");
      gameOver = true;
      gameOverLogic();
      isUpdating = false;
    }
    return isColliding;
  } else {
    // Check for collisions during the first and second jump phases
    if (!isJumpInProgress && !isFallInProgress) {
      let dx =
        ellipse1.x + ellipse1.width / 2 - (ellipse2.x + ellipse2.width / 2);
      let dy =
        ellipse1.y + ellipse1.height / 2 - (ellipse2.y + ellipse2.height / 2);
      let distance = Math.sqrt(dx * dx + dy * dy);

      isColliding = distance < ellipse1.width / 2 + ellipse2.width / 2;
      if (isColliding) {
        console.log("Ellipse Collision detected 2");
        isUpdating = false;
      }
      return isColliding;
    }
  }
}

function noCollision() {
  if (!isFallInProgress) {
    isColliding = false;
  }
}

const instructionsButton = document.getElementById("instructions-button");
const instructionsWindow = document.getElementById("instructionsWindow");
const closeInstructionsButton = document.getElementById(
  "closeInstructionsButton"
);

instructionsButton.addEventListener("click", showInstructions);
closeInstructionsButton.addEventListener("click", closeInstructions);

function showInstructions() {
  instructionsWindow.style.display = "block";
}

function closeInstructions() {
  instructionsWindow.style.display = "none";
}

function gameOverLogic() {
  if (gameOver) {
    gameOverAudio.currentTime = 0;
    gameOverAudio.play();
    gameOverAudio.volume = 0.2;
    gameOverAudio.loop = false;

    playMusic(false);
    musicStopped = true;

    drawScores();

    gameOverOverlay.style.display = "block";
    welcomeText.innerHTML = "Game Over!<br> Good Swimming!";
    playGameButton.innerHTML = "Play Again";

    isUpdating = false;
    update(false);
    console.log("game over logic");
  }
}

function restartGame() {
  cancelAnimation();

  gameOver = false;
  score = 0;
  level = 1;
  velocityX = 0;
  velocityY = 4;
  jumpCount = 0;
  jumpsAreAvailable = true;
  isJumpRenewalInProgress = false;
  isJumpInProgress = false;
  isFallInProgress = false;
  isColliding = false;
  resetJumpIcons();
  isSalmonJumping = false;
  gameOverOverlay.style.display = "none";
  obstacleArray = [];
  fliesArray = [];

  // fishermanX = 0;
  // fishermanY = 0;
  // fisherman.x = fishermanX;
  // fisherman.y = fishermanY;

  salmonX = boardWidth / 2.1;
  salmonY = boardHeight - salmonHeight;
  salmon.x = salmonX;
  salmon.y = salmonY;

  scoreText.innerHTML = "Score<br>" + score;
  levelText.innerHTML = "Level<br>" + level;
  gameOverText.textContent = "";

  board.style.boxShadow = "none";

  isUpdating = false;
  update();
  playMusic(true);
  musicSpeed = 1;
  elapsedTime = 0;
}

function restartDuringGame() {
  if (!gameOver) {
    gameOverAudio.pause();
    playMusic(false);
    musicStopped = true;
    restartGame();
  }
}

function cancelAnimation() {
  isUpdating = false;
  cancelAnimationFrame(updateAnimation);
}

resizeObserver.observe(document.body);
window.addEventListener("resize", adjustBoardProperties);

document.addEventListener("keydown", handleKeyEvent);
document.addEventListener("keyup", handleKeyEvent);

function handleKeyEvent(e) {
  e.preventDefault();
  const keyCode = e.code;

  switch (keyCode) {
    case "ArrowLeft":
      isLeftKeyPressed = e.type === "keydown";
      moveSalmon(keyCode);

      if (!isLeftKeyPressed) handleSalmonDriftVelocity();
      break;
    case "ArrowRight":
      isRightKeyPressed = e.type === "keydown";
      moveSalmon(keyCode);

      if (!isRightKeyPressed) handleSalmonDriftVelocity();
      break;
    case "Space":
      isJumpKeyPressed = e.type === "keydown";
      jump();
      break;
    case "KeyS":
      isSKeyPressed = e.type === "keydown";
      moveSalmon(keyCode);
      break;
    case "KeyR":
      isRestartKeyPressed = e.type === "keydown";
      if (isRestartKeyPressed) {
        restartGame();
        restartDuringGame();
      }
      break;
  }
}

drawScores();

let isTouchLeftPressed = false;
let isTouchRightPressed = false;

function handleTouchStart(e) {
  e.preventDefault();
  switch (e.target.id) {
    case "touchScreenLeft":
      isTouchLeftPressed = true;
      moveSalmon({ code: "ArrowLeft" });
      break;
    case "touchScreenRight":
      isTouchRightPressed = true;
      moveSalmon({ code: "ArrowRight" });
      break;
    case "touchScreenJump":
      jump();
      break;
    case "touchScreenMaxSpeed":
      moveSalmon({ code: "KeyS" });
      break;
    case "touchScreenRestartGame":
      restartGame();
      restartDuringGame();
      break;
  }
}

function handleTouchEnd(e) {
  switch (e.target.id) {
    case "touchScreenLeft":
      isTouchLeftPressed = false;
      handleSalmonDriftVelocity();
      break;
    case "touchScreenRight":
      isTouchRightPressed = false;
      handleSalmonDriftVelocity();
      break;
    case "touchScreenJump":
      // No action needed for touch release
      break;
    case "touchScreenMaxSpeed":
      // No action needed for touch release
      break;
  }
}

document
  .getElementById("touchScreenLeft")
  .addEventListener("touchstart", handleTouchStart, { passive: false });
document
  .getElementById("touchScreenLeft")
  .addEventListener("touchend", handleTouchEnd);
document
  .getElementById("touchScreenRight")
  .addEventListener("touchstart", handleTouchStart, { passive: false });
document
  .getElementById("touchScreenRight")
  .addEventListener("touchend", handleTouchEnd);
document
  .getElementById("touchScreenJump")
  .addEventListener("touchstart", handleTouchStart, { passive: false });
document
  .getElementById("touchScreenMaxSpeed")
  .addEventListener("touchstart", handleTouchStart, { passive: false });
document
  .getElementById("touchScreenRestartGame")
  .addEventListener("click", handleTouchStart, { passive: false });
