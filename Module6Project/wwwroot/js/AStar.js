"use strict";
import {Canvas} from "./engine/render.js"

function init() {
    var canvas = new Canvas("canvas", 500, 40, 50, 1);
    canvas.drawGrid("#000");
    canvas.onMouseDraw(1, "#f00");
}

window.onload = init;