/**
 * Set up the ground body
 *
 * @return void.
 */
function setupGround(){
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true,
    angle: 0
  });
  World.add(engine.world, [ground]);
}

/**
 * Render ground
 *
 * @return void.
 */
function drawGround(){
  push();
  fill(128, 65, 33);
  drawVertices(ground.vertices);
  pop();
}

/**
 * Set up the propeller body
 *
 * @return void.
 */
function setupPropeller(){
  propeller = Bodies.rectangle(110, 480, 200, 15, {
    isStatic: true,
    angle: angle 
  });
  World.add(engine.world, [propeller]);
}

/**
 * Render propeller
 *
 * @return void.
 */
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

/**
 * Set up the bird body
 *
 * @return void.
 */
function setupBird(){
  var bird = Bodies.circle(mouseX, mouseY, birdImgSize / 2,{
    friction: 0,
    restitution: 0.95,
    label: 'Bird'
  });
  Matter.Body.setMass(bird, bird.mass*10);
  World.add(engine.world, [bird]);
  birds.push(bird);
}


/**
 * Rdner birds
 *
 * @return void.
 */
function drawBirds(){
  push();
  birds.forEach((bird, i) => {
    const pos = bird.position;
    imageMode(CENTER);
    image(birdImg, pos.x, pos.y, birdImgSize, birdImgSize);
    if (isOffScreen(bird)) {
      removeFromWorld(bird);
      birds.splice(i, 1);
      i--;
    }
  });
  pop();
}

/**
 * Set up the bomb body
 *
 * @return void.
 */
function setupBomb(){
  var bomb = Bodies.circle(mouseX, mouseY, bombImgSize / 2,{
    friction: 0,
    restitution: 0.95,
    label: 'Bomb'
  });
  Matter.Body.setMass(bomb, bomb.mass*10);
  World.add(engine.world, [bomb]);
  bombs.push(bomb);
  createdBombs++; // Keep track of how many bombs have been created
  explode(createdBombs);

  // Waits specified time then explodes bomb
  function explode (index) {
    setTimeout(() => {
      doExplode(engine, 0);
    }, bombTimer);
  }
}

/**
 * Render bomb
 *
 * @return void.
 */
function drawBombs(){
  push();
  bombs.forEach((bomb, i) => {
    const pos = bomb.position;
    imageMode(CENTER);
    image(bombImg, pos.x, pos.y, bombImgSize, bombImgSize);
    if (isOffScreen(bomb)) {
      removeFromWorld(bomb);
      // Remove from bombs array, but not createdBombs array - that's fixed
      bombs.splice(i, 1);
      i--;
    }
  });
  pop();
}

/**
 * Set up the tower body
 *
 * @return void.
 */
function setupTower(){
  const rows = 6;
  const cols = 3;
  const boxSize = boxImgSize;
  const rowStart = height - 50;
  const colStart = width - ((cols) * 80);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const box = Bodies.rectangle(colStart + j * boxSize, rowStart - i * boxSize, boxSize, boxSize, {
        label: 'Box'
      });
      World.add(engine.world, [box]);
      boxes.push(box);
    }
  }
}

/**
 * Render tower
 *
 * @return void.
 */
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

/**
 * Set up the slingshot body
 *
 * @return void.
 */
function setupSlingshot(){
  slingshotBird = Bodies.circle(268, 208, shotImgSize / 2, {
    friction: 0,
    restitution: 0.95,
    label: 'Angry Bird'
  });
  Matter.Body.setMass(slingshotBird, slingshotBird.mass * 10);

  // Add right constaint
  slingshotConstraintRight = Constraint.create({
    pointA: { x: 268, y: 180 },
    bodyB: slingshotBird,
    pointB: { x: 0, y: 0 },
    stiffness: 0.01,
    damping: 0.0001
  });

  // Add left constraint
  slingshotConstraintLeft = Constraint.create({
    pointA: { x: 178, y: 180 },
    bodyB: slingshotBird,
    pointB: { x: 0, y: 0 },
    stiffness: 0.01,
    damping: 0.0001
  });

  World.add(engine.world, [slingshotBird, slingshotConstraintRight, slingshotConstraintLeft]);
}

/**
 * Render slingshot
 *
 * @return void.
 */
function drawSlingshot(){
  const pos = slingshotBird.position;
  push();
  // Add slingshot image
  imageMode(CENTER);
  image(slingshotImg, 210, 350, slingshotImgSize[0], slingshotImgSize[1]);
  drawConstraint(slingshotConstraintRight);
  imageMode(CENTER);
  image(shotImg, pos.x, pos.y, shotImgSize, shotImgSize);
  drawConstraint(slingshotConstraintLeft);
  pop();
}

/**
 * Adds explosion effect
 *
 * @return void.
 */
function doExplode(engine, bomb) {
  const bodies = boxes; // Only move the boxes
  const bombPos = bombs[bomb] ? bombs[bomb].position : null;
  if (!bombPos) { return; }
  // Causes explosion
  function bang (item, power) {
    const forceMagnitude = power * item.mass;
    Matter.Body.applyForce(item, item.position, {
      x:
        (forceMagnitude + Matter.Common.random() * forceMagnitude) *
        Matter.Common.choose([1, -1]),
      y: -forceMagnitude + Matter.Common.random() * -forceMagnitude
    });
  }

  for (let i = 0; i < bodies.length; ++i) {
    const body = bodies[i];
    // Only explode boxes close enough to the bomb blast
    if (!body.isStatic && dist(body.position.x, body.position.y, bombPos.x, bombPos.y)  < 150) {
      bang(body, 0.05);
    }
  }

  // Also explode the bomb
  bang(bombs[0], 0.09);
}

/**
 * Adds mouse interactions
 *
 * @return void.
 */
function setupMouseInteraction(){
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

  // Don't allow the mouse drag event to work on anything but the slingshot
  // You shouldn't be able to drag boxes, birds, bombs, etc, or the game is pointless
  // Store the active element
  let activeElement;
  let mousedown = false;

  // Capture mousedown
  canvas.elt.addEventListener('mousedown', () => {
    mousedown = true;

  });

  // Capture mousemove
  canvas.elt.addEventListener('mousemove', (e) => {
    if (mousedown) {
      const query = Matter.Query.point(Matter.Composite.allBodies(engine.world), mouse.position)
      if (query.length) {
        // If it's something we shouldn't drag, make it static and store a reference to it
        if (query[0].label === 'Box' || query[0].label === 'Bomb' || query[0].label === 'Bird') {
          activeElement = query[0];
          activeElement.isStatic = true;
        }
      }
    }
  });

  // Capture mouseup
  canvas.elt.addEventListener('mouseup', () => {
    // Make it not static again
    if (activeElement && activeElement.isStatic !== 'undefined') {
      activeElement.isStatic = false;
    }
    mousedown = false;
  });
}
