class DNA {
    constructor(dna) {
        if (dna != undefined) {
            this.metabolicRate = dna.metabolicRate;
            
            this.thirstThreshold = dna.thirstThreshold;
            this.hungerThreshold = dna.hungerThreshold;
            this.matingThreshold = dna.matingThreshold;
            this.energyThreshold = dna.energyThreshold;

            this.thirstSated = dna.thirstSated;
            this.hungerSated = dna.hungerSated;
            this.energySated = dna.energySated;

            this.foodPreference = dna.foodPreference; // 0 == pure herbivore, 2 == pure carnivore
            this.attackPreference = dna.attackPreference; // 0 == male, 1 == both, 2 == female

            this.wanderWeight = dna.wanderWeight;
            this.uphillWeight = dna.uphillWeight;
            this.plantWeight = dna.plantWeight;
            this.meatWeight = dna.meatWeight;
            this.waterWeight = dna.waterWeight;
            this.matingWeight = dna.matingWeight;
            this.orientationWeight = dna.orientationWeight;
            this.cohesionWeight = dna.cohesionWeight;
            this.separationWeight = dna.separationWeight;

            this.matingDonationM = dna.matingDonationM;
            this.matingDonationF = dna.matingDonationF;

            // Chance to attack nearby npcs, 0 == no chance 1 == 100% chance
            this.drowningAggression = dna.drowningAggression; 
            this.foodAggression = dna.foodAggression;
            this.drinkAggression = dna.drinkAggression;
            this.matingAggression = dna.matingAggression;
            this.wanderAggression = dna.wanderAggression;

            this.loyalty = dna.loyalty;

        } else {
            this.metabolicRate;
            this.thirstThreshold;
            this.hungerThreshold;
            this.matingThreshold;
            this.energyThreshold;
            this.thirstSated;
            this.hungerSated;
            this.energySated;
    
            this.foodPreference;
            this.attackPreference;

            this.wanderWeight;
            this.uphillWeight;
            this.plantWeight;
            this.meatWeight;
            this.matingWeight;
            this.waterWeight;
            this.orientationWeight;
            this.cohesionWeight;
            this.separationWeight;
            
            this.matingDonationM;
            this.matingDonationF;

            this.drowningAggression; 
            this.foodAggression;
            this.drinkAggression;
            this.matingAggression;
            this.wanderAggression;

            this.attackDelay;

            this.loyalty;
        }
    }

    mutate(percent) {
        this.metabolicRate *= 1 + (Math.random()*percent*2 - percent)/100;
        this.thirstThreshold *= 1 + (Math.random()*percent*2 - percent)/100;
        this.hungerThreshold *= 1 + (Math.random()*percent*2 - percent)/100;
        this.thirstSated *= 1 + (Math.random()*percent*2 - percent)/100;
        this.hungerSated *= 1 + (Math.random()*percent*2 - percent)/100;

        this.energyThreshold *= 1 + (Math.random()*percent*2 - percent)/100;
        this.energySated *= 1 + (Math.random()*percent*2 - percent)/100;
        
        this.matingThreshold *= 1 + (Math.random()*percent*2 - percent)/100;
        this.matingDonationM *= 1 + (Math.random()*percent*2 - percent)/100;
        this.matingDonationF *= 1 + (Math.random()*percent*2 - percent)/100;
        this.matingWeight *= 1 + (Math.random()*percent*2 - percent)/100;
        
        this.foodPreference *= 1 + (Math.random()*percent*2 - percent)/100;
        this.plantWeight *= 1 + (Math.random()*percent*2 - percent)/100;
        this.meatWeight *= 1 + (Math.random()*percent*2 - percent)/100;
        this.waterWeight *= 1 + (Math.random()*percent*2 - percent)/100;
        
        this.wanderWeight *= 1 + (Math.random()*percent*2 - percent)/100;
        this.uphillWeight *= 1 + (Math.random()*percent*2 - percent)/100;

        this.orientationWeight *= 1 + (Math.random()*percent*2 - percent)/100;
        this.cohesionWeight *= 1 + (Math.random()*percent*2 - percent)/100;
        this.separationWeight *= 1 + (Math.random()*percent*2 - percent)/100;

        this.attackPreference *= 1 + (Math.random()*percent*2 - percent)/100;

        this.drowningAggression *= 1 + (Math.random()*percent*2 - percent)/100;
        this.foodAggression *= 1 + (Math.random()*percent*2 - percent)/100;
        this.drinkAggression *= 1 + (Math.random()*percent*2 - percent)/100;
        this.matingAggression *= 1 + (Math.random()*percent*2 - percent)/100;
        this.wanderAggression *= 1 + (Math.random()*percent*2 - percent)/100;

        this.attackDelay *= 1 + (Math.random()*percent*2 - percent)/100;

        this.loyalty *= 1 + (Math.random()*percent*2 - percent)/100;

        if (this.attackPreference < 0) this.attackPreference = 0;
        if (this.attackPreference > 2) this.attackPreference = 2;
        if (this.foodPreference < 0) this.foodPreference = 0;
        if (this.foodPreference > 2) this.foodPreference = 2;
        if (this.hungerThreshold < 1) this.hungerThreshold = 1;
        if (this.thirstThreshold < 1) this.thirstThreshold = 1;
        if (this.matingThreshold < 1) this.matingThreshold = 1;
        if (this.energyThreshold < 1) this.energyThreshold = 1;

        if (this.matingDonationM < 1) this.matingDonationM = 1;
        if (this.matingDonationF < 1) this.matingDonationF = 1;

        if (this.drowningAggression < 0.0001) this.drowningAggression = 0.0001;
        if (this.foodAggression < 0.0001) this.foodAggression = 0.001;
        if (this.drinkAggression < 0.0001) this.drinkAggression = 0.001;
        if (this.matingAggression < 0.0001) this.matingAggression = 0.001;
        if (this.wanderAggression < 0.0001) this.wanderAggression = 0.001;

        if (this.drowningAggression > 1) this.drowningAggression = 1;
        if (this.foodAggression > 1) this.foodAggression = 1;
        if (this.drinkAggression > 1) this.drinkAggression = 1;
        if (this.matingAggression > 1) this.matingAggression = 1;
        if (this.wanderAggression > 1) this.wanderAggression = 1;

        if (this.loyalty < 0.001) this.loyalty = 0.001;
        if (this.loyalty > 1) this.loyalty = 1;

    }

