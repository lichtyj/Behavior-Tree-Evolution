class Graphing {
    constructor() {
        this.data = [];
        this.deathData = [];
        this.deaths = [];
        this.deathTypes = [];
        this.population = [];
        this.min = [];
        this.max = [];
        this.ctx;
        this.buckets = 20;

        this.timeSlice = 0;
        this.maxTime = 600;
    }

    dumpData() {
        var dumpString = "Population, ";
        var i, j, k;
        
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

        return dumpString;
    }

    init(ctx) {
        this.ctx = ctx;
        var i, j;

        this.min = new Array(DNA.names.length);
        this.max = new Array(DNA.names.length);

        for (i = 0; i < DNA.names.length; i++) {
            this.data[i] = new Array(this.buckets);
            this.min[i] = this.buckets;
            this.max[i] = 0;
            for(j = 0; j < this.buckets; j++) {
                this.data[i][j] = new Array();
            }
        }
    }

    logDeath(cause) {
        if (this.deaths[cause] == undefined) {
            this.deaths[cause] = 1;
            this.deathData[this.deathTypes.length] = [];
            for (var i = 0; i < this.timeSlice; i++) {
                this.deathData[this.deathTypes.length][i] = 0;
            }
            this.deathData[this.deathTypes.length][this.timeSlice] = 1;
            this.deathTypes.push(cause); 
        } else {
            this.deaths[cause]++;
            this.deathData[this.deathTypes.indexOf(cause)][this.timeSlice]++;
        } 
    }

    logTimeSlice() {
        var npc = game.getNpcs();
        var n,i,j;
        var bucket;

        for (n = 0; n < npc.length; n++) {
            for (i = 0; i < DNA.names.length; i++) {
                for(j = 0; j < this.buckets; j++) {
                    this.data[i][j].push(0);
                }
                bucket = this.getBucket(i, npc[n].dna.gene[DNA.names[i]]);
                if (this.max[i] < bucket) this.max[i] = bucket;
                if (this.min[i] > bucket) this.min[i] = bucket;

                if (bucket == this.buckets) bucket--;
                var dataWeight = 1;
                if (npc[n].isMale) dataWeight *= 1000;
                dataWeight += 1000000*npc[n].generation;
                this.data[i][bucket][this.timeSlice] += dataWeight;
            }
        }

        this.population.push(npc.length);
        if (this.timeSlice == this.maxTime) {
            game.endSimulation("Success!");
        }
        this.timeSlice++;

        for (i = 0; i < this.deathTypes.length; i++) {
            this.deathData[i][this.timeSlice] = 0;
        }

        // this.drawPlots();
    }

    getBucket(geneIndex, value) {
        return (value / ((DNA.max[geneIndex] - DNA.min[geneIndex]) / this.buckets)) | 0;
    }

    clearCanvas() {
        this.ctx.canvas.width = dataWidth;
    }

    drawPlots() {
        this.clearCanvas();
        var height = 50;
        var y = 20;
        var k = 0;
        this.drawPlot(8, y + height * k++, "Population", this.population);
    
        for (var j = 0; j < this.deathTypes.length; j++) {
            this.drawPlot(8, y + height * k++, this.deathTypes[j], this.deathData[j]);
        }

        for (var i = 0; i < DNA.names.length; i++) {
            this.scatterPlot(8, y + height * (i + k), DNA.names[i], i);
        }

        this.drawBarGraph(616, y, "Deaths", this.deathTypes, this.deaths);
    }

    drawPlotsFromData(population, deathTypes, deathData) {
        this.clearCanvas();
        var height = 70;
        var y = 20;
        var k = 0;
        this.drawPlot(8, y + height * k++, "Population", population);
    
        for (var j = 0; j < deathTypes.length; j++) {
            this.drawPlot(8, y + height * k++, deathTypes[j], deathData[deathTypes[j]]);
        }

        for (var i = 0; i < DNA.names.length; i++) {
            this.scatterPlotFromData(8, y + height * (i + k), DNA.names[i], i, data);
        }
    }

    scatterPlotFromData(x, y, title, gene, data) {
        var buckets = data[0].length; 
        var increments = 50;
        var bucketSize = 2;
        var width = data[0][0].length * bucketSize;
        var height = buckets*bucketSize;

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "Grey";
        this.ctx.rect(x-2, y-2, width + 4, height + 6);
        this.ctx.stroke();

        var value;
        var males;
        var females;
        var generation;

        for (var j = 0; j < buckets; j++) {
            for (var i = 0; i < data[0][0].length; i++) {
                this.ctx.beginPath();
                // value = (255 - data[gene][j][i]*10);
                value = data[gene][j][i];
                females = value % 1000;
                males = (value % 1000000) / 1000;
                generation = value / 1000000; 
                this.ctx.fillStyle = "rgb(" + (255 - males * 20) + ", " + (255 - generation) + ", " + (255 - females * 20) + ")";
                this.ctx.rect(x + i * bucketSize, y + (buckets - j)*bucketSize, bucketSize, -bucketSize);
                this.ctx.fill();
            }
        }
        for (var i = 0; i < increments; i++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = i % 2 === 0 ? "Black" : "LightGrey";
            this.ctx.rect(x + width/increments * i, y+height+1, width/increments, 2);
            this.ctx.fill();
        }

        this.ctx.fillStyle = "black";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(title, x, y-6);
    }


    drawBarGraph(x,y, title, labels, data) {
        var width = 178;
        var textHeight = 12;
        var height = labels.length * textHeight;

        this.ctx.fillStyle = "black";
        this.ctx.font = "8px Arial";
        for (var i = 0; i < labels.length; i++) {
            this.ctx.fillText(data[labels[i]] + " : " + labels[i], x, y + 8 + i * textHeight); 
        }

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "Grey";
        this.ctx.rect(x-2, y-2, width + 4, height + 6);
        this.ctx.stroke();

        this.ctx.fillStyle = "black";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(title, x, y-6); 
    }

    scatterPlot(x, y, title, gene) { 
        var width = this.maxTime;
        var increments = 50;
        var bucketSize = 1;
        var height = this.buckets*bucketSize;

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "Grey";
        this.ctx.rect(x-2, y-2, width + 4, height + 6);
        this.ctx.stroke();

        var value;
        var males;
        var females;
        var generation;

        for (var j = 0; j < this.buckets; j++) {
            for (var i = 0; i < this.timeSlice; i++) {
                this.ctx.beginPath();
                // value = (255 - this.data[gene][j][i]*10);
                // value = "#000";
                value = this.data[gene][j][i];
                females = value % 1000;
                males = (value % 1000000) / 1000;
                generation = value / 1000000; 
                this.ctx.fillStyle = "rgb(" + (255 - males * 20) + ", " + (255 - (generation/50)) + ", " + (255 - females * 20) + ")";
                this.ctx.rect(x + i * bucketSize, y + (this.buckets - j)*bucketSize, bucketSize, -bucketSize);
                this.ctx.fill();
            }
        }
        for (var i = 0; i < increments; i++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = i % 2 === 0 ? "Black" : "LightGrey";
            this.ctx.rect(x + width/increments * i, y+height+1, width/increments, 2);
            this.ctx.fill();
        }

        this.ctx.fillStyle = "black";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(title, x, y-6);
    }

    drawPlot = function (x,y,title, series) {
        var height = 20;
        var lineWidth = 1;
        var increments = 50;
        var max = series[0];
        var min = max;
        var width = series.length * lineWidth;

        for (var i = 0; i < series.length; i++) {
            if (series[i] > max) max = series[i];
            if (series[i] < min) min = series[i];
        }
        if (max <= 0) max = 0.1;

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "Grey";
        this.ctx.rect(x-2, y-2, width + 4, height + 6);
        this.ctx.stroke();

        var avg = 0;

        for (var i = 0; i < series.length; i++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = "Red";
            var value = series[i];
            value = value/max*height;
            avg += value;
            this.ctx.rect(x + (i * lineWidth), y + height, lineWidth, -value);
            this.ctx.fill();
        }
        if (series.length > 0) {
            this.ctx.fillStyle = "#000";
            avg /= (series.length);
            this.ctx.beginPath();
            this.ctx.rect(x, y+height-avg, width, -1);
    
            this.ctx.fill();
        }
        for (var i = 0; i < increments; i++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = i % 2 === 0 ? "Black" : "LightGrey";
            this.ctx.rect(x + width/increments * i, y+height+1, width/increments, 2);
            this.ctx.fill();
        }

        this.ctx.fillStyle = "black";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(title + " - " + min + " | " + (avg/height*max).toFixed(4) + " | " + max, x, y-6);
    }
}