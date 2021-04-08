export class DiscreteArea {
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
        if ((x >= 0 && x < this._numCells) && (y >= 0 && y < this._numCells)) {
            this._values[x][y] = value;
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

export class SmoothArea {
    constructor(canvas_name, height, width) {
        this.height = height;
        this.width = width;
        this.objects = [];
        this.speed = 0;
        this.objBorders = false;
        this.intervalID;

        this.canvas = document.getElementById(canvas_name);
        this.canvas.height = height;
        this.canvas.width = width;
        this.canvas.style.imageRendering = "pixelated";
        this.context = this.canvas.getContext('2d');

        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
    }

    main() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i in this.objects) {
            if (this.objects[i].type == "sprite") {
                if (this.objects[i].decor != null) {
                    var img = new Image();
                    img.addEventListener("load", () => {
                        this.context.drawImage(img, this.objects[i].x, this.objects[i].y, this.objects[i].width, this.objects[i].height);
                    }, false);
                    img.src = this.objects[i].sprite;
                }
            }
            else {
                if (this.objects[i].decor == this.objects[i].decor.match(/#\w{1,8}/)) {
                    this.context.fillStyle = this.objects[i].decor;
                    this.context.strokeStyle = this.objects[i].decor;
                }
                else {
                    this.context.fillStyle = "#0000";
                    this.context.strokeStyle = "#0000";
                }
                if (this.objects[i].type == "circle") {
                    //console.log(`круг`);
                    this.context.beginPath();
                    this.context.arc(this.objects[i].x + (this.objects[i].width / 2), this.objects[i].y + (this.objects[i].height / 2), Math.min(this.objects[i].width / 2, this.objects[i].height / 2), 0, 2 * Math.PI, false);
                    this.context.fill();
                }
                else if (this.objects[i].type == "box") {
                    this.context.fillRect(this.objects[i].x, this.objects[i].y, this.objects[i].width, this.objects[i].height);
                }
                else if (this.objects[i].type == "line") {
                    //console.log(`линия`);
                    this.context.lineWidth = this.objects[i].lineWidth;
                    this.context.beginPath();
                    this.context.moveTo(this.objects[i].x1, this.objects[i].y1);
                    this.context.lineTo(this.objects[i].x2, this.objects[i].y2);
                    this.context.stroke();
                    this.context.lineWidth = 1;
                }
                else if (this.objects[i].type == "custom") {
                    this.objects[i].drawRules;
                }
                else console.log(`Некорректный объект под номером: ${i}`);
            } 
            if (this.objBorders) {
                this.context.strokeStyle = "#000";
                this.context.strokeRect(this.objects[i].x, this.objects[i].y, this.objects[i].width, this.objects[i].height);
            }
        }
    }

    addObject(type, decor, tangible, x, y, w, h) {
        if (type == "sprite") {
            this.objects.push({
                type: "sprite",
                decor: decor,
                tangible: tangible,
                x: x, y: y,
                width: w,
                height: h,
            });
        }
        else if (type == "circle") {
            this.objects.push({
                type: "circle",
                decor: decor,
                tangible: tangible,
                x: x, y: y,
                width: w,
                height: h,
            });
        }
        else if (type == "box") {
            this.objects.push({
                type: "box",
                decor: decor,
                tangible: tangible,
                x: x, y: y,
                width: w,
                height: h,
            });
        }
        else if (type == "line") {
            this.objects.push({
                type: "line",
                decor: decor,
                lineWidth: 1,
                x1: x, y1: y,
                x2: w, y2: h,
                tangible: tangible,
                x: Math.min(x, w), y: Math.min(y, h),
                width: Math.abs(x - w),
                height: Math.abs(y - h),
            });
        }
        else if (type == "custom") {
            this.objects.push({
                type: "custom",
                decor: decor,
                tangible: tangible,
                x: x, y: y,
                width: w,
                height: h,
                drawRules,
            });
        }
        else return -1;
    }

    setSpeed(speed) {
        this._speed = speed;
        clearInterval(this.intervalID);
        if (speed > 0) {
            this.intervalID = setInterval(() => this.main(), this.speed);
        }
    }

    objectCollision(obj1, obj2) {
        if (obj1.tangible == true && obj2.tangible == true) {
            if (this.pointCollision(obj1, obj2.x, obj2.y)) return true;
            else if (this.pointCollision(obj1, obj2.x + obj2.width, obj2.y)) return true;
            else if (this.pointCollision(obj1, obj2.x, obj2.y + obj2.height)) return true;
            else if (this.pointCollision(obj1, obj2.x + obj2.width, obj2.y + obj2.height)) return true;
        }
        else return false;
    }

    pointCollision(obj, pointX, pointY) {
        if (!(pointX >= obj.x && pointX <= obj.x + obj.width)) return false;
        if (!(pointY >= obj.y && pointY <= obj.y + obj.height)) return false;
        return true;
    }

    mouseCapture(e, index, mx, my) {
        if (e.buttons > 0) {
            var mouseX = e.offsetX;
            var mouseY = e.offsetY;

            var newObj = {
                x: mouseX - mx,
                y: mouseY - my,
                height: this.objects[index].height,
                width: this.objects[index].width,
                tangible: this.objects[index].tangible
            }

            var collision = false;
            for (var i in this.objects) {
                if (i != index) {
                    if (this.objectCollision(newObj, this.objects[i])) {
                        collision = true;
                        break;
                    }
                }
            }
            if (!collision) {
                this.objects[index].x = newObj.x;
                this.objects[index].y = newObj.y;
            }
        }
    }

    mouseSetObj(e, type, decor, tangible, w, h) {
        //console.log(`клик`);
        var mouseX = e.offsetX;
        var mouseY = e.offsetY;
        var newObj = {
            tangible: tangible,
            x: mouseX - w / 2,
            y: mouseY - h / 2,
            width: w,
            height: h,
        }

        var collision = false;
        for (var i in this.objects) {
            if (this.objectCollision(newObj, this.objects[i])) {
                collision = true;
                break;
            }
        }

        if (!collision) {
            //console.log(`опа, колизий нет`);
            this.addObject(type, decor, tangible, newObj.x, newObj.y, w, h);
            return true;
        }
        else return false;
    }

    /*drawLine(x1, y1, x2, y2, width, color) {
        if (color == color.match(/#\w{1,8}/)) {
            this.context.strokeStyle = color;
        }
        else return;
        this.context.lineWidth = width;
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
    }*/
}