    static crossover(a, b) {
        var ret = new DNA();
        ret.metabolicRate = DNA.getRandom(a, b).metabolicRate;
        ret.thirstThreshold = DNA.getRandom(a, b).thirstThreshold;
        ret.hungerThreshold = DNA.getRandom(a, b).hungerThreshold;
        ret.matingThreshold = DNA.getRandom(a, b).matingThreshold;
        ret.energyThreshold = DNA.getRandom(a, b).energyThreshold;
        ret.thirstSated = DNA.getRandom(a, b).thirstSated;
        ret.hungerSated = DNA.getRandom(a, b).hungerSated;
        ret.energySated = DNA.getRandom(a, b).energySated;

        ret.foodPreference = DNA.getRandom(a, b).foodPreference;
        ret.attackPreference = DNA.getRandom(a, b).attackPreference;

        ret.wanderWeight = DNA.getRandom(a, b).wanderWeight;
        ret.uphillWeight = DNA.getRandom(a, b).uphillWeight;
        ret.plantWeight = DNA.getRandom(a, b).plantWeight;
        ret.meatWeight = DNA.getRandom(a, b).meatWeight;
        ret.waterWeight = DNA.getRandom(a, b).waterWeight;
        ret.matingWeight = DNA.getRandom(a, b).matingWeight;
        ret.orientationWeight = DNA.getRandom(a, b).orientationWeight;
        ret.cohesionWeight = DNA.getRandom(a, b).cohesionWeight;
        ret.separationWeight = DNA.getRandom(a, b).separationWeight;
        
        ret.matingDonationM = DNA.getRandom(a, b).matingDonationM;
        ret.matingDonationF = DNA.getRandom(a, b).matingDonationF;

        ret.drowningAggression = DNA.getRandom(a, b).drowningAggression;
        ret.foodAggression = DNA.getRandom(a, b).foodAggression;
        ret.drinkAggression = DNA.getRandom(a, b).drinkAggression;
        ret.matingAggression = DNA.getRandom(a, b).matingAggression;
        ret.wanderAggression = DNA.getRandom(a, b).wanderAggression;

        ret.attackDelay = DNA.getRandom(a, b).attackDelay;

        ret.loyalty = DNA.getRandom(a, b).loyalty;

        return ret;
    }

    static getRandom(a, b) {
        return (Math.random() < 0.5)? a : b;
    }

    static default() {
        var def = new DNA();
        def.metabolicRate = 0.1;
        def.thirstThreshold = 75;
        def.hungerThreshold = 50;
        def.matingThreshold = 25;
        def.energyThreshold = 50;
        def.thirstSated = 100;
        def.hungerSated = 80;
        def.energySated = 80;
        def.wanderWeight = .01;
        def.uphillWeight = 1;

        def.foodPreference = 1;
        def.attackPreference = 1;
        
        def.plantWeight = 0.1;
        def.meatWeight = 0.1;
        def.waterWeight = 0.1;
        def.matingWeight = 0.1;
        def.orientationWeight = 0.05;
        def.cohesionWeight = 0.01;
        def.separationWeight = 2;

        def.matingDonationM = 50;
        def.matingDonationF = 50;

        def.drowningAggression = 0.01;
        def.foodAggression = 0.01;
        def.drinkAggression = 0.01;
        def.matingAggression = 0.01;
        def.wanderAggression = 0.01;

        def.attackDelay = 50;

        def.loyalty = 0.5;
        
        return def;
    }
}