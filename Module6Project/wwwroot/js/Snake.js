﻿// функция рисует под углом angle линию из указанной точки длиной ln
function drawLine(x, y, ln, angle) {
    context.moveTo(x, y);
    context.lineTo(Math.round(x + ln * Math.cos(angle)), Math.round(y - ln * Math.sin(angle)));
}
// Функция рисует дерево
function drawTree(x, y, ln, minLn, angle) {
    if (ln > minLn) {
        ln = ln * 0.75;
        drawLine(x, y, ln, angle);
        x = Math.round(x + ln * Math.cos(angle));
        y = Math.round(y - ln * Math.sin(angle));
        drawTree(x, y, ln, minLn, angle + Math.PI / 4);
        drawTree(x, y, ln, minLn, angle - Math.PI / 6);
        // если поставить угол Math.PI/4 , то выйдет классическое дерево
    }
}
// Инициализация переменных
function init() {
    var canvas = document.getElementById("tree"),
        x = 100 + (canvas.width / 2),
        y = 170 + canvas.height,  // положении ствола
        ln = 120,                  // начальная длина линии
        minLn = 5;                    // минимальная длина линии
    canvas.width = 480; // Ширина холста
    canvas.height = 320; // высота холста 
    context = canvas.getContext('2d');
    context.fillStyle = '#ddf'; // цвет фона
    context.strokeStyle = '#020'; //цвет линий
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 2; // ширина линий
    context.beginPath();
    drawTree(x, y, ln, minLn, Math.PI / 2);
    context.stroke();
}

window.onload = init;