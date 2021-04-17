"use strict";
import { DiscreteArea } from "./engine/render.js"

class Program {
    constructor() {
        this.canvas = new DiscreteArea("canvas", 500, 1, 25, 0);
        this.canvas.setMouseDraw(true);
        this.canvas.mouseDraw(1, "#f00");
    }
}

window.onload = new Program();