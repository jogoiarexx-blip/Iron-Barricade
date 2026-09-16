/**
 * IRON BARRICADE - Grid System (Optimized)
 */

class Grid {
  constructor(rows = 5, cols = 9) {
    this.rows = rows;
    this.cols = cols;
    this.cellSize = 80;
    this.offsetX = 0;
    this.offsetY = 0;
    this.pixelWidth = 0;
    this.pixelHeight = 0;
    this.cells = [];
    this.blocked = [];
    this.compactors = [];
    // Cached flat list of living defenders
    this._defenders = [];
    this._defendersByRow = [];
    this._dirty = true;
    // Offscreen cache for static grid background
    this._bgCanvas = null;
    this._bgValid = false;
    this.init();
  }

  init() {
    this.cells = [];
    this.blocked = [];
    this.compactors = [];
    this._defenders = [];
    this._defendersByRow = [];
    for (let r = 0; r < this.rows; r++) {
      this.cells[r] = [];
      this.blocked[r] = [];
      this.compactors[r] = { used: false, active: false, x: 0, anim: 0 };
      this._defendersByRow[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.cells[r][c] = null;
        this.blocked[r][c] = false;
      }
    }
    this._dirty = true;
    this._bgValid = false;
  }

  resize(canvasWidth, canvasHeight, hudTop = 60, hudBottom = 110) {
    const availableH = canvasHeight - hudTop - hudBottom;
    const availableW = canvasWidth - 40;
    this.cellSize = Math.floor(Math.min(availableW / this.cols, availableH / this.rows));
    this.cellSize = Math.max(48, Math.min(this.cellSize, 100));
    this.pixelWidth = this.cellSize * this.cols;
    this.pixelHeight = this.cellSize * this.rows;
    this.offsetX = Math.floor((canvasWidth - this.pixelWidth) / 2);
    this.offsetY = hudTop + Math.floor((availableH - this.pixelHeight) / 2);
    this._bgValid = false;
  }

  getCellAt(px, py) {
    const x = px - this.offsetX;
    const y = py - this.offsetY;
    if (x < 0 || y < 0 || x >= this.pixelWidth || y >= this.pixelHeight) return null;
    const col = (x / this.cellSize) | 0;
    const row = (y / this.cellSize) | 0;
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return null;
    return { row, col };
  }

  cellCenter(row, col) {
    return {
      x: this.offsetX + col * this.cellSize + this.cellSize * 0.5,
      y: this.offsetY + row * this.cellSize + this.cellSize * 0.5
    };
  }

  canPlace(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return false;
    if (this.blocked[row][col]) return false;
    if (this.cells[row][col] !== null) return false;
    return true;
  }

  place(row, col, defender) {
    if (!this.canPlace(row, col)) return false;
    this.cells[row][col] = defender;
    defender.row = row;
    defender.col = col;
    const center = this.cellCenter(row, col);
    defender.x = center.x;
    defender.y = center.y;
    this._dirty = true;
    return true;
  }

  remove(row, col) {
    const d = this.cells[row][col];
    this.cells[row][col] = null;
    this._dirty = true;
    return d;
  }

  _rebuildDefenders() {
    this._defenders.length = 0;
    for (let r = 0; r < this.rows; r++) {
      this._defendersByRow[r].length = 0;
      for (let c = 0; c < this.cols; c++) {
        const d = this.cells[r][c];
        if (d && d.alive) {
          this._defenders.push(d);
          this._defendersByRow[r].push(d);
        } else if (d && !d.alive) {
          this.cells[r][c] = null;
        }
      }
    }
    this._dirty = false;
  }

  getDefenders() {
    if (this._dirty) this._rebuildDefenders();
    return this._defenders;
  }

  getDefendersInRow(row) {
    if (this._dirty) this._rebuildDefenders();
    return this._defendersByRow[row] || [];
  }

  markDirty() {
    this._dirty = true;
  }

  getLaneY(row) {
    return this.offsetY + row * this.cellSize + this.cellSize * 0.5;
  }

  getSpawnX() {
    return this.offsetX + this.pixelWidth + 30;
  }

  getBaseX() {
    return this.offsetX - 10;
  }

  _buildBgCache() {
    if (!this._bgCanvas) {
      this._bgCanvas = document.createElement('canvas');
    }
    const c = this._bgCanvas;
    c.width = this.pixelWidth + 30;
    c.height = this.pixelHeight + 4;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);

    const ox = 20; // leave room for base indicator
    // Lanes
    for (let r = 0; r < this.rows; r++) {
      const y = r * this.cellSize;
      ctx.fillStyle = r % 2 === 0 ? 'rgba(20, 30, 40, 0.6)' : 'rgba(15, 25, 35, 0.6)';
      ctx.fillRect(ox, y, this.pixelWidth, this.cellSize);
      ctx.strokeStyle = 'rgba(40, 55, 70, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox, y + this.cellSize);
      ctx.lineTo(ox + this.pixelWidth, y + this.cellSize);
      ctx.stroke();
    }
    // Cell borders
    ctx.strokeStyle = 'rgba(50, 70, 90, 0.35)';
    ctx.lineWidth = 1;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = ox + c * this.cellSize;
        const y = r * this.cellSize;
        ctx.strokeRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
      }
    }
    // Base strip
    ctx.fillStyle = 'rgba(255, 100, 50, 0.15)';
    ctx.fillRect(0, 0, 20, this.pixelHeight);
    ctx.strokeStyle = 'rgba(255, 107, 26, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 20, this.pixelHeight);

    this._bgValid = true;
  }

  draw(ctx) {
    if (!this._bgValid) this._buildBgCache();
    ctx.drawImage(this._bgCanvas, this.offsetX - 20, this.offsetY);

    // Compactors (dynamic)
    for (let r = 0; r < this.rows; r++) {
      const comp = this.compactors[r];
      const cy = this.getLaneY(r);
      ctx.fillStyle = comp.used ? 'rgba(100, 50, 50, 0.6)' : 'rgba(255, 150, 50, 0.4)';
      ctx.beginPath();
      ctx.arc(this.offsetX - 10, cy, 8, 0, 6.28318530718);
      ctx.fill();
    }
  }

  drawPlacementPreview(ctx, row, col, valid) {
    if (row === null || row === undefined) return;
    const x = this.offsetX + col * this.cellSize;
    const y = this.offsetY + row * this.cellSize;
    ctx.fillStyle = valid ? 'rgba(0, 229, 255, 0.25)' : 'rgba(255, 50, 50, 0.25)';
    ctx.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
    ctx.strokeStyle = valid ? '#00e5ff' : '#ff3344';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
  }
}
