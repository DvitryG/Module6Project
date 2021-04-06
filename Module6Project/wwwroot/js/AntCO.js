"use strict";
import { SmoothArea } from "./engine/render.js"

function mouseLogic(canvas) {
    //console.log(`задаем логику`);
    canvas.canvas.onmousedown = (e) => {
        var mouseX = e.offsetX;
        var mouseY = e.offsetY;
        var mx, my;
        var index = null;
        var collision = false;
        for (var i in canvas.objects) {
            if (canvas.pointCollision(canvas.objects[i], mouseX, mouseY)) {
                collision = true;
                index = i;
                mx = mouseX - canvas.objects[i].x;
                my = mouseY - canvas.objects[i].y;
                break;
            }
        }
        if (!collision) {
            canvas.canvas.onmousemove = (e) => {
                if (e.buttons > 0) {
                    canvas.mouseSetObj(e, "circle", "#f00", true, 100, 100);
                }
            }
        }
        else {
            canvas.canvas.onmousemove = (e) => {
                if (e.buttons > 0) {
                    canvas.mouseCapture(e, index, mx, my);
                }
            }
        }
    }
}

function init() {
    var canvas = new SmoothArea("canvas", 500, 1000);
    canvas.objBorders = true;
    //canvas.addObject("", null, 10, 10, 100, 100);
    canvas.addObject("circle", "#000", true, 200, 200, 100, 100);
    mouseLogic(canvas);
    canvas.setSpeed(10);
}

window.onload = init;