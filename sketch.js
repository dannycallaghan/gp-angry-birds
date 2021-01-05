// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var propeller;
var boxes = [];
var birds = [];
var bombs = [];
var ground;
var slingshotBird, slingshotConstraintRight, slingshotConstraintLeft;
var angle = 0;
var angleSpeed = 0;
var canvas;

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

let isGameStarted = false;
let isGameOver = false;
let isGameWon = false;
const timerAmount = 60;
let timer = timerAmount;

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

////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);

  engine = Engine.create();  // create an engine

  setupGround();

  setupPropeller();

  setupTower();

  setupSlingshot();

  setupMouseInteraction();
}
////////////////////////////////////////////////////////////
function draw() {
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

function explosion(engine) {
  const bodies = Matter.Composite.allBodies(engine.world);

  for (let i = 0; i < bodies.length; ++i) {
    const body = bodies[i];

    if (!body.isStatic && body.position.y >= 500) {
      const forceMagnitude = 0.05 * body.mass;

      Matter.Body.applyForce(body, body.position, {
        x:
          (forceMagnitude + Matter.Common.random() * forceMagnitude) *
          Matter.Common.choose([1, -1]),
        y: -forceMagnitude + Matter.Common.random() * -forceMagnitude
      });
    }
  }
}

function drawProgress () {
  push();
  fill(255, 255, 0);
	stroke(0);
	strokeWeight(2);
  textFont('Impact');
  textSize(60);
  textSize(30);
  textAlign(LEFT);
  text('ITEMS REMAINING:', 20, 50);
  textSize(60);
  textAlign(CENTER);
  text(boxes.length, 266, 60);
  pop();
}

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


function gameOver (success) {
  isGameOver = true;
  isGameStarted = false;
  isGameWon = success;
  resetGameState();
}

function resetGameState () {
  //var engine;
  propeller;
  boxes = [];
  birds = [];
  colors = [];
  ground;
  slingshotBird, slingshotConstraintRight, slingshotConstraintLeft;
  angle = 0;
  angleSpeed = 0;

  engine = Engine.create();

  setupGround();

  setupPropeller();

  setupTower();

  setupSlingshot();

  setupMouseInteraction();

  timer = timerAmount;
}


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
  text(`PRESS 'B' TO CREATE A BIRD`, textStartX, textStartY + 110);

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

function startGame () {
  isGameWon = false;
  isGameOver = false;
	//if (isGameOver) { return; };
	//resetGameState();
	isGameStarted = true;
	//renderCharacter(gameChar_x, gameChar_y, state);
}

////////////////////////////////////////////////////////////
//use arrow keys to control propeller
function keyPressed(){
  if (!isGameStarted && keyCode === 32) {
    console.warn('go');
    //isGameOver = false;
    startGame();
    return;
  }

  if (!isGameStarted) {
    return;
  }

  if (keyCode == LEFT_ARROW){
    if (Number(angleSpeed.toFixed(2)) === -0.01) {
      angleSpeed = 0;
    }
    angleSpeed = angleSpeed + 0.01;
  }
  else if (keyCode == RIGHT_ARROW){
    if (Number(angleSpeed.toFixed(2)) === 0.01) {
      angleSpeed = 0;
    }
    angleSpeed = angleSpeed - 0.01;
  }
}
////////////////////////////////////////////////////////////
function keyTyped(){
  if (!isGameStarted) {
    return;
  }

  //if 'b' create a new bird to use with propeller
  if (key==='b'){
    setupBird();
  }

  if (key==='m'){
    setupBomb();
  }

  //if 'r' reset the slingshot
  if (key==='r'){
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraintRight);
    removeFromWorld(slingshotConstraintLeft);
    setupSlingshot();
  }
}

window.mouseReleased = function () {
  console.warn('1');
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
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased(){
  console.warn('1');
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
