class Player {
  constructor({ location }) {
    this.location = location;
    this.pos = {
      x: this.location.index.i * w + w / 2,
      y: this.location.index.j * w + w / 2,
    };
    this.isReady = false;
    this.radius = w - w / 5;
    this.visited = [this.location];
  }

  at(cell) {
    if (this.isReady) {
      this.location = cell;
      this.pos = {
        x: this.location.index.i * w + w / 2,
        y: this.location.index.j * w + w / 2,
      };

      if (!this.visited.includes(cell)) {
        this.visited.push(cell);
      }
    }
  }

  draw() {
    if (this.isReady) {
      fill(255, 255, 255);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.radius);
      stroke(0, 0, 0);
    }
  }

  clear() {
    this.isReady = false;
    this.radius = w - w / 5;
    this.visited = [this.location];
  }
}
