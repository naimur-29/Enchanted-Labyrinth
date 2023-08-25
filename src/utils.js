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

function handlePlayerControl(offset) {
  let cell;

  let index = getIndexFrom2d(
    player.location.index.i + offset[0],
    player.location.index.j + offset[1]
  );

  if (index !== undefined) {
    cell = grid[index];
    return cell;
  } else {
    return undefined;
  }
}

function handlePlayerMovement() {
  if (keys.UP) {
    if (!player.location.borders.TOP) {
      let cell = handlePlayerControl([0, -1]);

      if (cell !== undefined) {
        player.at(cell);
        if (cell.borders.total <= 1) keys = [0, 0, 0, 0];
      }
    }
  } else if (keys.LEFT) {
    if (!player.location.borders.LEFT) {
      let cell = handlePlayerControl([-1, 0]);

      if (cell !== undefined) {
        player.at(cell);
        if (cell.borders.total <= 1) keys = [0, 0, 0, 0];
      }
    }
  } else if (keys.DOWN) {
    if (!player.location.borders.BOTTOM) {
      let cell = handlePlayerControl([0, 1]);

      if (cell !== undefined) {
        player.at(cell);
        if (cell.borders.total <= 1) keys = [0, 0, 0, 0];
      }
    }
  } else if (keys.RIGHT) {
    if (!player.location.borders.RIGHT) {
      let cell = handlePlayerControl([1, 0]);

      if (cell !== undefined) {
        player.at(cell);
        if (cell.borders.total <= 1) keys = [0, 0, 0, 0];
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

    while (chosenIndex.includes(randIndex) && randCell.borders.total <= 1) {
      randIndex = floor(random(0, grid.length));
      randCell = grid[randIndex];
    }
    chosenIndex.push(randIndex);

    // chose a random wall:
    let randWall = random([0, 1, 2, 3]);
    let neighbor = randCell.getNeighbor(randWall);

    // remove that wall/border:
    switch (randWall) {
      case 0:
        randCell.borders.TOP = false;
        randCell.borders.total--;

        if (neighbor) {
          neighbor.borders.BOTTOM = false;
          neighbor.borders.total--;
        }

        break;

      case 1:
        randCell.borders.RIGHT = false;
        randCell.borders.total--;

        if (neighbor) {
          neighbor.borders.LEFT = false;
          neighbor.borders.total--;
        }

        break;

      case 2:
        randCell.borders.BOTTOM = false;
        randCell.borders.total--;

        if (neighbor) {
          neighbor.borders.TOP = false;
          neighbor.borders.total--;
        }

        break;

      case 3:
        randCell.borders.LEFT = false;
        randCell.borders.total--;

        if (neighbor) {
          neighbor.borders.RIGHT = false;
          neighbor.borders.total--;
        }

        break;
    }
  }
}
