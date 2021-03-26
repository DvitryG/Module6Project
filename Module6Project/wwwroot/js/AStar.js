"use strict";
import { Canvas, Point } from "./engine/render.js";

class Program {
    constructor() {
        this.canvas;
        this.num_cells;
        this.start;
        this.finish;

        this.generation();
    }

    AStar() {
        //console.log(`Да начнется веселье!`);
        var graph = new Array(this.canvas._values.length);
        for (var i = 0; i < graph.length; ++i) {
            graph[i] = new Array(graph.length);
            for (var j = 0; j < graph.length; ++j) {
                graph[i][j] = {
                    g: 0, h: 0, f: 0,
                    x: i, y: j,
                    visited: false,
                    closed: false,
                    parent: null,
                }
                ////console.log(`${graph[i][j].x}`);
            }
        }
        //console.log(`Граф инициализирован`);

        function adjacents(current) {
            var adjacent = [];
            var x = current.x;
            var y = current.y;
            //console.log(`родительская клетка: x: ${x}  y: ${y}`);
            if ((x - 1 >= 0 && x - 1 < graph.length) && (y >= 0 && y < graph.length)) {
                ////console.log(`${canvas._values[x - 1][y]}`);
                adjacent.push(graph[x - 1][y]);
                //console.log(`добавляю соседнюю в очередь: x: ${x - 1}  y: ${y}`);
            }
            if ((x >= 0 && x < graph.length) && (y + 1 >= 0 && y + 1 < graph.length)) {
                adjacent.push(graph[x][y + 1]);
                //console.log(`добавляю соседнюю в очередь: x: ${x}  y: ${y + 1}`);
            }
            if ((x + 1 >= 0 && x + 1 < graph.length) && (y >= 0 && y < graph.length)) {
                adjacent.push(graph[x + 1][y]);
                //console.log(`добавляю соседнюю в очередь: x: ${x + 1}  y: ${y}`);
            }
            if ((x >= 0 && x < graph.length) && (y - 1 >= 0 && y - 1 < graph.length)) {
                adjacent.push(graph[x][y - 1]);
                //console.log(`добавляю соседнюю в очередь: x: ${x}  y: ${y - 1}`);
            }
            //console.log(`Получаем соседние клетки: ${adjacent}`);
            return adjacent;
        }

        var finish = graph[this.finish.lastX][this.finish.lastY];
        //console.log(`Получаем финиш, который находится на: x: ${finish.x} y: ${finish.y}`);
        var open = [];
        //var closed = [];
        open.push(graph[this.start.lastX][this.start.lastY]);
        //console.log(`добавяем в очередь старт, который находится на: x: ${graph[this.start.lastX][this.start.lastY].x} y: ${graph[this.start.lastX][this.start.lastY].y}`);
        while (open.length > 0) {
            //console.log(`достаем из открытого списка значение.`);
            var min = 0;
            for (var i = 0; i < open.length; ++i) {
                if (open[i].f < open[min].f && !open[i].closed) min = i;
            }
            var current = open[min];
            //console.log(`находим самое маленькое из списка: x: ${current.x} y: ${current.y}`);
            if (current == finish) {
                //console.log(`О УРА, оно подходит!`);
                var path = [];
                var curr = current
                while (curr.parent) {
                    path.push(curr);
                    curr = curr.parent;
                }
                //console.log(`Путь: ${path}`);
                return path;
            }
            current.closed = true;
            var adjacent = adjacents(current);
            //console.log(`получаем список соседних: ${adjacent}`);
            for (var i in adjacent) {
                //console.log(`производим анализ для соседней: x: ${adjacent[i].x} y: ${adjacent[i].y}`);
                //console.log(`стенка? ${this.canvas._values[adjacent[i].x][adjacent[i].y]} закрыта? ${adjacent[i].closed}`);
                if (this.canvas._values[adjacent[i].x][adjacent[i].y] != 1 && !adjacent[i].closed) {
                    //console.log(`Хорошие новости: это не стенка и оно не в закрытом`);
                    var g = current.g + 1;
                    var h = Math.abs(adjacent[i].x - this.finish.lastX) + Math.abs(adjacent[i].y - this.finish.lastY);
                    var f = g + h;
                    //console.log(`посещенная? ${adjacent[i].visited}`);
                    if (!adjacent[i].visited) open.push(adjacent[i]);
                    if (!adjacent[i].visited || f < adjacent[i].f) {
                        adjacent[i].g = g;
                        adjacent[i].h = h;
                        adjacent[i].f = f;
                        adjacent[i].visited = true;
                        adjacent[i].parent = current;
                    }
                }
                //console.log(`закончили проверку для: x: ${adjacent[i].x} y: ${adjacent[i].y}`);
                
            }
            //console.log(`открытый список до удаления: ${open} ${open.length}`);
            //console.log(`мы удаляем: x: ${open[min].x} y: ${open[min].y}`);
            open.splice(min, 1);
            //console.log(`открытый список после удаления: ${open} ${open.length}`);
            //closed.push(current);
        }
        //console.log(`AStar: ${false}`);
        return false;
    }

    inputSize() {
        return parseInt(document.getElementById("digital").value, 10);
    }

    generation() {
        var generation = document.getElementById("generate").addEventListener('click', event => {
            //console.log(`оп, выполнилось`);
            this.num_cells = this.inputSize();
            this.canvas = new Canvas("canvas", 500, 40, this.num_cells, 1);
            this.canvas.drawGrid("#000");
            this.canvas.setMouseDraw(true);
            this.start = new Point(this.canvas, 2, "#f0f");
            this.finish = new Point(this.canvas, 3, "#0ff");
            this.colors();
            this.startButton();
        });
    }

    colors() {
        this.canvas.mouseDraw(0, "void");
        var colors = document.getElementById("colors").addEventListener('change', event => {
            for (var opt of event.target.children) {
                if (opt.selected) {
                    if (opt.value == 0) this.canvas.mouseDraw(0, "void");
                    else if (opt.value == 1) this.canvas.mouseDraw(1, "#000");
                    else if (opt.value == 2) this.start.drawPoint();
                    else if (opt.value == 3) this.finish.drawPoint();
                    else console.log(`Неизвесное значение: ${opt.value}`);
                }
            }
        });
    }

    generators() {
        var generators = document.getElementById("generators").addEventListener('change', event => {
            for (var opt of event.target.children) {
                if (opt.selected) {
                    /*None*/
                }
            }
        });
    }

    startButton() {
        var start = document.getElementById("start").addEventListener('click', event => {
            this.canvas.setMouseDraw(false);
            var way = this.AStar();
            //console.log(way);
            if (way != false) {
                while (way.length > 0) {
                    //console.log(way.length);
                    var n = way.pop();
                    //console.log(`x: ${n.x} y: ${n.y}`)
                    this.canvas.decorateCell(n.x, n.y, 0, "#ff0");
                }
            }
        });
    }
}

function init() {
    var prog = new Program();
    //prog.generation();
    /*prog.colors();
    prog.generators();
    prog.startButton();*/

}

window.onload = init;