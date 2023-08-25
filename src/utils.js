function replay() {
  // select random color:
  let color = random(colorPalettes);

  isVisitedColor = color.isVisitedColor;
  playerVisitedColor = color.playerVisitedColor;
  targetColor = color.targetColor;

  // change body color:
  document.body.style.backgroundColor = `rgba(${color.targetColor[0]}, ${color.targetColor[1]}, ${color.targetColor[2]}, 0.2)`;

  w = gridWidth / gridSize;
  grid = [];
  stack = [];

  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  playerKeys = { ...defaultKeys };
  builderCell = grid[0];
  targetCell = grid[grid.length - 1];
  player.spawn();
  enemy.spawn();
}

function getIndexFrom2d(i, j) {
  if (i < 0 || i > gridSize - 1 || j < 0 || j > gridSize - 1) return undefined;

  return i + j * gridSize;
}

function removeWalls(currentCell, nextCell) {
  let diffX = currentCell.index.i - nextCell.index.i;
  let diffY = currentCell.index.j - nextCell.index.j;

  // remove left right walls:
  if (diffX === -1) {
    currentCell.borders.RIGHT = false;
    currentCell.borders.total--;

    nextCell.borders.LEFT = false;
    nextCell.borders.total--;
  } else if (diffX === 1) {
    currentCell.borders.LEFT = false;
    currentCell.borders.total--;

    nextCell.borders.RIGHT = false;
    nextCell.borders.total--;
  }

  // remove top bottom walls:
  if (diffY === -1) {
    currentCell.borders.BOTTOM = false;
    currentCell.borders.total--;

    nextCell.borders.TOP = false;
    nextCell.borders.total--;
  } else if (diffY === 1) {
    currentCell.borders.TOP = false;
    currentCell.borders.total--;

    nextCell.borders.BOTTOM = false;
    nextCell.borders.total--;
  }
}

function getNextCell(offset, object) {
  let cell;

  let index = getIndexFrom2d(
    object.location.index.i + offset[0],
    object.location.index.j + offset[1]
  );

  if (index !== undefined) {
    cell = grid[index];
    return cell;
  } else {
    return undefined;
  }
}

function handlePlayerMovement() {
  if (playerKeys.UP) {
    if (!player.location.borders.TOP) {
      let cell = getNextCell([0, -1], player);

      if (cell !== undefined) {
        player.at(cell);
        if (cell.borders.total <= 1) playerKeys = { ...defaultKeys };
      }
    }
  } else if (playerKeys.LEFT) {
    if (!player.location.borders.LEFT) {
      let cell = getNextCell([-1, 0], player);

      if (cell !== undefined) {
        player.at(cell);
        if (cell.borders.total <= 1) playerKeys = { ...defaultKeys };
      }
    }
  } else if (playerKeys.DOWN) {
    if (!player.location.borders.BOTTOM) {
      let cell = getNextCell([0, 1], player);

      if (cell !== undefined) {
        player.at(cell);
        if (cell.borders.total <= 1) playerKeys = { ...defaultKeys };
      }
    }
  } else if (playerKeys.RIGHT) {
    if (!player.location.borders.RIGHT) {
      let cell = getNextCell([1, 0], player);

      if (cell !== undefined) {
        player.at(cell);
        if (cell.borders.total <= 1) playerKeys = { ...defaultKeys };
      }
    }
  }
}

function handleEnemyMovement(keys, enemy) {
  if (keys.UP) {
    if (!enemy.location.borders.TOP) {
      let cell = getNextCell([0, -1], enemy);

      if (cell !== undefined) {
        enemy.at(cell);
        keys = { ...defaultKeys };
      }
    }
  } else if (keys.LEFT) {
    if (!player.location.borders.LEFT) {
      let cell = getNextCell([-1, 0], enemy);

      if (cell !== undefined) {
        enemy.at(cell);
        keys = { ...defaultKeys };
      }
    }
  } else if (keys.DOWN) {
    if (!player.location.borders.BOTTOM) {
      let cell = getNextCell([0, 1], enemy);
      if (cell !== undefined) {
        enemy.at(cell);
        keys = { ...defaultKeys };
      }
    }
  } else if (keys.RIGHT) {
    if (!player.location.borders.RIGHT) {
      let cell = getNextCell([1, 0], enemy);

      if (cell !== undefined) {
        enemy.at(cell);
        keys = { ...defaultKeys };
      }
    }
  }
}

function removeRandomWalls(n) {
  let chosenIndex = [];
  let customizedGrid = [];

  for (let i = 1; i < gridSize - 2; i++) {
    for (let k = 1; k < gridSize - 2; k++) {
      customizedGrid.push(getIndexFrom2d(i, k));
    }
  }

  while (n--) {
    // chose a random cell:
    let randIndex = floor(random(customizedGrid));
    let randCell = grid[randIndex];

    while (chosenIndex.includes(randIndex) && !randCell.borders.total) {
      randIndex = floor(random(0, grid.length));
      randCell = grid[randIndex];
    }
    chosenIndex.push(randIndex);

    // chose a random wall:
    let wallIndices = [
      ["TOP", "BOTTOM"],
      ["RIGHT", "LEFT"],
      ["BOTTOM", "TOP"],
      ["LEFT", "RIGHT"],
    ];

    let randWall = random(wallIndices);
    while (!randCell.borders[randWall[0]]) {
      randWall = random(wallIndices);
    }

    // remove that wall/border:
    randCell.borders[randWall[0]] = false;
    randCell.borders.total--;

    let neighbor = randCell.getNeighbor(randWall[0]);
    if (neighbor !== undefined) {
      neighbor.borders[randWall[1]] = false;
      neighbor.borders.total--;

      chosenIndex.push(getIndexFrom2d(neighbor.index.i, neighbor.index.j));
    }
  }
}
