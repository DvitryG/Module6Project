"use strict";
import { SmoothArea } from "./engine/render.js"

class Program {
    constructor() {
        this.canvas = new SmoothArea("canvas", 500, 1000);
        this.mouseLogic(true, "circle", "#000", true, 20, 20);
        this.startButton();
        this.canvas.setSpeed(10);

        this.numAnts;
        this.numVertex = 0;
    }

    AntCO() {
        var intervalID;
        var alfa = 1;
        var beta = 1;
        var Q = 4;
        var faces = new Array(this.numVertex);
        for (var i = 0; i < faces.length; ++i) {
            faces[i] = new Array(this.numVertex);
            for (var j = 0; j < faces[i].length; ++j) {
                faces[i][j] = {
                    len: Math.sqrt((this.canvas.objects[i].x - this.canvas.objects[j].x) ** 2 + (this.canvas.objects[i].y - this.canvas.objects[j].y) ** 2),
                    pher: 0.5,
                    prob: null,
                }
            }
        }
        var ants = new Array(this.numAnts);
        for (var i = 0; i < ants.length; ++i) {
            ants[i] = new Array(this.numVertex + 1);
            var s
            if (i > this.numVertex - 1) s = 2 * this.numVertex - i;
            else s = i;
            ants[i][0] = s;
            ants[i][this.numVertex] = s;
        }

        var stopButton = document.getElementById("stop").addEventListener('click', event => {
            clearInterval(intervalID);
        });

        intervalID = setInterval(() => {
            for (var i in faces) {
                var totalAttr = 0;
                for (var j in faces[i]) {
                    if (j != i) {
                        totalAttr += faces[i][j].pher ** alfa * (1 / faces[i][j].len) ** beta;
                    }
                }
                for (var j in faces[i]) {
                    faces[i][j].prob = (faces[i].pher ** alfa * (1 / faces[i].len) ** beta) / totalAttr;
                }
            }

            for (var i in ants) {

            }
        }, 10);
    }

    startButton() {
        var start = document.getElementById("start").addEventListener('click', event => {
            this.canvas.canvas.onmousedown = null;
            this.canvas.canvas.onmousemove = null;
            this.numAnts = this.individInput();
            this.AntCO();

        });
    }

    individInput() {
        return parseInt(document.getElementById("individs").value, 10);
    }

    mouseLogic(flag, type, decor, tangible, w, h) {
        if (flag) {
            this.canvas.canvas.onmousedown = (e) => {
                var mouseX = e.offsetX;
                var mouseY = e.offsetY;
                var mx, my;
                var index = null;
                var collision = false;
                for (var i in this.canvas.objects) {
                    if (this.canvas.pointCollision(this.canvas.objects[i], mouseX, mouseY)) {
                        collision = true;
                        index = i;
                        mx = mouseX - this.canvas.objects[i].x;
                        my = mouseY - this.canvas.objects[i].y;
                        break;
                    }
                }
                if (!collision) {
                    this.canvas.canvas.onmousemove = (e) => {
                        if (e.buttons > 0) {
                            if (this.canvas.mouseSetObj(e, type, decor, tangible, w, h)) {
                                this.numVertex += 1;
                            }
                        }
                    }
                }
                else {
                    this.canvas.canvas.onmousemove = (e) => {
                        if (e.buttons > 0) {
                            this.canvas.mouseCapture(e, index, mx, my);
                        }
                    }
                }
            }
        }
        else {
            this.canvas.canvas.onmousedown = null;
            this.canvas.canvas.onmousemove = null;
        }
    }
}

window.onload = new Program();