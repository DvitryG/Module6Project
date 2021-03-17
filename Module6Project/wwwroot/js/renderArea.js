function init(array) {
    var canvas = document.getElementById("area");
    canvas.width = array.lenght();
    canvas.height = size;
    addColor(test, 1, 0, 0, 0);
}

function addColor(name, value, r, g, b) {
    var select = document.getElementById("colors");
    var option = document.createElement('option');
    option.value = value;
    option.addEventListener('click', function changeColor(e) {
        context.strokeStyle = e.target.style.backgroundColor;
    });
    option.style.backgroundColor = ('rgb(' + r + ", " + g + ", " + b + ")");
    select.appendChild(option);
}