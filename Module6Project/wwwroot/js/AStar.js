"use strict";
import { DiscreteArea, Point } from "./engine/render.js";

class Program {
    constructor() {
        this.canvas = null;
        this.num_cells;
        this.start;
        this.finish;
        this.generation();
    }

    AStar() {
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
            }
        }

        function adjacents(current) {
            var adjacent = [];
            var x = current.x;
            var y = current.y;
            if ((x - 1 >= 0 && x - 1 < graph.length) && (y >= 0 && y < graph.length)) {
                adjacent.push(graph[x - 1][y]);
            }
            if ((x >= 0 && x < graph.length) && (y + 1 >= 0 && y + 1 < graph.length)) {
                adjacent.push(graph[x][y + 1]);
            }
            if ((x + 1 >= 0 && x + 1 < graph.length) && (y >= 0 && y < graph.length)) {
                adjacent.push(graph[x + 1][y]);
            }
            if ((x >= 0 && x < graph.length) && (y - 1 >= 0 && y - 1 < graph.length)) {
                adjacent.push(graph[x][y - 1]);
            }
            return adjacent;
        }

        var finish = graph[this.finish.lastX][this.finish.lastY];
        var open = [];
        open.push(graph[this.start.lastX][this.start.lastY]);
        while (open.length > 0) {
            var min = 0;
            for (var i = 0; i < open.length; ++i) {
                if (open[i].f < open[min].f && !open[i].closed) min = i;
                else if (open[i].f == open[min].f && !open[i].closed) {
                    if (open[i].h < open[min].h) min = i;
                }
            }
            var current = open[min];
            if (current == finish) {
                var path = [];
                var curr = current
                while (curr.parent) {
                    path.push(curr);
                    curr = curr.parent;
                }
                return path;
            }

            current.closed = true;
            var adjacent = adjacents(current);
            open.splice(min, 1);
            for (var i in adjacent) {
                if (this.canvas._values[adjacent[i].x][adjacent[i].y] != 1 && !adjacent[i].closed) {
                    var g = current.g + 1;
                    var h = Math.sqrt((adjacent[i].x - this.finish.lastX) ** 2 + (adjacent[i].y - this.finish.lastY) ** 2);
                    var f = g + h;
                    if (!adjacent[i].visited && !adjacent[i].closed) {
                        open.push(adjacent[i]);
                    }
                    if (!adjacent[i].visited || f < adjacent[i].f) {
                        adjacent[i].g = g;
                        adjacent[i].h = h;
                        adjacent[i].f = f;
                        adjacent[i].visited = true;
                        adjacent[i].parent = current;
                    }
                }
            }
            
        }
        return false;
    }

    inputSize() {
        return parseInt(document.getElementById("digital").value, 10);
    }

    generation() {
        var generation = document.getElementById("generate").addEventListener('click', event => {
            this.num_cells = this.inputSize();
            if (this.num_cells != null) {
                this.canvas = new DiscreteArea("canvas", 1128, 60, this.num_cells, 1);
                this.canvas.drawGrid("#fff");
                this.canvas.setMouseDraw(true);
                this.start = new Point(this.canvas, 2, "#f0f");
                this.finish = new Point(this.canvas, 3, "#0ff");
                this.colors();
                this.startButton();
            }
        });
    }

    colors() {
        this.canvas.mouseDraw(0, "void");
        var colors = document.getElementById("colors").addEventListener('change', event => {
            for (var opt of event.target.children) {
                if (opt.selected) {
                    if (opt.value == 0) this.canvas.mouseDraw(0, "void");
                    else if (opt.value == 1) this.canvas.mouseDraw(1, "#fff");
                    else if (opt.value == 2) this.start.drawPoint();
                    else if (opt.value == 3) this.finish.drawPoint();
                    else console.log(`Неизвесное значение: ${opt.value}`);
                }
            }
        });
    }

    startButton() {
        var start = document.getElementById("start").addEventListener('click', event => {
            if (this.canvas != null) {
                this.canvas.setMouseDraw(false);
                var way = this.AStar();
                if (way != false) {
                    while (way.length > 0) {
                        var n = way.pop();
                        this.canvas.decorateCell(n.x, n.y, 0, "#ff0");
                    }
                }
            }
        });
    }
}

window.onload = new Program();