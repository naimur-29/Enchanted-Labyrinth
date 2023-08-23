class Player {
  constructor({ location }) {
    this.location = location;
    this.pos = {
      x: this.location.index.i * w + w / 2,
      y: this.location.index.j * w + w / 2,
    };
    this.isReady = false;
    this.size = (w * 2) / 3;
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
      ellipse(this.pos.x, this.pos.y, this.size);
      stroke(0, 0, 0);
    }
  }
}
