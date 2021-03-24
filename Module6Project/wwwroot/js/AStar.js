"use strict";
import { Canvas, Point } from "./engine/render.js";

function colors(canvas) {
    var start = new Point(canvas, 2, "#f0f");
    var finish = new Point(canvas, 2, "#0ff");

    canvas.mouseDraw(0, "void");
    var colors = document.getElementById("colors").addEventListener('change', event => {
        for (var opt of event.target.children) {
            if (opt.selected) {
                if (opt.value == 0) canvas.mouseDraw(0, "void");
                else if (opt.value == 1) canvas.mouseDraw(opt.value, "#000");
                else if (opt.value == 2) start.drawPoint();
                else if (opt.value == 3) finish.drawPoint();
                else console.log(`Неизвесное значение: ${opt.value}`);
            }
        }
    });
}

function generators(canvas) {
    var generators = document.getElementById("generators").addEventListener('change', event => {
        for (var opt of event.target.children) {
            if (opt.selected) {
            /*none*/
            }
        }
    });
}

function startButton(canvas) {
    var start = document.getElementById("start").addEventListener('click', event => {
        canvas.setMouseDraw(false);
    });
}



function init() {
    var canvas = new Canvas("canvas", 500, 40, 50, 1);
    canvas.drawGrid("#000");
    canvas.setMouseDraw(true);
    colors(canvas);
    generators(canvas);
    startButton(canvas);

}

window.onload = init;