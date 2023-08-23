Array.prototype.isEmpty = function () {
  if (this.length === 0) {
    return true;
  } else {
    return false;
  }
};

let canvas, levelText;

let gridSize = 2;

let padding = innerWidth > 500 ? 30 : 10;

let gridWidth = Math.min(innerWidth, innerHeight);
gridWidth = Math.floor(gridWidth - (gridWidth * padding) / 100);

let w = gridWidth / gridSize;

let targetCell;

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
let buildingColor = [255, 255, 255, 200];
let isVisitedColor = [100, 200, 255, 150];
let playerVisitedColor = [255, 100, 200];

let player;
let builderCell;

let grid = [];
let stack = [];

function setup() {
  canvas = createCanvas(gridWidth, gridWidth);
  canvas.parent(document.querySelector(".game-panel"));
  // frameRate(5);

  levelText = createP("Level 01");
  levelText.parent(document.querySelector(".game-panel"));
  levelText.addClass("level-text");

  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  builderCell = grid[0];
  targetCell = grid[grid.length - 1];

  player = new Player({
    location: grid[0],
  });
}

function draw() {
  background(...canvasColor);

  // check if player completed maze:
  if (player.location === targetCell) {
    if (gridSize > 21) {
      noLoop();
    } else {
      gridSize++;
      w = gridWidth / gridSize;
    }

    // update game level:
    document.querySelector(".level-text").textContent =
      "Level " + String(gridSize - 1 < 10 ? `0${gridSize - 1}` : gridSize - 1);

    player.draw();

    grid = [];
    stack = [];

    for (let j = 0; j < gridSize; j++) {
      for (let i = 0; i < gridSize; i++) {
        let cell = new Cell(i, j);
        grid.push(cell);
      }
    }

    keys = { ...defaultKeys };
    builderCell = grid[0];
    targetCell = grid[grid.length - 1];
    player.at(grid[0]);
    player.clear();
  }

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

  // target cell/winning checkpoint:
  if (player.isReady) targetCell.highlight(playerVisitedColor);

  // draw cells:
  for (let cell of grid) {
    cell.draw(wallsColor);
  }

  // draw player:
  player.draw();

  // highlight cells:
  if (builderCell !== grid[0]) builderCell.highlight(isVisitedColor);

  stack.forEach((cell) => {
    cell.highlight(buildingColor);
  });

  // handle builders:
  builderCell.isVisited = true;
  let nextCell = builderCell.checkNeighbors();

  if (nextCell !== undefined) {
    removeWalls(builderCell, nextCell);
    stack.push(builderCell);
    builderCell = nextCell;
  } else if (!stack.isEmpty()) {
    builderCell = stack.pop();
  }

  // handle player:
  if (builderCell === grid[0]) {
    player.isReady = true;
    frameRate(30);
  }

  if (player.isReady) {
    handlePlayerMovement();
  }
}

// pc control:
window.addEventListener("keypress", (event) => {
  if (player.isReady) {
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
  }
});

// phone control:
const leftBtn = document.getElementById("LEFT");
const rightBtn = document.getElementById("RIGHT");
const upBtn = document.getElementById("UP");
const downBtn = document.getElementById("DOWN");

leftBtn.onpointerdown = function () {
  keys = { ...defaultKeys };
  keys.LEFT = true;
};

rightBtn.onpointerdown = function () {
  keys = { ...defaultKeys };
  keys.RIGHT = true;
};

upBtn.onpointerdown = function () {
  keys = { ...defaultKeys };
  keys.UP = true;
};

downBtn.onpointerdown = function () {
  keys = { ...defaultKeys };
  keys.DOWN = true;
};
