class Enemy {
  constructor({ location }) {
    this.location = location;
    this.pos = {
      x: this.location.index.i * w + w / 2,
      y: this.location.index.j * w + w / 2,
    };
    this.isReady = false;
    this.radius = w - w / 5;
  }

  at(cell) {
    if (this.isReady) {
      this.location = cell;
      this.pos = {
        x: this.location.index.i * w + w / 2,
        y: this.location.index.j * w + w / 2,
      };
    }
  }

  draw() {
    if (this.isReady) {
      fill(51, 51, 51);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.radius);
      stroke(0, 0, 0);
    }
  }

  spawn() {
    this.location = grid[floor(random(1, grid.length - 2))];
    this.at(this.location);
    this.isReady = false;
    this.radius = w - w / 5;
  }
}
