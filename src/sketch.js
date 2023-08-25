Array.prototype.isEmpty = function () {
  if (this.length === 0) {
    return true;
  } else {
    return false;
  }
};

let canvas;

let gridSize = 5;

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

let playerKeys = {
  ...defaultKeys,
};

// colors:
let canvasColor = [220];
let wallsColor = [0];
let buildingColor = [255, 255, 255, 200];
let isVisitedColor = [100, 200, 255, 150];
let playerVisitedColor = [255, 100, 200];
let targetColor = [255, 100, 200];

let player, enemy;
let enemyKeys = { ...defaultKeys };
let builderCell;

let grid = [];
let stack = [];

function setup() {
  canvas = createCanvas(gridWidth, gridWidth);
  canvas.parent(document.querySelector(".game-panel"));
  // frameRate(1);

  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  builderCell = grid[0];
  targetCell = grid[grid.length - 1];

  // spawning player:
  player = new Player({
    location: grid[0],
  });

  // spawning enemies:
  enemy = new Enemy({
    location: grid[floor(random(1, grid.length - 2))],
  });

  // create player lives text:
  let livesText = createP("");
  livesText.parent(document.querySelector(".game-panel"));
  livesText.addClass("lives-text");

  // create level text:
  let levelText = createP("Level 01");
  levelText.parent(document.querySelector(".game-panel"));
  levelText.addClass("level-text");
}

function draw() {
  background(...canvasColor);

  // check if player completed maze:
  if (player.location === targetCell) {
    if (gridSize > 25) {
      noLoop();
    } else {
      gridSize++;
      replay();
    }

    document.querySelector(".level-text").textContent =
      "Level " + String(gridSize - 1 < 10 ? `0${gridSize - 4}` : gridSize - 1);
  }

  // update player lives text:
  let text = "";
  for (let p = 0; p < player.lives; p++) {
    text += "💖";
  }
  document.querySelector(".lives-text").textContent = text;

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
  if (player.isReady) targetCell.highlight(targetColor);

  // draw cells:
  for (let cell of grid) {
    cell.draw(wallsColor);
  }

  // draw player & enemies:
  player.draw();
  enemy.draw();

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
  if (!player.isReady && builderCell === grid[0]) {
    removeRandomWalls(floor(gridSize / 2));

    player.isReady = true;
    enemy.isReady = true;
  }

  if (player.isReady) {
    handlePlayerMovement();

    // enemy movement:
    if (
      (playerKeys.UP ||
        playerKeys.LEFT ||
        playerKeys.DOWN ||
        playerKeys.RIGHT) &&
      !(frameCount % 100)
    ) {
      enemyKeys = { ...defaultKeys };
      enemyKeys[
        ["UP", "LEFT", "DOWN", "RIGHT"][Math.floor(Math.random() * 4)]
      ] = true;
      handleEnemyMovement(enemyKeys, enemy);
    }

    // check if enemy at targetCell; if move to random cell:
    if (enemy.location === targetCell) {
      enemy.at(grid[floor(random(1, grid.length))]);
    }

    // check if player touched enemy:
    if (player.location === enemy.location) {
      if (player.lives <= 0) {
        gridSize = 5;
        replay();
      } else {
        player.at(grid[0]);
        player.visited = [player.location];
        player.lives--;
      }
    }
  }
}

// pc control:
window.addEventListener("keypress", (event) => {
  if (player.isReady) {
    if (event.key.toLocaleLowerCase() === "w") {
      playerKeys = { ...defaultKeys };
      playerKeys.UP = true;
    } else if (event.key.toLocaleLowerCase() === "a") {
      playerKeys = { ...defaultKeys };
      playerKeys.LEFT = true;
    } else if (event.key.toLocaleLowerCase() === "s") {
      playerKeys = { ...defaultKeys };
      playerKeys.DOWN = true;
    } else if (event.key.toLocaleLowerCase() === "d") {
      playerKeys = { ...defaultKeys };
      playerKeys.RIGHT = true;
    }
  }
});

// phone control:
const leftBtn = document.getElementById("LEFT");
const rightBtn = document.getElementById("RIGHT");
const upBtn = document.getElementById("UP");
const downBtn = document.getElementById("DOWN");

leftBtn.onpointerdown = function () {
  if (player.isReady) {
    playerKeys = { ...defaultKeys };
    playerKeys.LEFT = true;
  }
};

rightBtn.onpointerdown = function () {
  if (player.isReady) {
    playerKeys = { ...defaultKeys };
    playerKeys.RIGHT = true;
  }
};

upBtn.onpointerdown = function () {
  if (player.isReady) {
    playerKeys = { ...defaultKeys };
    playerKeys.UP = true;
  }
};

downBtn.onpointerdown = function () {
  if (player.isReady) {
    playerKeys = { ...defaultKeys };
    playerKeys.DOWN = true;
  }
};
