// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

/**
 * Shortcuts
 */
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

/**
 * Game objects and settings
 */
let engine;
let propeller;
let boxes = [];
let birds = [];
let bombs = [];
let createdBombs = 0;
let ground;
let slingshotBird;
let slingshotConstraintRight;
let slingshotConstraintLeft;
let angle = 0;
let angleSpeed = 0;
let canvas;
const maxBombs = 3;
const bombTimer = 3000;
let isGameStarted = false;
let isGameOver = false;
let isGameWon = false;
const timerAmount = 60;
let timer = timerAmount;

/**
 * Images
 */
let bg;
let birdImg;
const birdImgSize = 60;
let shotImg;
const shotImgSize = 80;
let boxImgs = [];
const boxImgSize = 80;
let boxStoredImages = [];
let slingshotImg;
const slingshotImgSize = [185, 460];
let titleImg;
const titleImgSize = [500, 109];
let bombImg;
const bombImgSize = 60;

/**
 * P5 preload functionality
 *
 * @return void.
 */
function preload () {
  bg = loadImage('./images/background.png');
  birdImg = loadImage('./images/bird2.png');
  bombImg = loadImage('./images/bomb.png');
  slingshotImg = loadImage('./images/slingshot.png');
  shotImg = loadImage('./images/bird.png');
  boxImgs[0] = loadImage('./images/box1.png');
  boxImgs[1] = loadImage('./images/box2.png');
  boxImgs[2] = loadImage('./images/pig.png');
  titleImg = loadImage('./images/title.png');
}

/**
 * P5 setup functionality
 *
 * @return void.
 */
function setup () {
  canvas = createCanvas(1000, 600);
  engine = Engine.create();
  setupGround();
  setupPropeller();
  setupTower();
  setupSlingshot();
  setupMouseInteraction();
}

/**
 * P5 draw functionality
 *
 * @return void.
 */
function draw () {
  background(bg);

  Engine.update(engine);

  if (isGameStarted) {
    drawGround();
    drawPropeller();
    drawTower();
    drawBirds();
    drawBombs();
    drawSlingshot();
    drawTimer();
    drawProgress();
    return;
  }

  drawGameText();
}

/**
 * Draws the game progress - items remaining / bombs remaining
 *
 * @return void.
 */
function drawProgress () {
  push();
  textFont('Impact');
  fill(255, 255, 0);
	stroke(0);
	strokeWeight(2);
  textSize(30);
  textAlign(LEFT);
  text('BOXES/PIGS REMAINING:', 20, 50);
  textSize(60);
  textAlign(CENTER);
  text(boxes.length, 336, 60);
  textSize(30);
  textAlign(CENTER);
  text('BOMBS:', width / 2, 50);
  textSize(60);
  text(maxBombs - createdBombs, width / 2 + 70, 60);
  pop();
}

/**
 * Draws and keeps track of time remaining
 *
 * @return void.
 */
function drawTimer () {
  push();
  fill(255, 255, 0);
	stroke(0);
	strokeWeight(2);
  textFont('Impact');
  textSize(60);
  textSize(30);
  textAlign(RIGHT);
  text('TIME REMAINING:', width - 100, 50);
  textSize(60);
  textAlign(CENTER);
  text(timer, width - 60, 60);
  pop();
  if (frameCount % 60 == 0 && timer > 0) {
    timer --;
  }
  if (timer === 0) {
    gameOver(false);
  }
}

/**
 * Draws the text for the main game screen
 * 
 * @return void.
 */
