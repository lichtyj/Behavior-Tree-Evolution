class Graphing {
    constructor() {
        this.maxSize = 200;
        this.dnaData = new Array();
        this.metabolismData = new Array();
        this.thirstData = new Array();
        this.hungerData = new Array();
        this.tSatedData = new Array();
        this.hSatedData = new Array();

        this.foodPData = new Array();
        this.attackPData = new Array();

        this.plantWData = new Array();
        this.meatWData = new Array();
        this.waterWData = new Array();

        this.energyTData = new Array();
        this.enerySData = new Array();
        this.matingTData = new Array();
        this.matingWData = new Array();
        this.matingDMData = new Array();
        this.matingDFData = new Array();
        
        this.wanderWData = new Array();
        this.uphillData = new Array();
        
        this.orientationData = new Array();
        this.cohesionData = new Array();
        this.separationData = new Array();

        this.drowningAggData = new Array();
        this.foodAggData = new Array();
        this.drinkAggData = new Array();
        this.matingAggData = new Array();
        this.wanderAggData = new Array();

        this.attackDelayData = new Array();

        this.loyaltyData = new Array();

        this.index = 0;

        this.ctx;
    }

    init(ctx) {
        this.ctx = ctx;
    }


    logDna(dna) {

        this.dnaData[this.index] = dna;
        this.metabolismData[this.index] = dna.metabolicRate;
        this.thirstData[this.index] = dna.thirstThreshold;
        this.hungerData[this.index] = dna.hungerThreshold;
        this.tSatedData[this.index] = dna.thirstSated;
        this.hSatedData[this.index] = dna.hungerSated;

        this.energyTData[this.index] = dna.energyThreshold;
        this.enerySData[this.index] = dna.energySated;

        this.matingDMData[this.index] = dna.matingDonationM;
        this.matingDFData[this.index] = dna.matingDonationF;
        this.matingTData[this.index] = dna.matingThreshold;
        this.matingWData[this.index] = dna.matingWeight;

        this.foodPData[this.index] = dna.foodPreference;
        this.attackPData[this.index] = dna.attackPreference;

        this.plantWData[this.index] = dna.plantWeight;
        this.meatWData[this.index] = dna.meatWeight;
        this.waterWData[this.index] = dna.waterWeight;

        this.wanderWData[this.index] = dna.wanderWeight;
        this.uphillData[this.index] = dna.uphillWeight;
        
        this.orientationData[this.index] = dna.orientationWeight;
        this.cohesionData[this.index] = dna.cohesionWeight;
        this.separationData[this.index] = dna.separationWeight;

        this.drowningAggData[this.index] = dna.drowningAggression;
        this.foodAggData[this.index] = dna.foodAggression;
        this.drinkAggData[this.index] = dna.drinkAggression;
        this.matingAggData[this.index] = dna.matingAggression;
        this.wanderAggData[this.index] = dna.wanderAggression;

        this.attackDelayData[this.index] = dna.attackDelay;

        this.loyaltyData[this.index] = dna.loyalty;

        this.drawPlots();

        this.index++;
        if (this.index >= this.maxSize) {
            this.index = 0;
        }
    }

    clearCanvas() {
        this.ctx.canvas.width = dataWidth;
    }

    drawPlots() {
        this.clearCanvas();
        var height = 60;
        var y = 20;
        this.drawPlot(8, y, "Metabolic Rates", this.metabolismData);
        this.drawPlot(8, y+= height, "Thirst Thresholds", this.thirstData);
        this.drawPlot(8, y+= height, "Hunger Thesholds", this.hungerData);
        this.drawPlot(8, y+= height, "Thirst Sated", this.tSatedData);
        this.drawPlot(8, y+= height, "Hunger Sated", this.hSatedData);
        
        this.drawPlot(8, y+= height, "Energy Threshold", this.energyTData);
        this.drawPlot(8, y+= height, "Energy Sated", this.enerySData);
        
        this.drawPlot(8, y+= height, "Mating Threshold", this.matingTData);
        this.drawPlot(8, y+= height, "Mating Donation (Male)", this.matingDMData);
        this.drawPlot(8, y+= height, "Mating Donation (Female)", this.matingDFData);
        this.drawPlot(8, y+= height, "Mating Weight", this.matingWData);
        
        this.drawPlot(8, y+= height, "Food Preference", this.foodPData);
        this.drawPlot(8, y+= height, "Attack Preference", this.attackPData);

        this.drawPlot(8, y+= height, "Plant Weight", this.plantWData);
        this.drawPlot(8, y+= height, "Meat Weight", this.meatWData);
        this.drawPlot(8, y+= height, "Water Weight", this.waterWData);
        
        this.drawPlot(8, y+= height, "Wander Weight", this.wanderWData);
        this.drawPlot(8, y+= height, "Uphill Weight", this.uphillData);
        
        this.drawPlot(8, y+= height, "Orientation Weight", this.orientationData);
        this.drawPlot(8, y+= height, "Cohesion Weight", this.cohesionData);
        this.drawPlot(8, y+= height, "Separation Weight", this.separationData);

        this.drawPlot(8, y+= height, "Drowning Aggression", this.drowningAggData);
        this.drawPlot(8, y+= height, "Food Aggression", this.foodAggData);
        this.drawPlot(8, y+= height, "Drink Aggression", this.drinkAggData);
        this.drawPlot(8, y+= height, "Mating Aggression", this.matingAggData);
        this.drawPlot(8, y+= height, "Wander Aggression", this.wanderAggData);

        this.drawPlot(8, y+= height, "Attack Delay", this.attackDelayData);

        this.drawPlot(8, y+= height, "Loyalty", this.loyaltyData);
    }

    drawPlot = function (x,y,label, series) {
        var height = 15
        var max = 0;

        for (var i = 0; i < series.length; i++)
            if (series[i] > max) max = series[i];
        if (max <= 0) max = 0.1;

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "Grey";
        this.ctx.rect(x-2, y-2, 204, height + 15);
        this.ctx.stroke();

        var avg = 0;

        for (var i = 0; i < series.length; i++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = "Red";
            var value = series[i];
            value = value/max*height;
            avg += value;
            this.ctx.rect(x + (i), y+ height + 9, 1, -value);
            this.ctx.fill();
        }
        if (series.length > 0) {
            this.ctx.fillStyle = "#000";
            avg /= (series.length);
            this.ctx.beginPath();
            this.ctx.rect(x, y+height+9-avg, series.length, -1);
    
            this.ctx.fill();
        }
        for (var i = 0; i < 10; i++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = i % 2 === 0 ? "Black" : "LightGrey";
            this.ctx.rect(x + 20 * i, y+height+9, 20, 2);
            this.ctx.fill();
        }

        this.ctx.fillStyle = "black";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(label + " (avg = " + (avg/height*max).toFixed(4) + ")", x, y-6);
    }
}


