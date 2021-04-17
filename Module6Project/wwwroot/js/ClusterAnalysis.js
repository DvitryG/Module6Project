"use strict";
import { SmoothArea } from "./engine/render.js"

class Program {
    constructor() {
        this.canvas = new SmoothArea("canvas", 500, 1128);
        this.mouseLogic(true, "circle", "#fff", true, 30, 30);
        this.startButton();
        this.canvas.setSpeed(10);
        this.numVertex = 0;
        this.numClusters = 0;
    }

    hierarchClust() {
        var level = 0;
        var clusters = [];
        for (var i = 0; i < this.numVertex; ++i) {
            clusters.push(i);
        }

        var distance = [];
        for (var i = 0; i < clusters.length; ++i) {
            distance[i] = [];
            for (var j = 0; j < clusters.length; ++j) {
                distance[i].push(Math.sqrt((this.canvas.objects[i].x - this.canvas.objects[j].x) ** 2 + (this.canvas.objects[i].y - this.canvas.objects[j].y) ** 2));
            }
        }
        while (clusters.length > 1 && this.numVertex - level > this.numClusters) {
            var minLen = null, minC1, minC2;
            for (var i = 0; i < clusters.length; ++i) {
                for (var j = 0; j < i; ++j) {
                    if (i != j) {
                        if (minLen > distance[i][j] || minLen == null) {
                            minLen = distance[i][j];
                            minC1 = i; minC2 = j;
                        }
                    }
                }
            }

            for (var i = 0; i < clusters.length; ++i) {
                for (var j = 0; j < clusters.length; ++j) {
                    if (i == minC1) {
                        if (j != minC2) {
                            var au = 1/2, av = 1/2, b = 0, g = 1/2;
                            distance[i][j] = au * distance[minC1][j] + av * distance[minC2][j] + b * distance[minC1][minC2] + g * Math.abs(distance[minC1][j] - distance[minC2][j]);
                        }
                    }
                }
            }

            distance.splice(minC2, 1);
            for (var i = 0; i < distance.length; ++i) {
                for (var j = 0; j < distance[i].length; ++j) {
                    if (j == minC2) {
                        distance[i].splice(minC2, 1);
                        break;
                    }
                }
            }

            clusters[minC1] = {
                subClust: [clusters[minC1], clusters[minC2]],
                distance: minLen,
                };
            clusters.splice(minC2, 1);
            ++level;
        }
        return clusters;
    }

    clustFilling(cluster, color) {
        var cluster = cluster;
        if (cluster.subClust != null) {
            for (var subCluster of cluster.subClust) {
                this.clustFilling(subCluster, color);
            }
        }
        else {
            this.canvas.objects[cluster].decor = color;
        }
        
    }

    startButton() {
        var start = document.getElementById("start").addEventListener('click', event => {
            this.numClusters = this.numClustersInput();
            if (this.numClusters > 0 && this.numClusters <= this.numVertex) {
                var clusters = this.hierarchClust();
                console.log(clusters);
                var n = 255 / this.numClusters;
                for (var i = 0; i < clusters.length; ++i) {
                    this.clustFilling(clusters[i], `rgb(${255 - n * i},${255 - n * (this.numClusters - 1 - i)},${n * (this.numClusters - 1 - i)})`);
                }
            }
        });
    }

    numClustersInput() {
        return parseInt(document.getElementById("numClusters").value, 10);
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