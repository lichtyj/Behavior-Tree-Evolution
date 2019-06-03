class DNA {
    constructor(gene) {
        
        this.gene = [];

        if (gene == undefined) {
            gene = DNA.defaultgene();
        }

        this.gene = gene;
    }

    mutate(percent) {

        var gene = DNA.geneNames();
        for (var i = 0; i < gene.length; i++) {
            this.gene[gene[i]] *= 1 + (Math.random()*percent*2 - percent)/100;
        }

        this.clampgenes();
    }

    clampgenes() {
        for (var i = 0; i < DNA.names.length; i++) {
            if (this.gene[DNA.names[i]] < DNA.min[i]) this.gene[DNA.names[i]] = DNA.min[i];
            if (this.gene[DNA.names[i]] > DNA.max[i]) this.gene[DNA.names[i]] = DNA.max[i];
        }
    }

    static crossover(a, b) {
        var ret = new DNA();

        var gene = DNA.geneNames();
        for (var i = 0; i < gene.length; i++) {
            ret.gene[gene[i]] = DNA.getRandom(a, b).gene[gene[i]];
        }

        return ret;
    }

    static getRandom(a, b) {
        return (Math.random() < 0.5)? a : b;
    }

    static default() {
        var def = new DNA();
        def.gene = DNA.defaultgene();
        return def;
    }

    static defaultgene() {
        var defgene = [];
        defgene["metabolicRate"] = 0.20;
        defgene["thirstThreshold"] = 46;
        defgene["hungerThreshold"] = 55;
        defgene["matingThreshold"] = 16;
        defgene["energyThreshold"] = 56;
        defgene["thirstSated"] = 76;
        defgene["hungerSated"] = 62;
        defgene["energySated"] = 94;
        defgene["wanderWeight"] = 0.008;
        defgene["uphillWeight"] = 13;

        defgene["foodPreference"] = 0.63;
        defgene["attackPreference"] = 1;
        
        defgene["plantWeight"] = 0.13;
        defgene["meatWeight"] = 0.1;
        defgene["waterWeight"] = 0.1;
        defgene["matingWeight"] = 0.08;
        defgene["orientationWeight"] = 0.05;
        defgene["cohesionWeight"] = 0.01;
        defgene["separationWeight"] = 1.36;

        defgene["matingDonationM"] = 40;
        defgene["matingDonationF"] = 40;

        defgene["drowningAggression"] = 0.013;
        defgene["foodAggression"] = 0.006;
        defgene["drinkAggression"] = 0.01;
        defgene["matingAggression"] = 0.008;
        defgene["wanderAggression"] = 0.008;

        defgene["attackDelay"] = 50;

        defgene["loyalty"] = 0.96;
        return defgene;
    }

    static geneNames() {
        var gene = [];
        var i = 0;

        gene[i++] = "metabolicRate";
        gene[i++] = "thirstThreshold";
        gene[i++] = "hungerThreshold";
        gene[i++] = "matingThreshold";
        gene[i++] = "energyThreshold";
        gene[i++] = "thirstSated";
        gene[i++] = "hungerSated";
        gene[i++] = "energySated";
        gene[i++] = "wanderWeight";
        gene[i++] = "uphillWeight";
        gene[i++] = "foodPreference";
        gene[i++] = "attackPreference";
        gene[i++] = "plantWeight";
        gene[i++] = "meatWeight";
        gene[i++] = "waterWeight";
        gene[i++] = "matingWeight";
        gene[i++] = "orientationWeight";
        gene[i++] = "cohesionWeight";
        gene[i++] = "separationWeight";
        gene[i++] = "matingDonationM";
        gene[i++] = "matingDonationF";
        gene[i++] = "drowningAggression";
        gene[i++] = "foodAggression";
        gene[i++] = "drinkAggression";
        gene[i++] = "matingAggression";
        gene[i++] = "wanderAggression";
        gene[i++] = "attackDelay";
        gene[i++] = "loyalty";

        return gene;
    }

    static geneMin() {
        var min = [];
        var i = 0;
        min[i++] = 0.001;//"metabolicRate";
        min[i++] = 0.001;//"thirstThreshold";
        min[i++] = 0.001;//"hungerThreshold";
        min[i++] = 0.001;//"matingThreshold";
        min[i++] = 0.001;//"energyThreshold";
        min[i++] = 0.001;//"thirstSated";
        min[i++] = 0.001;//"hungerSated";
        min[i++] = 0.001;//"energySated";
        min[i++] = 0.001;//"wanderWeight";
        min[i++] = 0.001;//"uphillWeight";
        min[i++] = 0.001;//"foodPreference";
        min[i++] = 0.001;//"attackPreference";
        min[i++] = 0.001;//"plantWeight";
        min[i++] = 0.001;//"meatWeight";
        min[i++] = 0.001;//"waterWeight";
        min[i++] = 0.001;//"matingWeight";
        min[i++] = 0.001;//"orientationWeight";
        min[i++] = 0.001;//"cohesionWeight";
        min[i++] = 0.001;//"separationWeight";
        min[i++] = 0.001;//"matingDonationM";
        min[i++] = 0.001;//"matingDonationF";
        min[i++] = 0.0001;//"drowningAggression";
        min[i++] = 0.0001;//"foodAggression";
        min[i++] = 0.0001;//"drinkAggression";
        min[i++] = 0.0001;//"matingAggression";
        min[i++] = 0.0001;//"wanderAggression";
        min[i++] = 0.001;//"attackDelay";
        min[i++] = 0.001;//"loyalty";

        return min;
    }

    static geneMax() {
        var max = [];
        var i = 0;
        max[i++] = 0.5;//"metabolicRate";
        max[i++] = 100;//"thirstThreshold";
        max[i++] = 100;//"hungerThreshold";
        max[i++] = 75;//"matingThreshold";
        max[i++] = 100;//"energyThreshold";
        max[i++] = 100;//"thirstSated";
        max[i++] = 100;//"hungerSated";
        max[i++] = 100;//"energySated";
        max[i++] = 1;//"wanderWeight";
        max[i++] = 20;//"uphillWeight";
        max[i++] = 2;//"foodPreference";
        max[i++] = 2;//"attackPreference";
        max[i++] = 0.25;//"plantWeight";
        max[i++] = 0.25;//"meatWeight";
        max[i++] = 0.25;//"waterWeight";
        max[i++] = 0.25;//"matingWeight";
        max[i++] = 0.1;//"orientationWeight";
        max[i++] = 0.05;//"cohesionWeight";
        max[i++] = 2;//"separationWeight";
        max[i++] = 100;//"matingDonationM";
        max[i++] = 100;//"matingDonationF";
        max[i++] = 0.04;//"drowningAggression";
        max[i++] = 0.04;//"foodAggression";
        max[i++] = 0.04;//"drinkAggression";
        max[i++] = 0.04;//"matingAggression";
        max[i++] = 0.04;//"wanderAggression";
        max[i++] = 100;//"attackDelay";
        max[i++] = 1;//"loyalty";

        return max;
    }
}

DNA.names = DNA.geneNames();
DNA.min = DNA.geneMin();
DNA.max = DNA.geneMax();