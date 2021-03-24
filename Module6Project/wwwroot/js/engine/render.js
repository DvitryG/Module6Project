export class Canvas {
    constructor(canvas_name, canvas_size, cell_size, num_cells, cell_border) {
        this._canvasSize = canvas_size;
        this._cellSize = cell_size;
        this._numCells = num_cells;
        this._cellBorder = cell_border;
        this._values = new Array(num_cells);
        this._mouseFlag = false;
        for (var i = 0; i < this._values.length; ++i) {
            this._values[i] = new Array(num_cells);
            for (var j = 0; j < this._values.length; ++j) {
                this._values[i][j] = 0;
            }
        }

        this._canvas = document.getElementById(canvas_name);
        this._canvas.height = cell_size * num_cells;
        this._canvas.width = cell_size * num_cells;
        this._canvas.style.height = `${canvas_size}px`;
        this._canvas.style.width = `${canvas_size}px`;
        this._canvas.style.imageRendering = "pixelated";
        this.context = this._canvas.getContext('2d');

        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
    }

    drawGrid(color) {
        if (color == color.match(/#\w{1,8}/)) {
            this.context.strokeStyle = color;
        }
        else return;
        if (this._cellBorder == 0) return;
        else this.context.lineWidth = this._cellBorder + (this._cellBorder - 1);
        this.context.strokeRect(0.5, 0.5, this._cellSize * this._numCells - 1, this._cellSize * this._numCells - 1);
        for (var x = 0.5; x <= this._cellSize * this._numCells; x += this._cellSize) {
            this.context.moveTo(x, 0.5);
            this.context.lineTo(x, this._cellSize * this._numCells - 1);
            this.context.moveTo(x + (this._cellSize - 1), 0.5);
            this.context.lineTo(x + (this._cellSize - 1), this._cellSize * this._numCells - 1);
        }
        for (var y = 0.5; y <= this._cellSize * this._numCells; y += this._cellSize) {
            this.context.moveTo(0.5, y);
            this.context.lineTo(this._cellSize * this._numCells - 1, y);
            this.context.moveTo(0.5, y + (this._cellSize - 1));
            this.context.lineTo(this._cellSize * this._numCells - 1, y + (this._cellSize - 1));
        }
        this.context.stroke();
    }

    decorateCell(x, y, value, decor) {
        if (x >= 0 && y >= 0) {
            this._values[y][x] = value;
            if (decor == "void") {
                this.context.clearRect(this._cellSize * x + this._cellBorder, this._cellSize * y + this._cellBorder, this._cellSize - 2 * this._cellBorder, this._cellSize - 2 * this._cellBorder);
            }
            else {
                if (decor == decor.match(/#\w{1,8}/)) {
                    this.context.fillStyle = decor;
                    this.context.fillRect(this._cellSize * x + this._cellBorder, this._cellSize * y + this._cellBorder, this._cellSize - 2 * this._cellBorder, this._cellSize - 2 * this._cellBorder)
                }
                else {
                    /*Тут должна быть реализована вставка картинок*/
                }
            }
        }
        else console.log(`Вы вышли за пределы области: x: ${x}  y: ${y}`);
    }

    _onMouse(e, value, decor) {
        var x = Math.floor((e.offsetX * this._numCells) / this._canvasSize);
        var y = Math.floor((e.offsetY * this._numCells) / this._canvasSize);
        if (e.buttons > 0) {
            //console.log(`x: ${x}  y: ${y}`);
            this.decorateCell(x, y, value, decor);
        }
    }

    setMouseDraw(value) {
        this._mouseFlag = value;
        if (!this._mouseFlag) {
            this._canvas.onmousemove = null;
            this._canvas.onmousedown = null;
        }
    }

    getMouseDraw() {
        return this._mouseFlag;
    }

    mouseDraw(value, decor) {
        if (this._mouseFlag) {
            this._canvas.onmousemove = (e) => this._onMouse(e, value, decor);
            this._canvas.onmousedown = (e) => this._onMouse(e, value, decor);
        }
        else {
            this._canvas.onmousemove = null;
            this._canvas.onmousedown = null;
        }
    }
}

export class Point {
    constructor(canvas, value, decor) {
        this.Canvas = canvas;
        this.value = value;
        this.decor = decor;
        this.lastX = null;
        this.lastY = null;
    }

    _onMouse(e) {
        var x = Math.floor((e.offsetX * this.Canvas._numCells) / this.Canvas._canvasSize);
        var y = Math.floor((e.offsetY * this.Canvas._numCells) / this.Canvas._canvasSize);
        if (e.buttons > 0) {
            //console.log(`x: ${x}  y: ${y}`);
            if (this.lastX != null || this.lastY != null) {
                this.Canvas.decorateCell(this.lastX, this.lastY, 0, "void");
            }
            this.lastX = x;
            this.lastY = y;
            this.Canvas.decorateCell(this.lastX, this.lastY, this.value, this.decor);
        }
    }

    drawPoint() {
        if (this.Canvas._mouseFlag) {
            this.Canvas._canvas.onmousemove = (e) => this._onMouse(e);
            this.Canvas._canvas.onmousedown = (e) => this._onMouse(e);
        }
        else {
            this.Canvas._canvas.onmousemove = null;
            this.Canvas._canvas.onmousedown = null;
        }
    }
}