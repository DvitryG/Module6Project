class Canvas {
    constructor(canvas_name, canvas_size, cell_size, num_cells, cell_border) {
        //this.canvas_name = canvas_name;
        this._canvas_size = canvas_size;
        this._cell_size = cell_size;
        this._num_cells = num_cells;
        this._cell_border = cell_border;
        this._values = new Array(num_cells);
        for (var i = 0; i < this._values.length; ++i) {
            this._values[i] = new Array(num_cells);
            for (var j = 0; j < this._values.length; ++j) {
                this._values[i][j] = 0;
            }
        }

        this.canvas = document.getElementById(canvas_name);
        this.canvas.height = cell_size * num_cells;
        this.canvas.width = cell_size * num_cells;
        this.canvas.style.height = `${canvas_size}px`;
        this.canvas.style.width = `${canvas_size}px`;
        this.canvas.style.imageRendering = "pixelated";
        this.context = this.canvas.getContext('2d');

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
        if (this._cell_border == 0) return;
        else this.context.lineWidth = this._cell_border + (this._cell_border - 1);
        this.context.strokeRect(0.5, 0.5, this._cell_size * this._num_cells - 1, this._cell_size * this._num_cells - 1);
        for (var x = 0.5; x <= this._cell_size * this._num_cells; x += this._cell_size) {
            this.context.moveTo(x, 0.5);
            this.context.lineTo(x, this._cell_size * this._num_cells - 1);
            this.context.moveTo(x + (this._cell_size - 1), 0.5);
            this.context.lineTo(x + (this._cell_size - 1), this._cell_size * this._num_cells - 1);
        }
        for (var y = 0.5; y <= this._cell_size * this._num_cells; y += this._cell_size) {
            this.context.moveTo(0.5, y);
            this.context.lineTo(this._cell_size * this._num_cells - 1, y);
            this.context.moveTo(0.5, y + (this._cell_size - 1));
            this.context.lineTo(this._cell_size * this._num_cells - 1, y + (this._cell_size - 1));
        }
        this.context.stroke();
    }

    decorateCell(x, y, value, decor) {
        this._values[y][x] = value;
        if (decor == "None") {
            this.context.clearRect(this._cell_size * x + this._cell_border, this._cell_size * y + this._cell_border, this._cell_size - 2 * this._cell_border, this._cell_size - 2 * this._cell_border);
        }
        else {
            if (decor == decor.match(/#\w{1,8}/)) {
                this.context.fillStyle = decor;
                this.context.fillRect(this._cell_size * x + this._cell_border, this._cell_size * y + this._cell_border, this._cell_size - 2 * this._cell_border, this._cell_size - 2 * this._cell_border)
            }
            else {
            /*Тут должна быть реализована вставка картинок*/
            }
        }
    }

    _onMouse(e, value, decor) {
        var x = Math.floor((e.offsetX * this._num_cells) / this._canvas_size);
        var y = Math.floor((e.offsetY * this._num_cells) / this._canvas_size);
        if (e.buttons > 0) {
            //console.log(`x: ${x}  y: ${y}`);
            this.decorateCell(x, y, value, decor);
        }
    }

    onMouseDraw(value, decor) {
        this.canvas.onmousemove = (e) => this._onMouse(e, value, decor);
        this.canvas.onmousedown = (e) => this._onMouse(e, value, decor);
    }

    offMouseDraw() {
        this.canvas.onmousemove = null;
        this.canvas.onmousedown = null;
    }
}

function init() {
    var canvas = new Canvas("canvas", 500, 40, 50, 1);
    canvas.drawGrid("#000");
    canvas.onMouseDraw(1, "#f00");
}

window.onload = init;