function drawGameText () {
	push();

	fill(255, 255, 0);
	stroke(0);
	strokeWeight(4);
	textFont('Impact');

	// Start text
	const textStartX = width / 2;
	const textStartY = !isGameStarted && !isGameOver ? 320 : -2000;
	textSize(50);
	textAlign(CENTER);
	text('PRESS SPACEBAR TO START', textStartX, textStartY);
  textSize(26);
  fill(255);
	stroke(0);
	strokeWeight(4);
	text(`PRESS 'R' TO RESET SLINGSHOT`, textStartX, textStartY + 50);
  text(`PRESS LEFT AND RIGHT ARROWS TO SPIN PROPELLER`, textStartX, textStartY + 80);
  text(`PRESS 'V' TO CREATE A BIRD`, textStartX, textStartY + 110);
  text(`PRESS 'B' TO CREATE A BOMB`, textStartX, textStartY + 140);

  // Title image
  const titleImgX = width / 2;
	const titleImgY = !isGameStarted && !isGameOver ? 200 : -2000;
	imageMode(CENTER);
  image(titleImg, titleImgX, titleImgY, titleImgSize[0], titleImgSize[1]);

	// Game over text
	const textGameOverX = width / 2;
  const textGameOverY = isGameOver && !isGameStarted ? height / 2 - 50 : -2000;
  const textGameOver = isGameWon ? 'YOU WON!' : 'GAME OVER';
  fill(255, 0, 0);
	textSize(80);
  text(textGameOver, textGameOverX, textGameOverY);
  fill(255, 255, 0);
	stroke(0);
	strokeWeight(4);
  textSize(50);
	textAlign(CENTER);
  text('PRESS SPACEBAR TO TRY AGAIN', textGameOverX, textGameOverY + 80);
  textSize(26);
  fill(255);
	stroke(0);
	strokeWeight(4);
	text(`PRESS 'R' TO RESET SLINGSHOT`, textGameOverX, textGameOverY + 120);
  text(`PRESS LEFT AND RIGHT ARROWS TO SPIN PROPELLER`, textGameOverX, textGameOverY + 150);
  text(`PRESS 'B' TO CREATE A BIRD`, textGameOverX, textGameOverY + 180);

	pop();
}

/**
 * Sets the game to a finished state.
 * 
 * @param {boolean} success - Whether the user beat the game
 * 
 * @return void.
 */
function gameOver (success) {
  isGameOver = true;
  isGameStarted = false;
  isGameWon = success;
  resetGameState();
}

/**
 * Resets all the global vars and calls set up functions again ready for a new game
 * 
 * @return void.
 */
function resetGameState () {
  propeller;
  boxes = [];
  bombs = [];
  birds = [];
  createdBombs = 0;
  ground;
  slingshotBird, slingshotConstraintRight, slingshotConstraintLeft;
  angle = 0;
  angleSpeed = 0;
  timer = timerAmount;
  engine = Engine.create();

  setupGround();
  setupPropeller();
  setupTower();
  setupSlingshot();
  setupMouseInteraction();
}

/**
 * Starts a game
 * 
 * @return void.
 */
function startGame () {
  isGameWon = false;
  isGameOver = false;
	isGameStarted = true;
}

/**
 * p5 key pressed event - starts game and controls propeller
 * 
 * @return void.
 */
function keyPressed () {
  // Space bar - start game
  if (!isGameStarted && keyCode === 32) {
    startGame();
    return;
  }
  // Anything else, do nothing if the game hasn't started
  if (!isGameStarted) {
    return;
  }
  // Left arrow
  if (keyCode == LEFT_ARROW){
    if (Number(angleSpeed.toFixed(2)) === -0.01) {
      angleSpeed = 0;
    }
    angleSpeed = angleSpeed + 0.01;
  }
  // Right arrow
  else if (keyCode == RIGHT_ARROW){
    if (Number(angleSpeed.toFixed(2)) === 0.01) {
      angleSpeed = 0;
    }
    angleSpeed = angleSpeed - 0.01;
  }
}

/**
 * p5 key typed event - adds birds, bombs and resets slingshot
 * 
 * @return void.
 */
function keyTyped () {
  // Do nothing if game hasn't started
  if (!isGameStarted) {
    return;
  }
  // V - add a bird
  if (key==='v'){
    setupBird();
  }
  // B - add a bomb
  if (key==='b'){
    if (createdBombs < maxBombs) {
      setupBomb();
    }
  }
  // R - reset the slingshot
  if (key==='r'){
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraintRight);
    removeFromWorld(slingshotConstraintLeft);
    setupSlingshot();
  }
}

/**
 * Overrides the helper function of the same name so that we can have more than one constraint
 * 
 * @return void.
 */
window.mouseReleased = function () {
  // Do nothing if game hasn't started
  if (!isGameStarted) {
    return;
  }
  setTimeout(() => {
    slingshotConstraintRight.bodyB = null;
    slingshotConstraintRight.pointA = { x: 0, y: 0 };

    slingshotConstraintLeft.bodyB = null;
    slingshotConstraintLeft.pointA = { x: 0, y: 0 };
  }, 100);
}

//**********************************************************************
//**********************************************************************
//**********************************************************************
//**********************************************************************
//**********************************************************************
//**********************************************************************
//**********************************************************************
//**********************************************************************
//**********************************************************************

//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased(){
  setTimeout(() => {
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 };
  }, 100);
}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body){
  var pos = body.position;
  return (pos.y > height || pos.x<0 || pos.x>width);
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
  World.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
  push();
  var offsetA = constraint.pointA;
  var posA = {x:0, y:0};
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  var offsetB = constraint.pointB;
  var posB = {x:0, y:0};
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}
