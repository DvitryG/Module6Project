"use strict";
import { Canvas, Point } from "./engine/render.js";

class Program {
    constructor() {
        this.canvas = new Canvas("canvas", 500, 40, 50, 1);
        this.canvas.drawGrid("#000");
        this.canvas.setMouseDraw(true);
        this.start = new Point(this.canvas, 2, "#f0f");
        this.finish = new Point(this.canvas, 3, "#0ff");
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
                console.log(`${graph[i][j].x}`);
            }
        }

        function adjacents(current) {
            var adjacent = [];
            var x = current.x;
            var y = current.y;
            console.log(`x: ${x}  y: ${y}`);
            //if (graph[x - 1][y]) {
                console.log(`${graph[x - 1][y]}`);
                adjacent.push(graph[x - 1][y]);
            //}
            //if (graph[x][y + 1]) {
                adjacent.push(graph[x][y + 1]);
            //}
            //if (graph[x + 1][y]) {
                adjacent.push(graph[x + 1][y]);
            //}
            //if (graph[x][y - 1]) {
                adjacent.push(graph[x][y - 1]);
            //}
            return adjacent;
        }

        var finish = graph[this.finish.lastX][this.finish.lastY];
        var open = [];
        //var closed = [];
        open.push(graph[this.start.lastX][this.start.lastY]);
        while (open.length > 0) {
            var min = 0;
            for (var i = 0; i < open.length; ++i) {
                if (open[i].f < open[min].f) min = i;
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
            for (var v in adjacent) {
                console.log(`${adjacent} ${v}`);
                if (this.canvas._values[v.x][v.y] != 1 && !v.closed) {
                    var g = current.g + 1;
                    var h = Math.abs(v.x - this.finish.lastX) + Math.abs(v.y - this.finish.lastY);
                    var f = g + h;
                    if (!v.visited) open.push(v);
                    if (!v.visited || f < v.f) {
                        v.g = g;
                        v.h = h;
                        v.f = f;
                        v.visited = true;
                        v.parent = current;
                    }
                }
                /*console.log(`${v[0]} ${v[1]}`);
                if (this.canvas._values[current.x + v[0]][current.y + v[1]] != 1 && !graph[current.x + v[0]][current.y + v[1]].closed) {
                    var g = current.g + 1;
                    var h = Math.abs(graph[current.x + v[0]][current.y + v[1]].x - this.finish.lastX) + Math.abs(graph[current.x + v[0]][current.y + v[1]].y - this.finish.lastY);
                    var f = g + h;
                    if (!graph[current.x + v[0]][current.y + v[1]].visited) open.push(graph[current.x + v[0]][current.y + v[1]]);
                    if (!graph[current.x + v[0]][current.y + v[1]].visited || f < graph[current.x + v[0]][current.y + v[1]].f) {
                        graph[current.x + v[0]][current.y + v[1]].g = g;
                        graph[current.x + v[0]][current.y + v[1]].h = h;
                        graph[current.x + v[0]][current.y + v[1]].f = f;
                        graph[current.x + v[0]][current.y + v[1]].visited = true;
                        graph[current.x + v[0]][current.y + v[1]].parent = current;
                    }
                }*/
            }
            open.splice(open.indexOf(min), 1);
            //closed.push(current);
        }
        return false;
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
                    /*none*/
                }
            }
        });
    }

    startButton() {
        var start = document.getElementById("start").addEventListener('click', event => {
            this.canvas.setMouseDraw(false);
            way = this.AStar();
            if (way != false) {
                n = way.pop();
                this.canvas.decorateCell(n.x, n.y, 0, "#fff");
            }
        });
    }
}

function init() {
    var prog = new Program();
    prog.colors();
    prog.generators();
    prog.startButton();

}

window.onload = init;