﻿"use strict";
//import { Callbacks } from "jquery";
import { SmoothArea } from "./engine/render.js"

class Program {
    constructor() {
        this.canvas = new SmoothArea("canvas", 500, 1000);
        this.mouseLogic(true, "circle", "#000", true, 20, 20);
        this.startButton();
        this.canvas.setSpeed(10);

        this.numIndivids = null;
        this.numVertex = 0;
    }

    GAlg() {
        if (this.numVertex < 3 || this.numIndivids == null) {
            console.log(`Вы в своем уме, увОжаемый?`);
            return;
        }
        var intervalID;
        var lengthFaces = new Array(this.numVertex);
        for (var i = 0; i < lengthFaces.length; ++i) {
            lengthFaces[i] = new Array(this.numVertex);
            for (var j = 0; j < lengthFaces[i].length; ++j) {
                lengthFaces[i][j] = Math.sqrt((this.canvas.objects[i].x - this.canvas.objects[j].x) ** 2 + (this.canvas.objects[i].y - this.canvas.objects[j].y) ** 2);
            }
        }
        var individs = new Array(this.numIndivids);
        for (var i = 0; i < individs.length; ++i) {
            individs[i] = new Array(this.numVertex + 1);
            var choice = [];
            for (var j = 1; j < this.numVertex; ++j) {
                choice.push(j);
            }
            for (j = 1; j < this.numVertex; ++j) {
                var rand = Math.random();
                var sum = 1 / choice.length, sel = 0;
                while (sel < choice.length) {
                    if (sum < rand) {
                        ++sel;
                        sum += 1 / choice.length;
                    }
                    else {
                        individs[i][j] = choice[sel];
                        choice.splice(sel, 1);
                        break;
                    }
                }
            }
            individs[i][0] = 0;
            individs[i][this.numVertex] = 0;
        }
        var bestWay, bestLen = null;

        var stopButton = document.getElementById("stop").addEventListener('click', event => {
            clearInterval(intervalID);
        });


        intervalID = setInterval(() => {
            var bestStepInd = 0, bestStepLen = null;
            /*for (var j = 0; j < individs[0].length - 1; ++j) {
                minNum += lengthFaces[individs[0][j]][individs[0][j + 1]];
            }*/
            for (var i = 0; i < individs.length; ++i) {
                var way = 0;
                for (var j = 0; j < individs[i].length - 1; ++j) {
                    way += lengthFaces[individs[i][j]][individs[i][j + 1]];
                }

                if (bestStepLen > way || bestStepLen == null) {
                    bestStepLen = way;
                    bestStepInd = i;
                }
            }

            if (bestLen > bestStepLen || bestLen == null) {
                bestLen = bestStepLen;
                bestWay = [];
                for (var j = 0; j < individs[bestStepInd].length; ++j) {
                    bestWay.push(individs[bestStepInd][j]);
                }
            }

            this.canvas.objects.splice(this.numVertex, this.canvas.objects.length);
            for (var j = 0; j < bestWay.length - 1; ++j) {
                this.canvas.addObject("line", "#000", false, this.canvas.objects[bestWay[j]].x + this.canvas.objects[bestWay[j]].width / 2, this.canvas.objects[bestWay[j]].y + this.canvas.objects[bestWay[j]].height / 2, this.canvas.objects[bestWay[j + 1]].x + this.canvas.objects[bestWay[j + 1]].width / 2, this.canvas.objects[bestWay[j + 1]].y + this.canvas.objects[bestWay[j + 1]].height / 2);
                this.canvas.objects[this.canvas.objects.length - 1].lineWidth = 2;
            }

            for (var i in individs) {
                for (var j in individs[i]) {
                    individs[i][j] = individs[bestStepInd][j];
                }
                var j1 = parseInt(Math.random() * (individs[i].length - 2) + 1);
                var j2 = parseInt(Math.random() * (individs[i].length - 2) + 1);
                var c = individs[i][j1];
                individs[i][j1] = individs[i][j2];
                individs[i][j2] = c;
            }
            console.log(`${bestLen}: ${bestWay}`);
        }, 10);
    }

    startButton() {
        var start = document.getElementById("start").addEventListener('click', event => {
            this.canvas.canvas.onmousedown = null;
            this.canvas.canvas.onmousemove = null;
            this.numIndivids = this.individInput();
            this.GAlg();

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