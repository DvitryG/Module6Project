class render {
    constructor(canvas_name, cell_size, num_cells) {
        this.canvas_name = canvas_name;
        this.cell_size = cell_size;
        this.num_cells = num_cells;

        var canvas = document.getElementById(canvas_name);
        canvas.height = cell_size * num_cells;
        canvas.width = cell_size * num_cells;
        this.context = canvas.getContext('2d');

        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;

        this.drawGrid(cell_size, num_cells);

        this.context.stroke();
    }

    drawGrid(cell_size, num_cells) {
        this.context.strokeStyle = "#888";
        this.context.strokeRect(0.5, 0.5, cell_size * num_cells - 1, cell_size * num_cells - 1);
        for (var x = 0.5; x <= cell_size * num_cells; x += cell_size) {
            this.context.moveTo(x, 0.5);
            this.context.lineTo(x, cell_size * num_cells - 1);
            this.context.moveTo(x + (cell_size - 1), 0.5);
            this.context.lineTo(x + (cell_size - 1), cell_size * num_cells - 1);
        }
        for (var y = 0.5; y <= cell_size * num_cells; y += cell_size) {
            this.context.moveTo(0.5, y);
            this.context.lineTo(cell_size * num_cells - 1, y);
            this.context.moveTo(0.5, y + (cell_size - 1));
            this.context.lineTo(cell_size * num_cells - 1, y + (cell_size - 1));
        }
    }

    decorateCell(x, y, decor) {
        if (decor == "None") {
            this.context.clearRect(this.cell_size * x + 1, this.cell_size * y + 1, this.cell_size - 2, this.cell_size - 2);
        }
        else {
            if (decor == decor.match(/#\w{1,6}/)) {
                this.context.fillStyle = decor;
                this.context.fillRect(this.cell_size * x + 1, this.cell_size * y + 1, this.cell_size - 2, this.cell_size - 2)
            }
            else {
                /*Тут должна быть реализована вставка картинок*/
            }
        }
    }
}

function init() {
    var canvas = new render("canvas", 40, 7);
    canvas.decorateCell(3, 2, "#f00");
    canvas.decorateCell(3, 3, "#f00");
    canvas.decorateCell(5, 2, "#f00");
    canvas.decorateCell(5, 3, "#f00");
    canvas.decorateCell(2, 5, "#f00");
    canvas.decorateCell(3, 6, "#f00");
    canvas.decorateCell(4, 6, "#f00");
    canvas.decorateCell(5, 6, "#f00");
    canvas.decorateCell(6, 5, "#f00");
}

window.onload = init;