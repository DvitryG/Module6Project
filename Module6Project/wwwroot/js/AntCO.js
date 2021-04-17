"use strict";
import { SmoothArea } from "./engine/render.js"

class Program {
    constructor() {
        this.canvas = new SmoothArea("canvas", 500, 1128);
        this.mouseLogic(true, "circle", "#fff", true, 20, 20);
        this.startButton();
        this.canvas.setSpeed(10);

        this.numVertex = 0;
    }

    AntCO() {
        var intervalID;
        var alfa = 1;
        var beta = 4;
        var Q = 240;
        var p = 0.6;
        var faces = new Array(this.numVertex);
        for (var i = 0; i < faces.length; ++i) {
            faces[i] = new Array(this.numVertex);
            for (var j = 0; j < faces[i].length; ++j) {
                faces[i][j] = {
                    len: Math.sqrt((this.canvas.objects[i].x - this.canvas.objects[j].x) ** 2 + (this.canvas.objects[i].y - this.canvas.objects[j].y) ** 2),
                    pher: 0.5,
                }
            }
        }
        var ants = new Array(this.numVertex);
        for (var i = 0; i < ants.length; ++i) {
            ants[i] = new Array(this.numVertex + 1);
            ants[i][0] = i;
            ants[i][this.numVertex] = i;
        }
        var bestAnt, bestLen = null;

        var stopButton = document.getElementById("stop").addEventListener('click', event => {
            clearInterval(intervalID);
        });

        intervalID = setInterval(() => {
            for (var i = 0; i < ants.length; ++i) {
                var choice = [];
                for (var j = 0; j < this.numVertex; ++j) {
                    if (j != ants[i][0]) {
                        choice.push({
                            num: j,
                            prob: null,
                        });
                    }
                }
                for (var j = 1; j < ants[i].length - 1; ++j) {
                    var rand = Math.random();
                    var totalAttr = 0;
                    for (var l = 0; l < choice.length; ++l) {
                        totalAttr += (faces[ants[i][j - 1]][choice[l].num].pher ** alfa) * ((1 / faces[ants[i][j - 1]][choice[l].num].len) ** beta);
                    }
                    for (var l = 0; l < choice.length; ++l) {
                        choice[l].prob = ((faces[ants[i][j - 1]][choice[l].num].pher ** alfa) * ((1 / faces[ants[i][j - 1]][choice[l].num].len) ** beta)) / totalAttr;
                    }
                    var probSum = choice[0].prob, sel = 0;
                    while (sel < choice.length) {
                        if (probSum < rand) {
                            ++sel;
                            probSum += choice[sel].prob;
                        }
                        else {
                            ants[i][j] = choice[sel].num;
                            choice.splice(sel, 1);
                            break;
                        }
                    }
                }
            }

            for (var i = 0; i < faces.length; ++i) {
                for (var j = 0; j < faces[i].length; ++j) {
                    faces[i][j].pher *= p;
                }
            }

            for (var i = 0; i < ants.length; ++i) {
                var length = 0;
                for (var j = 0; j < ants[i].length - 1; ++j) {
                    length += faces[ants[i][j]][ants[i][j + 1]].len;
                }
                if (bestLen > length || bestLen == null) {
                    bestLen = length;
                    bestAnt = [];
                    for (var j = 0; j < ants[i].length; ++j) {
                        bestAnt.push(ants[i][j]);
                    }
                }
                var left = Q / length;

                for (var j = 0; j < ants[i].length - 1; ++j) {
                    faces[ants[i][j]][ants[i][j + 1]].pher += left;
                    faces[ants[i][j + 1]][ants[i][j]].pher += left;
                }
            }

            this.canvas.objects.splice(this.numVertex, this.canvas.objects.length);
            for (var i = 0; i < bestAnt.length - 1; ++i) {
                this.canvas.addObject("line", "#fff", false, this.canvas.objects[bestAnt[i]].x + this.canvas.objects[bestAnt[i]].width / 2, this.canvas.objects[bestAnt[i]].y + this.canvas.objects[bestAnt[i]].height / 2, this.canvas.objects[bestAnt[i + 1]].x + this.canvas.objects[bestAnt[i + 1]].width / 2, this.canvas.objects[bestAnt[i + 1]].y + this.canvas.objects[bestAnt[i + 1]].height / 2);
                this.canvas.objects[this.canvas.objects.length - 1].lineWidth = 2;
            }

        }, 10);
    }

    startButton() {
        var start = document.getElementById("start").addEventListener('click', event => {
            if (this.numVertex > 2) {
                this.canvas.canvas.onmousedown = null;
                this.canvas.canvas.onmousemove = null;
                this.AntCO();
            }
        });
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