/*
class Graphing {
    constructor() {
        this.maxSize = 1000;
        this.dnaData = new Array();
        this.metabolismData = new Array();
        this.thirstData = new Array();
        this.hungerData = new Array();
        this.tSatedData = new Array();
        this.hSatedData = new Array();

        this.foodPData = new Array();
        this.attackPData = new Array();

        this.plantWData = new Array();
        this.meatWData = new Array();
        this.waterWData = new Array();

        this.energyTData = new Array();
        this.enerySData = new Array();
        this.matingTData = new Array();
        this.matingWData = new Array();
        this.matingDMData = new Array();
        this.matingDFData = new Array();
        
        this.wanderWData = new Array();
        this.uphillData = new Array();
        
        this.orientationData = new Array();
        this.cohesionData = new Array();
        this.separationData = new Array();

        this.drowningAggData = new Array();
        this.foodAggData = new Array();
        this.drinkAggData = new Array();
        this.matingAggData = new Array();
        this.wanderAggData = new Array();

        this.attackDelayData = new Array();

        this.index = 0;

        this.ctx;
    }

    init(ctx) {
        this.ctx = ctx;
        this.initArrays();
    }

    initArrays() {
        this.dnaData[this.index] = new Array();
        this.metabolismData[this.index] = new Array();
        this.thirstData[this.index] = new Array();
        this.hungerData[this.index] = new Array();
        this.tSatedData[this.index] = new Array();
        this.hSatedData[this.index] = new Array();

        this.energyTData[this.index] = new Array();
        this.enerySData[this.index] = new Array();

        this.matingDMData[this.index] = new Array();
        this.matingDFData[this.index] = new Array();

        this.matingTData[this.index] = new Array();
        this.matingWData[this.index] = new Array();

        this.foodPData[this.index] = new Array();
        this.attackPData[this.index] = new Array();

        this.plantWData[this.index] = new Array();
        this.meatWData[this.index] = new Array();
        this.waterWData[this.index] = new Array();

        this.wanderWData[this.index] = new Array();
        this.uphillData[this.index] = new Array();
        
        this.orientationData[this.index] = new Array();
        this.cohesionData[this.index] = new Array();
        this.separationData[this.index] = new Array();

        this.drowningAggData[this.index] = new Array();
        this.foodAggData[this.index] = new Array();
        this.drinkAggData[this.index] = new Array();
        this.matingAggData[this.index] = new Array();
        this.wanderAggData[this.index] = new Array();

        this.attackDelayData[this.index] = new Array();
    }

    logDna(dna) {

        if (this.dnaData[this.index].length >= this.maxSize) {
            this.index++;
            this.initArrays();
        }

        this.dnaData[this.index].push(dna);
        this.metabolismData[this.index].push(dna.metabolicRate);
        this.thirstData[this.index].push(dna.thirstThreshold);
        this.hungerData[this.index].push(dna.hungerThreshold);
        this.tSatedData[this.index].push(dna.thirstSated);
        this.hSatedData[this.index].push(dna.hungerSated);

        this.energyTData[this.index].push(dna.energyThreshold);
        this.enerySData[this.index].push(dna.energySated);

        this.matingDMData[this.index].push(dna.matingDonationM);
        this.matingDFData[this.index].push(dna.matingDonationF);
        this.matingTData[this.index].push(dna.matingThreshold);
        this.matingWData[this.index].push(dna.matingWeight);

        this.foodPData[this.index].push(dna.foodPreference);
        this.attackPData[this.index].push(dna.attackPreference);

        this.plantWData[this.index].push(dna.plantWeight);
        this.meatWData[this.index].push(dna.meatWeight);
        this.waterWData[this.index].push(dna.waterWeight);

        this.wanderWData[this.index].push(dna.wanderWeight);
        this.uphillData[this.index].push(dna.uphillWeight);
        
        this.orientationData[this.index].push(dna.orientationWeight);
        this.cohesionData[this.index].push(dna.cohesionWeight);
        this.separationData[this.index].push(dna.separationWeight);

        this.drowningAggData[this.index].push(dna.drowningAggression);
        this.foodAggData[this.index].push(dna.foodAggression);
        this.drinkAggData[this.index].push(dna.drinkAggression);
        this.matingAggData[this.index].push(dna.matingAggression);
        this.wanderAggData[this.index].push(dna.wanderAggression);

        this.attackDelayData[this.index].push(dna.attackDelay);

        this.drawPlots();
    }

    clearCanvas() {
        this.ctx.canvas.width = dataWidth;
    }

    drawPlots() {
        this.clearCanvas();
        var height = 60;
        var y = 20;
        this.drawPlot(8, y, "Metabolic Rates", this.metabolismData[this.index]);
        this.drawPlot(8, y+= height, "Thirst Thresholds", this.thirstData[this.index]);
        this.drawPlot(8, y+= height, "Hunger Thesholds", this.hungerData[this.index]);
        this.drawPlot(8, y+= height, "Thirst Sated", this.tSatedData[this.index]);
        this.drawPlot(8, y+= height, "Hunger Sated", this.hSatedData[this.index]);
        
        this.drawPlot(8, y+= height, "Energy Threshold", this.energyTData[this.index]);
        this.drawPlot(8, y+= height, "Energy Sated", this.enerySData[this.index]);
        
        this.drawPlot(8, y+= height, "Mating Threshold", this.matingTData[this.index]);
        this.drawPlot(8, y+= height, "Mating Donation (Male)", this.matingDMData[this.index]);
        this.drawPlot(8, y+= height, "Mating Donation (Female)", this.matingDFData[this.index]);
        this.drawPlot(8, y+= height, "Mating Weight", this.matingWData[this.index]);
        
        this.drawPlot(8, y+= height, "Food Preference", this.foodPData[this.index]);
        this.drawPlot(8, y+= height, "Attack Preference", this.attackPData[this.index]);

        this.drawPlot(8, y+= height, "Plant Weight", this.plantWData[this.index]);
        this.drawPlot(8, y+= height, "Meat Weight", this.meatWData[this.index]);
        this.drawPlot(8, y+= height, "Water Weight", this.waterWData[this.index]);
        
        this.drawPlot(8, y+= height, "Wander Weight", this.wanderWData[this.index]);
        this.drawPlot(8, y+= height, "Uphill Weight", this.uphillData[this.index]);
        
        this.drawPlot(8, y+= height, "Orientation Weight", this.orientationData[this.index]);
        this.drawPlot(8, y+= height, "Cohesion Weight", this.cohesionData[this.index]);
        this.drawPlot(8, y+= height, "Separation Weight", this.separationData[this.index]);

        this.drawPlot(8, y+= height, "Drowning Aggression", this.drowningAggData[this.index]);
        this.drawPlot(8, y+= height, "Food Aggression", this.foodAggData[this.index]);
        this.drawPlot(8, y+= height, "Drink Aggression", this.drinkAggData[this.index]);
        this.drawPlot(8, y+= height, "Mating Aggression", this.matingAggData[this.index]);
        this.drawPlot(8, y+= height, "Wander Aggression", this.wanderAggData[this.index]);

        this.drawPlot(8, y+= height, "Attack Delay", this.attackDelayData[this.index]);
    }

    // drawLogPlot = function (x,y,label, series, base) {
    //     this.ctx.fillStyle = "black";
    //     this.ctx.font = "12px Arial";
    //     this.ctx.fillText(label, x+100, y+11);

    //     this.ctx.beginPath();
    //     this.ctx.lineWidth = 1;
    //     this.ctx.strokeStyle = "Grey";
    //     this.ctx.rect(x-2, y-2, 204, 45);
    //     this.ctx.stroke();

    //     for (var i = 0; i < series.length; i++) {
    //         this.ctx.beginPath();
    //         this.ctx.fillStyle = "Red";
    //         var value = series[i];
    //         value = Math.log(value + 1) / Math.log(base) * 2;
    //         this.ctx.rect(x + 2* i, y+39, 2, -value);
    //         this.ctx.fill();
    //     }
    //     for (var i = 0; i < 10; i++) {
    //         this.ctx.beginPath();
    //         this.ctx.fillStyle = i % 2 === 0 ? "Black" : "LightGrey";
    //         this.ctx.rect(x + 20 * i, y+39, 20, 2);
    //         this.ctx.fill();
    //     }
    // }

    drawPlot = function (x,y,label, series) {
        var height = 15
        var max = 0;

        for (var i = 0; i < series.length; i++)
            if (series[i] > max) max = series[i];
        if (max <= 0) max = 0.1;

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "Grey";
        this.ctx.rect(x-2, y-2, 204, height + 15);
        this.ctx.stroke();

        var min = 0;
        var avg = 0;
        if (series.length > 200) min = series.length - 200;

        for (var i = min; i < series.length; i++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = "Red";
            var value = series[i];
            value = value/max*height;
            avg += value;
            this.ctx.rect(x + i - min, y+ height + 9, 1, -value);
            this.ctx.fill();
        }
        if (series.length > 0) {
            this.ctx.fillStyle = "#000";
            avg /= (series.length-min);
            this.ctx.beginPath();
            this.ctx.rect(x, y+height+9-avg, series.length, -1);
    
            this.ctx.fill();
        }
        for (var i = 0; i < 10; i++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = i % 2 === 0 ? "Black" : "LightGrey";
            this.ctx.rect(x + 20 * i, y+height+9, 20, 2);
            this.ctx.fill();
        }

        this.ctx.fillStyle = "black";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(label + " (avg = " + (avg/height*max).toFixed(4) + ")", x, y-6);
    }
}*/