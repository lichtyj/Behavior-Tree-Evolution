/*

Format for database
Separate male female data
data string that describes 

generation number

Turn off drifting genes

Paper: reference behavior trees
target length: 5 - 8 pages
btree diagram
the interesting graphs

*/

var graphing = new Graphing();
var files;
var data = [];
var deathData = [];
var deaths = [];
var deathTypes = [];
var population = [];
var min = [];
var max = [];
var buckets = 20;
var dataWidth = 1300;
var dataHeight = 2500;
var fileIndex = 1;

// function reset() {
//     var data = [];
// var deathData = [];
// var deaths = [];
// var deathTypes = [];
// var population = [];
//     min = [];
//     max = [];
// }

function handleFileSelect(evt) {
    files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    console.log("working...");
    for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
            '</li>');
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (regex.test(f.name)) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    if (fileIndex == 1) {
                        makeData(e);
                    } else {
                        addData(e, fileIndex);
                    }
                    fileIndex++;
                }
                reader.readAsText(f);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Not a valid CSV.");
        }
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    console.log("done.");
}

document.addEventListener("DOMContentLoaded", function() {

    var socket = io.connect("http://24.16.255.56:8888");
  
    socket.on("load", function (data) {
        console.log(data);
    });

    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    var dCanvas = document.getElementById("dataCanvas");
    dCanvas.width = dataWidth;
    dCanvas.height = dataHeight;
    // dCanvas.style.imageRendering = "Pixelated";
    var dCtx = dCanvas.getContext('2d', { alpha: true });
    graphing.init(dCtx);
});

function Save() {
    console.log("save");
    socket.emit("save", { studentname: "Josh Lichty", statename: "TestData", data: "Hello World" });
}

function Load() {
    console.log("load");
    socket.emit("load", { studentname: "Josh Lichty", statename: "TestData" });
}

function makeData(e) {

    for (i = 0; i < DNA.names.length; i++) {
        data[i] = new Array(buckets);
        min[i] = buckets;
        max[i] = 0;
        for(j = 0; j < buckets; j++) {
            data[i][j] = new Array();
        }
    }

    var rows = e.target.result.split("\n");
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].split(", ");
        if (i == 0) {
            deathTypes.push(cells[1]);
            deathTypes.push(cells[2]);
            deathTypes.push(cells[3]);
            deathTypes.push(cells[4]);
            deathTypes.push(cells[5]);
            deathData[cells[1]] = [];
            deathData[cells[2]] = [];
            deathData[cells[3]] = [];
            deathData[cells[4]] = [];
            deathData[cells[5]] = [];

        } else {
            for (var j = 0; j < cells.length; j++) {
                switch (j) {
                    case 0:
                        population.push(cells[j]);
                        break;
                    case 1:
                        deathData[deathTypes[0]].push(cells[j]);
                        break;
                    case 2:
                        deathData[deathTypes[1]].push(cells[j]);
                        break;
                    case 3:
                        deathData[deathTypes[2]].push(cells[j]);
                        break;
                    case 4:
                        deathData[deathTypes[3]].push(cells[j]);
                        break;
                    case 5:
                        deathData[deathTypes[4]].push(cells[j]);
                        break;
                    default:
                        data[(j - 6) / buckets | 0][(j - 6) % buckets].push(cells[j]);
                }
            }
        }
    }
    graphing.drawPlotsFromData(population, deathTypes, deathData);
}

function addData(e, index) {
    console.log("i: " + index);
    var time;
    var rows = e.target.result.split("\n");
    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].split(", ");
        for (var j = 0; j < cells.length; j++) {
            time = (i - 1);
            switch (j) {
                case 0:
                    population[time] = population[time] * (index-1)/index + cells[j] * (1/index);
                    break;
                case 1:
                    deathData[deathTypes[0]][time] = deathData[deathTypes[0]][time] * (index-1)/index + cells[j] * (1/index);
                    break;
                case 2:
                    deathData[deathTypes[1]][time] = deathData[deathTypes[1]][time] * (index-1)/index + cells[j] * (1/index);
                    break;
                case 3:
                    deathData[deathTypes[2]][time] = deathData[deathTypes[2]][time] * (index-1)/index + cells[j] * (1/index);
                    break;
                case 4:
                    deathData[deathTypes[3]][time] = deathData[deathTypes[3]][time] * (index-1)/index + cells[j] * (1/index);
                    break;
                case 5:
                    deathData[deathTypes[4]][time] = deathData[deathTypes[4]][time] * (index-1)/index + cells[j] * (1/index);
                    break;
                default:
                    data[(j - 6) / buckets | 0][(j - 6) % buckets][time] = data[(j - 6) / buckets | 0][(j - 6) % buckets][time] * (index-1)/index + cells[j] * (1/index);
            }
        }
    }
    graphing.drawPlotsFromData(population, deathTypes, deathData);
}

/*

        for (i = 0; i < this.deathTypes.length; i++) {
            dumpString += this.deathTypes[i] + ", ";
        }
        for (i = 0; i < DNA.names.length; i++) {
            for (j = 0; j < this.buckets; j++) {
                dumpString += DNA.names[i] + "[" + j + "]";
                (i == DNA.names.length - 1 && j == this.buckets - 1) ? dumpString += "\n " : dumpString += ", ";
            }
        }

        for (i = 0; i < this.timeSlice; i++) {
            dumpString += this.population[i] + ", ";
            for (j = 0; j < this.deathTypes.length; j++) {
                dumpString += this.deathData[j][i] + ", ";
            }
            for (j = 0; j < DNA.names.length; j++) {
                for (k = 0; k < this.buckets; k++) {
                    dumpString += this.data[j][k][i];
                    (j == DNA.names.length - 1 && k == this.buckets - 1) ? dumpString += "\n" : dumpString += ", ";
                }
            }
        }

*/