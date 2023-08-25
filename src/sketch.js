Array.prototype.isEmpty = function () {
  if (this.length === 0) {
    return true;
  } else {
    return false;
  }
};

let canvas;

let gridSize = 2;

let padding =
  Math.abs(innerWidth - innerHeight) <= 100 ? 50 : innerWidth > 500 ? 30 : 10;

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
const colorPalettes = [
  {
    playerVisitedColor: [238, 3, 107],
    isVisitedColor: [238, 3, 107, 100],
    targetColor: [238, 3, 107],
  },
  {
    playerVisitedColor: [69, 14, 255],
    isVisitedColor: [69, 14, 255, 100],
    targetColor: [69, 14, 255],
  },
  {
    playerVisitedColor: [255, 50, 26],
    isVisitedColor: [255, 50, 26, 100],
    targetColor: [255, 50, 26],
  },
  {
    playerVisitedColor: [255, 144, 27],
    isVisitedColor: [255, 144, 27, 100],
    targetColor: [255, 144, 27],
  },
  {
    playerVisitedColor: [1, 117, 98],
    isVisitedColor: [2, 181, 159, 100],
    targetColor: [1, 117, 98],
  },
];

let color = colorPalettes[0];

let canvasColor = [220];
let wallsColor = [0];
let buildingColor = [255, 255, 255, 200];
let isVisitedColor = color.isVisitedColor;
let playerVisitedColor = color.playerVisitedColor;
let targetColor = color.targetColor;

let player, enemy;
let enemyKeys;
let builderCell;

let grid = [];
let stack = [];

setInterval(() => {
  enemyKeys = { ...defaultKeys };
  enemyKeys[
    ["UP", "LEFT", "DOWN", "RIGHT"][Math.floor(Math.random() * 4)]
  ] = true;
}, 500);

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
    if (gridSize > 21) {
      noLoop();
      alert("Congrats!🍾🎊🎉 You've Completed The Game!!");

      setTimeout(() => {
        gridSize = 2;
        replay();
        loop();
      }, 500);
    } else {
      noLoop();
      setTimeout(() => {
        gridSize++;
        if (player.lives < 3) {
          player.lives++;
        }
        replay();
        loop();
      }, 500);
    }
  }

  // check if enemy at targetCell; if move to random cell:
  if (gridSize >= 5) {
    if (enemy.location === targetCell) {
      enemy.at(grid[floor(random(1, grid.length))]);
    }
  }

  // check if player touched enemy:
  if (enemy.isReady && player.location === enemy.location) {
    player.at(grid[0]);
    player.visited = [player.location];
    player.lives--;

    if (player.lives <= 0) {
      noLoop();
      alert("You Lost!! 😔");

      setTimeout(() => {
        gridSize = 2;
        replay();
        player.respawn();
        loop();
      }, 500);
    }
  }

  // update texts:
  let text = "❤️".repeat(player.lives);
  document.querySelector(".lives-text").textContent = text;

  text =
    "Level " + String(gridSize - 1 < 10 ? `0${gridSize - 1}` : gridSize - 1);
  document.querySelector(".level-text").textContent = text;

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
  if (enemy.isReady) {
    enemy.draw();
  }

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
    if (gridSize > 5) {
      removeRandomWalls(floor(gridSize / 2));
    }

    if (gridSize > 5) {
      enemy = new Enemy({
        location: grid[floor(random(1, grid.length - 2))],
      });
      enemy.isReady = true;
    }

    player.isReady = true;
  }

  if (player.isReady) {
    handlePlayerMovement();

    // enemy movement:
    if (enemy.isReady) {
      handleEnemyMovement(enemyKeys, enemy);
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
    window.navigator.vibrate(200);
  }
};

rightBtn.onpointerdown = function () {
  if (player.isReady) {
    playerKeys = { ...defaultKeys };
    playerKeys.RIGHT = true;
    window.navigator.vibrate(200);
  }
};

upBtn.onpointerdown = function () {
  if (player.isReady) {
    playerKeys = { ...defaultKeys };
    playerKeys.UP = true;
    window.navigator.vibrate(200);
  }
};

downBtn.onpointerdown = function () {
  if (player.isReady) {
    playerKeys = { ...defaultKeys };
    playerKeys.DOWN = true;
    window.navigator.vibrate(200);
  }
};
