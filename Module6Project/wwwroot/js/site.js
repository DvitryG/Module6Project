var input = document.getElementById('input');
var output = document.getElementById('output');

input.addEventListener('keydown', command);

function command(e) {
    if (e.keyCode === 13) {
        var enterCom = input.value;
        input.value = null;
        output.innerHTML += `<pre>$ ${enterCom}</pre>`;
        if (enterCom == "help") {
            output.innerHTML += `<pre>help:\n    run []\n    reload\n    stop</pre>`;
        }
        else if (enterCom.match(/^run/) == "run") {
            if (enterCom == "run list") output.innerHTML += `<pre>run list:\n    AStar.js\n    ClustAnalys.js\n    GenAlg.js\n    AntCO.js</pre>`;
            else if (enterCom == "run AStar.js") {
                document.location.replace("/algorithms/AStar");
            }
            else if (enterCom == "run ClustAnalys.js") {
                document.location.replace("/algorithms/ClusterAnalysis");
            }
            else if (enterCom == "run GenAlg.js") {
                document.location.replace("/algorithms/GeneticAlgorithm");
            }
            else if (enterCom == "run AntCO.js") {
                document.location.replace("/algorithms/AntCO");
            }
            else output.innerHTML += `<pre>Unknown type. Type "run list" for help</pre>`;
        }
        else if (enterCom == "reload") {
            window.location.reload();
        }
        else if (enterCom == "stop") {
            document.location.replace("/Index");
        }
        else {
            output.innerHTML += `<pre>Unknown command. Type "help" for help</pre>`;
        }
    }
}

/**/

var speed = 15;
var svg = document.getElementById('svg');
var content = document.getElementById('content');
content.style.display = `none`;
var size = 100;
svg.style.height = `${size}%`;
svg.style.width = `${size}%`;
var intervalID = setInterval(load, speed);

function load() {
    if (size >= 10) {
        size -= 1;
        svg.style.height = `${size}%`;
        svg.style.width = `${size}%`;
    }
    else {
        clearInterval(intervalID);
        content.style.display = `block`;
    }
}
