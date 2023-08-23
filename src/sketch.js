Array.prototype.isEmpty = function () {
  if (this.length === 0) {
    return true;
  } else {
    return false;
  }
};

let cols,
  rows,
  w = 40;

let defaultKeys = {
  UP: false,
  LEFT: false,
  DOWN: false,
  RIGHT: false,
};

let keys = {
  ...defaultKeys,
};

// colors:
let canvasColor = [220];
let wallsColor = [0];
let buildingColor = [255, 255, 255, 100];
let isVisitedColor = [100, 200, 255, 150];
let playerVisitedColor = [255, 100, 200];

let builder;
let player;

const grid = [];
const stack = [];
let canvas;

function setup() {
  canvas = createCanvas(400, 400);
  canvas.addClass("canvas");
  // frameRate(5);

  document.querySelector(".canvas").addEventListener("pointerdown", (event) => {
    const mouse = {
      x: event.clientX,
      y: event.clientY,
    };

    console.log(mouse, player.pos);

    if (mouse.y < player.pos.y) {
      keys = { ...defaultKeys };
      keys.UP = true;
    } else if (mouse.x < player.pos.x) {
      keys = { ...defaultKeys };
      keys.LEFT = true;
    } else if (mouse.y > player.pos.y) {
      keys = { ...defaultKeys };
      keys.DOWN = true;
    } else if (mouse.x > player.pos.x) {
      keys = { ...defaultKeys };
      keys.RIGHT = true;
    }
  });

  cols = floor(width / w);
  rows = floor(height / w);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  builder = grid[0];

  player = new Player({
    location: grid[0],
  });
}

function draw() {
  background(...canvasColor);

  // highlight isVisited cells:
  grid.forEach((cell) => {
    if (cell.isVisited) {
      cell.highlight(isVisitedColor);
    }
  });

  // highlight cells player visited:
  if (player.isReady) {
    player.visited.forEach((cell) => cell.highlight(playerVisitedColor));
  }

  // draw cells:
  for (let cell of grid) {
    cell.draw(wallsColor);
  }

  // draw player:
  player.draw();

  // highlight cells:
  if (builder !== grid[0]) builder.highlight(isVisitedColor);
  stack.forEach((cell) => {
    cell.highlight(buildingColor);
  });

  // handle builders:
  builder.isVisited = true;
  let nextCell = builder.checkNeighbors();

  if (nextCell !== undefined) {
    removeWalls(builder, nextCell);
    stack.push(builder);
    builder = nextCell;
  } else if (!stack.isEmpty()) {
    builder = stack.pop();
  }

  // handle player:
  if (builder === grid[0]) {
    player.isReady = true;
    frameRate(30);
  }

  if (player.isReady) {
    handlePlayerMovement();
  }
}

window.addEventListener("keypress", (event) => {
  if (event.key.toLocaleLowerCase() === "w") {
    keys = { ...defaultKeys };
    keys.UP = true;
  } else if (event.key.toLocaleLowerCase() === "a") {
    keys = { ...defaultKeys };
    keys.LEFT = true;
  } else if (event.key.toLocaleLowerCase() === "s") {
    keys = { ...defaultKeys };
    keys.DOWN = true;
  } else if (event.key.toLocaleLowerCase() === "d") {
    keys = { ...defaultKeys };
    keys.RIGHT = true;
  }
});
