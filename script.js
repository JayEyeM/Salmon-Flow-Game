
//board
let board;
let boardWidth = 390;
let boardHeight = 480;
let context;

//fisherman
let fishermanWidth = 130;
let fishermanHeight = 250;
let fishermanX = 0;
let fishermanY = 0;
let fishermanImg;

let fisherman = {
  x : fishermanX,
  y : fishermanY,
  width : fishermanWidth,
  height : fishermanHeight
}

//salmon
let salmonWidth = 40;
let salmonHeight = 105;
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
let velocityX = 0; //salmon left and right speed
let velocityY = 4; //moving down speed
let gravity = 5;

let gameOver = false;
let score = 0;

window.onload = function(){
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //load fisherman image
  fishermanImg = new Image();
  fishermanImg.src = "./fishermanCharacter2.svg";
  fishermanImg.onload = function(){
  context.drawImage(fishermanImg, fisherman.x, fisherman.y, fisherman.width, fisherman.height);
  };

  //draw salmon
  context.fillStyle = "rgb(255, 0, 0)";
context.beginPath();
context.ellipse(salmon.x + salmon.width/2, salmon.y + salmon.height/2, salmon.width/2, salmon.height/2, 0, 0, 2 * Math.PI);
context.fill();
context.closePath();

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

  // draw fisherman image
  context.drawImage(fishermanImg, fisherman.x, fisherman.y, fisherman.width, fisherman.height);
  //salmon
  salmon.x += velocityX;
  salmon.x = Math.max(salmon.x, 0); // Limit the salmon's position to stay within the left edge of the board
  salmon.x = Math.min(salmon.x, board.width - salmon.width); // Limit the salmon's position to stay within the right edge of the board
  context.drawImage(salmonImg, salmon.x, salmon.y, salmon.width, salmon.height);

  //overlay shape onto salmon
  context.fillStyle = "rgb(255, 0, 0, 0.35)";
context.beginPath();
context.ellipse(salmon.x + salmon.width/2, salmon.y + salmon.height/2, salmon.width/2, salmon.height/2, 0, 0, 2 * Math.PI);
context.fill();
context.closePath();
  // Check if the salmon's position exceeds the right edge of the board
  if (salmon.x + salmon.width > board.width) {
    gameOver = true;
  }

  //obstacles
for (let i = 0; i < obstacleArray.length; i++){
  let obstacle = obstacleArray[i];
  obstacle.y += velocityY;
  context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

  // overlay shape onto obstacles
  context.fillStyle = "rgb(255, 0, 0, 0.35)";
  context.beginPath();
  context.ellipse(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2, obstacle.height/2, 0, 0, 2 * Math.PI);
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

  //clear obstacles
  while (obstacleArray.length > 0 && obstacleArray[0].y < -obstacleHeight) {
    obstacleArray.shift();
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
    width: obstacleWidth-5,
    height: obstacleHeight + 20,
    passed: false
  };
  obstacleArray.push(beaver);
}

function moveSalmon(e) {
  if (e.code == "ArrowLeft") {
    // swim left
    if (salmon.x - velocityX >= 0) {
      velocityX = -7;
    } else {
      velocityX = 0;
    }
  } else if (e.code == "ArrowRight") {
    // swim right
    if (salmon.x + salmon.width < board.width) {
      velocityX = 7;
    } else {
      salmon.x = board.width - salmon.width; // Set the position to the maximum allowed position
    }
  } else if (e.code == "Space") {
    // jump
    velocityY = 5;
  }
  
  // Limit the salmon's position to stay within the left edge of the board
  if (salmon.x < 0) {
    salmon.x = 0;
  }

  // reset game
  if (gameOver) {
    salmon.x = salmonX;
    obstacleArray = [];
    score = 0;
    gameOver = false;
  }
}


function detectCollision(ellipse1, ellipse2) {
  let dx = ellipse1.x + ellipse1.width / 2 - (ellipse2.x + ellipse2.width / 2);
  let dy = ellipse1.y + ellipse1.height / 2 - (ellipse2.y + ellipse2.height / 2);
  let distance = Math.sqrt(dx * dx + dy * dy);

  return distance <= ellipse1.width / 2 + ellipse2.width / 2 && distance <= ellipse1.height / 2 + ellipse2.height / 2;
}
document.addEventListener("keyup", function(e) {
  if (e.code == "ArrowLeft" || e.code == "ArrowRight") {
    // stop moving
    velocityX = 0;
  }
});