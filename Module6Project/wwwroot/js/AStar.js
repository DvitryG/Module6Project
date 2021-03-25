﻿"use strict";
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
            }
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
            for (var v in { a: [1, 0], b:[0, 1], c: [-1, 0], d: [0, -1]}) {
                console.log(`${v[0]} ${v[1]}`);
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
                }
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