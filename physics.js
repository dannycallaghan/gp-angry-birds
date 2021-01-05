////////////////////////////////////////////////////////////////
function setupGround(){
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true,
    angle: 0
  });
  World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround(){
  push();
  fill(132, 96, 22);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller(){
  propeller = Bodies.rectangle(110, 480, 200, 15, {
    isStatic: true,
    angle: angle 
  });
  World.add(engine.world, [propeller]);
}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller(){
  push();
  fill(0, 0, 0);
  stroke(0);
  strokeWeight(2);
  rect(102, 420, 15, 160);
  fill(103, 62, 35);
  drawVertices(propeller.vertices);
  fill(249, 202, 101);
  ellipse(110, 480, 6, 6)
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, angleSpeed);
  angle += angleSpeed;
  pop();
}
////////////////////////////////////////////////////////////////
function setupBird(){
  var bird = Bodies.circle(mouseX, mouseY, birdImgSize,{
    friction: 0,
    restitution: 0.95
  });
  Matter.Body.setMass(bird, bird.mass*10);
  World.add(engine.world, [bird]);
  birds.push(bird);
}
////////////////////////////////////////////////////////////////
function drawBirds(){
  push();
  birds.forEach((bird, i) => {
    //drawVertices(bird.vertices);

    const pos = bird.position;
    //imageMode(CENTER);
    image(birdImg, pos.x, pos.y + 6, birdImgSize, birdImgSize);
    //drawConstraint(slingshotConstraintRight);
    //drawConstraint(slingshotConstraintLeft);

    if (isOffScreen(bird)) {
      removeFromWorld(bird);
      birds.splice(i, 1);
      i--;
    }
  });
  pop();
}

function setupBomb(){
  var bomb = Bodies.circle(mouseX, mouseY, bombImgSize,{
    friction: 0,
    restitution: 0.95
  });
  Matter.Body.setMass(bomb, bomb.mass*10);
  World.add(engine.world, [bomb]);
  bombs.push(bomb);
}
////////////////////////////////////////////////////////////////
function drawBombs(){
  push();
  bombs.forEach((bomb, i) => {
    //drawVertices(bird.vertices);

    const pos = bomb.position;
    //imageMode(CENTER);
    image(bombImg, pos.x, pos.y + 6, bombImgSize, bombImgSize);
    //drawConstraint(slingshotConstraintRight);
    //drawConstraint(slingshotConstraintLeft);

    if (isOffScreen(bomb)) {
      removeFromWorld(bomb);
      bombs.splice(i, 1);
      i--;
    }
  });
  pop();
}

////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower(){
  const rows = 6;
  const cols = 3;
  const boxSize = boxImgSize;
  const rowStart = height - 50;
  const colStart = width - ((cols) * 80);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const box = Bodies.rectangle(colStart + j * boxSize, rowStart - i * boxSize, boxSize, boxSize);
      World.add(engine.world, [box]);
      boxes.push(box);
    }
  }
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower(){
  push();
  boxes.forEach((box, i) => {
    const pos = box.position;
    imageMode(CENTER);
    if (!boxStoredImages[i]) {
      boxImg = boxImgs[(Math.floor(Math.random() * 3) + 1) - 1];
      boxStoredImages[i] = boxImg;
    }
    image(boxStoredImages[i], pos.x, pos.y, boxImgSize, boxImgSize);
    if (isOffScreen(box)) {
      removeFromWorld(box);
      boxes.splice(i, 1);
      boxStoredImages.splice(i, 1);
      i--;
    }
    if (!boxes.length) {
      gameOver(true);
    }
  });
  pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot(){
  slingshotBird = Bodies.circle(268, 208, shotImgSize, {
    friction: 0,
    restitution: 0.95
  });
  Matter.Body.setMass(slingshotBird, slingshotBird.mass * 10);

  slingshotConstraintRight = Constraint.create({
    pointA: { x: 268, y: 180 },
    bodyB: slingshotBird,
    pointB: { x: 0, y: 0 },
    stiffness: 0.01,
    damping: 0.0001
  });

  slingshotConstraintLeft = Constraint.create({
    pointA: { x: 178, y: 180 },
    bodyB: slingshotBird,
    pointB: { x: 0, y: 0 },
    stiffness: 0.01,
    damping: 0.0001
  });

  World.add(engine.world, [slingshotBird, slingshotConstraintRight, slingshotConstraintLeft]);
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot(){
  push();
  fill(255, 0, 0);
  drawVertices(slingshotBird);
  const pos = slingshotBird.position;

  image(slingshotImg, 130, 120, slingshotImgSize[0], slingshotImgSize[1]);

  imageMode(CENTER);

  //image(shotImg, pos.x, pos.y, shotImgSize, shotImgSize);

  
  drawConstraint(slingshotConstraintRight);
  drawConstraint(slingshotConstraintLeft);


  //const pos = bird.position;
  //imageMode(CENTER);
  //drawConstraint(slingshotConstraint);


  pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction(){
  console.warn(`setupMouseInteraction`);
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);
}
