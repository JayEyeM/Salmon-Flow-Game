
//board
let board;
let boardWidth = 390;
let boardHeight = 480;
let context;

//salmon
let salmonWidth = 60;
let salmonHeight = 100;
let salmonX = boardWidth/2.2;
let salmonY = boardHeight/1.28;
let salmonImg;

let salmon = {
  x : salmonX,
  y : salmonY,
  width : salmonWidth,
  height : salmonHeight
}

//obstacles
let obstacleArray = [];
let obstacleWidth = 50;
let obstacleHeight = 90; 
let obstacleX = 0;
let obstacleY = boardHeight - 550;

let driftwoodImg;
let beaverImg;

//physics
let velocityX = 4; //salmon left and right speed
let velocityY = 2; //moving down speed
let gravity = 0;

let gameOver = false;
let score = 0;

window.onload = function(){
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //draw salmon
  //context.fillStyle = "transparent";
  //context.fillRect(salmon.x, salmon.y, salmon.width, salmon.height);

  //load images
  salmonImg = new Image();
  salmonImg.src = "./finalSalmonCharacter.svg";
  salmonImg.onload = function(){
  context.drawImage(salmonImg, salmon.x, salmon.y, salmon.width, salmon.height);
  }

  driftwoodImg = new Image();
  driftwoodImg.src = "./driftwoodFinal.svg";

  beaverImg = new Image();
  beaverImg.src = "./beaverCharacter.svg";

  requestAnimationFrame(update);
  setInterval(placeObstacles, 5000);//every 1.5 seconds
  document.addEventListener("keydown", moveSalmon);
}

function update(){
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //salmon
  velocityX = velocityX;
  //salmon.x += velocityX;
  salmon.x = Math.max(salmon.x + velocityX, 0); //apply gravity to current salmon.x, limit the salmon.x to side of canvas.
  context.drawImage(salmonImg, salmon.x, salmon.y, salmon.width, salmon.height);

  if (salmon.x > board.width) {
    gameOver = true;
  }

  //obstacles
  for (let i = 0; i < obstacleArray.length; i++){
    let obstacle = obstacleArray[i];
    obstacle.y += velocityY;
    context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    if (!obstacle.passed && salmon.y > obstacle.Y + obstacle.height) {
      score += 1;
      obstacle.passed = true;
    }

    if (detectCollision(salmon, obstacle)) {
      gameOver = true;
    }
  }

  //clear obstacles
  while (obstacleArray.length > 0 && obstacleArray[0].y < -obstacleHeight) {
    obstacleArray.shift();//to remove first element from array
  }

  //score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 5, 90);
  }
}

function placeObstacles() {
  if (gameOver) {
    return;
  }

  let randomInterval = Math.random() * (4.5 - 2) + 1; // Random interval between 1 and 4.5 seconds
  setTimeout(placeObstacles, randomInterval * 4000); // Convert to milliseconds

  let randomDriftwoodY = -10; // Start at top of the board
  let randomDriftwoodX = Math.random() * (board.width - obstacleWidth);
  let driftwood = {
    img: driftwoodImg,
    x: randomDriftwoodX,
    y: randomDriftwoodY,
    width: obstacleWidth + 25,
    height: obstacleHeight - 45,
    passed: false
  };
  obstacleArray.push(driftwood);

  let openingSpace = board.width / 4;
  let minOpeningX = obstacleHeight + openingSpace;
  let maxOpeningX = board.width - obstacleWidth - openingSpace;
  let randomBeaverY = -10; // Start at top of the board
  let randomBeaverX = Math.random() * (maxOpeningX - minOpeningX) + minOpeningX;
  let beaver = {
    img: beaverImg,
    x: randomBeaverX,
    y: randomBeaverY,
    width: obstacleWidth,
    height: obstacleHeight + 20,
    passed: false
  };
  obstacleArray.push(beaver);
}

function moveSalmon(e) {
  if (e.code == "ArrowLeft") {
    //swim left
    velocityX = -7;
  } else if(e.code == "ArrowRight") {
      //swim right
      velocityX = 7;
  } else if (e.code == "Space") {
    //jump
    velocityY = 5;
  }
    //reset game
    if (gameOver) {
      salmon.x = salmonX;
      obstacleArray = [];
      score = 0;
      gameOver = false;
    }
  }



function detectCollision(a, b) {
  return a.y < b.y + b.height &&
        a.y + a.height > b.y &&
        a.x < b.x + b.width &&
        a.x + a.width > b.x; 
}

document.addEventListener("keyup", function(e) {
  if (e.code == "ArrowLeft" || e.code == "ArrowRight") {
    // stop moving
    velocityX = 0;
  }
});