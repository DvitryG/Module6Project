"use strict";
import { Canvas } from "./engine/render.js";

function colors(canvas) {
    canvas.mouseDraw(0, "None");
    var colors = document.getElementById("colors").addEventListener('change', event => {
        for (var opt of event.target.children) {
            if (opt.selected) {
                if (opt.value == 0) canvas.mouseDraw(opt.value, "None");
                else if (opt.value == 1) canvas.mouseDraw(opt.value, "#000");
                else if (opt.value == 2) canvas.mouseDraw(opt.value, "#f2f");
                else if (opt.value == 3) canvas.mouseDraw(opt.value, "#ff3");
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

function start(canvas) {
    var start = document.getElementById("start").addEventListener('click', event => {
        canvas.setMouseDraw(false);
    });
}

function init() {
    var canvas = new Canvas("canvas", 500, 40, 50, 1);
    canvas.drawGrid("#000");
    colors(canvas);
    generators(canvas);
    start(canvas);

}

window.onload = init;