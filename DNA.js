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

    static crossover(a, b, gender) {
        var ret = new DNA();

        var gene = DNA.geneNames();
        for (var i = 0; i < gene.length; i++) {
            if (DNA.geneGendered(gene[i])) {
                ret.gene[gene[i]] = DNA.getGender(a, b, gender).gene[gene[i]];
            } else {
                ret.gene[gene[i]] = DNA.getRandom(a, b).gene[gene[i]];
            }
        }

        return ret;
    }

    static getRandom(a, b) {
        return (Math.random() < 0.5)? a : b;
    }

    static getGender(a, b, gender) {
        return (a == gender)? a : b;
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
        defgene["matingDonation"] = 40; 
        defgene["drowningAggression"] = 0.008;
        defgene["foodAggression"] = 0.008;
        defgene["drinkAggression"] = 0.008;
        defgene["matingAggression"] = 0.008;
        defgene["wanderAggression"] = 0.008;
        defgene["attackDelay"] = 50;
        defgene["loyalty"] = 0.99;
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
        gene[i++] = "matingDonation";
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
        min[i++] = 0.001;//"matingDonation";
        min[i++] = 0.0001;//"drowningAggression";
        min[i++] = 0.0001;//"foodAggression";
        min[i++] = 0.0001;//"drinkAggression";
        min[i++] = 0.0001;//"matingAggression";
        min[i++] = 0.0001;//"wanderAggression";
        min[i++] = 0.001;//"attackDelay";
        min[i++] = 0.001;//"loyalty";

        return min;
    }

    static geneGendered() {
        var gendered = [];
        var i = 0;
        // for (;i < DNA.names.length; i++) {
        //     gendered[i++] = true;    
        // }
        gendered[i++] = false;//"metabolicRate";
        gendered[i++] = false;//"thirstThreshold";
        gendered[i++] = false;//"hungerThreshold";
        gendered[i++] = true;//"matingThreshold";
        gendered[i++] = false;//"energyThreshold";
        gendered[i++] = false;//"thirstSated";
        gendered[i++] = false;//"hungerSated";
        gendered[i++] = false;//"energySated";
        gendered[i++] = false;//"wanderWeight";
        gendered[i++] = false;//"uphillWeight";
        gendered[i++] = false;//"foodPreference";
        gendered[i++] = true;//"attackPreference";
        gendered[i++] = false;//"plantWeight";
        gendered[i++] = false;//"meatWeight";
        gendered[i++] = false;//"waterWeight";
        gendered[i++] = false;//"matingWeight";
        gendered[i++] = false;//"orientationWeight";
        gendered[i++] = false;//"cohesionWeight";
        gendered[i++] = false;//"separationWeight";
        gendered[i++] = true;//"matingDonation";
        gendered[i++] = false;//"drowningAggression";
        gendered[i++] = false;//"foodAggression";
        gendered[i++] = false;//"drinkAggression";
        gendered[i++] = false;//"matingAggression";
        gendered[i++] = false;//"wanderAggression";
        gendered[i++] = false;//"attackDelay";
        gendered[i++] = false;//"loyalty";

        return gendered;
    }

    static geneMax() {
        var max = [];
        var i = 0;
        max[i++] = 0.5;//"metabolicRate";
        max[i++] = 100;//"thirstThreshold";
        max[i++] = 100;//"hungerThreshold";
        max[i++] = 30;//"matingThreshold";
        max[i++] = 100;//"energyThreshold";
        max[i++] = 100;//"thirstSated";
        max[i++] = 100;//"hungerSated";
        max[i++] = 100;//"energySated";
        max[i++] = .02;//"wanderWeight";
        max[i++] = 20;//"uphillWeight";
        max[i++] = 2;//"foodPreference";
        max[i++] = 2;//"attackPreference";
        max[i++] = 0.25;//"plantWeight";
        max[i++] = 0.25;//"meatWeight";
        max[i++] = 0.25;//"waterWeight";
        max[i++] = 0.25;//"matingWeight";
        max[i++] = 0.1;//"orientationWeight";
        max[i++] = 0.025;//"cohesionWeight";
        max[i++] = 2;//"separationWeight";
        max[i++] = 100;//"matingDonation";
        max[i++] = 0.02;//"drowningAggression";
        max[i++] = 0.02;//"foodAggression";
        max[i++] = 0.02;//"drinkAggression";
        max[i++] = 0.02;//"matingAggression";
        max[i++] = 0.02;//"wanderAggression";
        max[i++] = 100;//"attackDelay";
        max[i++] = 1;//"loyalty";
        return max;
    }
}

DNA.names = DNA.geneNames();
DNA.min = DNA.geneMin();
DNA.max = DNA.geneMax();
DNA.gendered = DNA.geneGendered();