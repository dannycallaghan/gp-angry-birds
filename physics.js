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
  fill(128);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller(){
  propeller = Bodies.rectangle(150, 480, 200, 15, {
    isStatic: true,
    angle: angle 
  });
  World.add(engine.world, [propeller]);
}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller(){
  push();
  drawVertices(propeller.vertices);
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, angleSpeed);
  angle += angleSpeed;
  pop();
}
////////////////////////////////////////////////////////////////
function setupBird(){
  var bird = Bodies.circle(mouseX, mouseY, 20,{
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
    drawVertices(bird.vertices);
    if (isOffScreen(bird)) {
      removeFromWorld(bird);
      birds.splice(i, 1);
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
  const boxSize = 80;
  const rowStart = height - 40;
  const colStart = width - ((cols + 1) * 80);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const box = Bodies.rectangle(colStart + j * boxSize, rowStart - i * boxSize, 80, 80);
      World.add(engine.world, [box]);
      boxes.push(box);
      colors = colors.concat([[0, random(40, 255), 0]]);
    }
  }
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower(){
  push();
  boxes.forEach((box, i) => {
    fill(...colors[i]);
    drawVertices(box.vertices);
    if (isOffScreen(box)) {
      removeFromWorld(box);
      boxes.splice(i, 1);
      i--;
    }
  });
  pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot(){
  slingshotBird = Bodies.circle(198, 208, 20, {
    friction: 0,
    restitution: 0.95
  });
  Matter.Body.setMass(slingshotBird, slingshotBird.mass * 10);

  slingshotConstraint = Constraint.create({
    pointA: { x: 198, y: 180 },
    bodyB: slingshotBird,
    pointB: { x: 0, y: 0 },
    stiffness: 0.01,
    damping: 0.0001
  });

  World.add(engine.world, [slingshotBird, slingshotConstraint]);
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot(){
  push();
  fill(255, 165, 0);
  drawVertices(slingshotBird.vertices);
  drawConstraint(slingshotConstraint);
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
