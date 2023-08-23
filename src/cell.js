class Cell {
  constructor(i, j) {
    this.index = { i, j };

    this.pos = {
      x: i * w,
      y: j * w,
    };

    this.borders = {
      TOP: true,
      RIGHT: true,
      BOTTOM: true,
      LEFT: true,
      total: 4,
    };

    this.isVisited = false;
  }

  draw(colorRGB = canvasColor) {
    // draw cell borders:
    stroke(...colorRGB);
    strokeWeight(3);

    if (this.borders.TOP) {
      line(this.pos.x, this.pos.y, this.pos.x + w, this.pos.y);
    }

    if (this.borders.RIGHT) {
      line(this.pos.x + w, this.pos.y, this.pos.x + w, this.pos.y + w);
    }

    if (this.borders.BOTTOM) {
      line(this.pos.x + w, this.pos.y + w, this.pos.x, this.pos.y + w);
    }

    if (this.borders.LEFT) {
      line(this.pos.x, this.pos.y + w, this.pos.x, this.pos.y);
    }
  }

  highlight(colorRGB, isStroked = false) {
    if (!isStroked) {
      noStroke();
    }
    // clear prev:
    fill(...canvasColor);
    rect(this.pos.x, this.pos.y, w, w);

    // draw new rectangle:
    fill(...colorRGB);
    rect(this.pos.x, this.pos.y, w, w);
    stroke(0, 0, 0);
  }

  checkNeighbors() {
    let neighbors = [];

    // get neighbors' indices:
    let topIndex = getIndexFrom2d(this.index.i, this.index.j - 1);
    let rightIndex = getIndexFrom2d(this.index.i + 1, this.index.j);
    let bottomIndex = getIndexFrom2d(this.index.i, this.index.j + 1);
    let leftIndex = getIndexFrom2d(this.index.i - 1, this.index.j);

    // push neighbors if not visited:
    if (topIndex && !grid[topIndex].isVisited) {
      neighbors.push(grid[topIndex]);
    }
    if (rightIndex && !grid[rightIndex].isVisited) {
      neighbors.push(grid[rightIndex]);
    }
    if (bottomIndex && !grid[bottomIndex].isVisited) {
      neighbors.push(grid[bottomIndex]);
    }
    if (leftIndex && !grid[leftIndex].isVisited) {
      neighbors.push(grid[leftIndex]);
    }

    // return a random neighbor:
    if (!neighbors.isEmpty()) {
      let randomNeighborIndex = floor(random(0, neighbors.length));
      return neighbors[randomNeighborIndex];
    } else {
      return undefined;
    }
  }
}
