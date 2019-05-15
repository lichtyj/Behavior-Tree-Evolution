class Npc extends Entity {

    constructor(position, sprite) {
        super(position, sprite);
        this.spr;
        this.healthBar = assetMgr.getAsset("particle");
        this.vision = Math.random()*100+150;
        this.visionCone = Math.PI*(1.5+Math.random()*.5);
        this.canSee = [];
        this.separation = Math.random()*15+15;
        this.ai;
        this.dna;
        this.isMale = Math.random()*2|0;
        this.timeAlive = 0;
        this.distanceTraveled = 0;
        this.foodEaten = 0;
        this.waterDrank = 0;
        this.energyGenerated = 0;

        // Survival variables
        this.health = 100;
        this.hunger = 0;
        this.thirst = 0;
        this.mate = 0;
        this.energy = 100;
        this.births = 0;

        this.attackTimer = 0;

        this.hungry = false;
        this.thirsty = false;
        this.sleepy = false;
        this.mating = false;

        this.child = true;

        this.maxhealth = 100;
        this.lastDamage = "";
        this.dead = false;
        this.facing = new Vector();
    }

    static create(position, sprite, dna) {
        var obj = new Npc(position, assetMgr.getSprite(sprite));
        obj.spr = sprite;
        game.addEntity(obj);
        obj.init(dna);
        graphing.logDna(obj.dna);
        return obj;
    }

    init(dna) {
        this.ai = new BehaviorTree(this);
        var that = this;
        
        var n1, n2, n3, n4, n5;

        n1 = this.ai.addNode(this.ai.root, "Sequence", "Sequence");
            n2 = this.ai.addNode(n1, "Sequence", "Flock");
                this.ai.addNode(n2, "Action", "Orientation", function() {that.Orientation()});
                this.ai.addNode(n2, "Action", "Cohesion", function() {that.Cohesion()});
                this.ai.addNode(n2, "Action", "Separation", function() {that.Separation()});
        n2 = this.ai.addNode(n1, "Inverter", "Invert");
        n3 = this.ai.addNode(n2, "Selector", "Needs");
            n4 = this.ai.addNode(n3, "Inverter", "Invert");
            n5 = this.ai.addNode(n4, "Selector", "Dry?");
                this.ai.addNode(n5, "Action", "AboveWater?", function() {that.IsAboveWater()});
                this.ai.addNode(n5, "Action", "Attack", function() {that.Attack(that.dna.drowningAggression)});
                this.ai.addNode(n5, "Action", "FindLand?", function() {that.MoveUphill()});
            n4 = this.ai.addNode(n3, "Sequence", "Drink");
                this.ai.addNode(n4, "Action", "Thirsty?", function() {that.IsThirsty()});
                this.ai.addNode(n4, "Action", "Attack", function() {that.Attack(that.dna.drinkAggression)});
                this.ai.addNode(n4, "Action", "FindWater", function() {that.FindWater()});
                this.ai.addNode(n4, "Action", "Drink", function() {that.Drink()});
            n4 = this.ai.addNode(n3, "Sequence", "Eat");
                this.ai.addNode(n4, "Action", "Hungry?", function() {that.IsHungry()});
                this.ai.addNode(n4, "Action", "FindFood", function() {that.FindFood()});
                this.ai.addNode(n4, "Action", "Attack", function() {that.Attack(that.dna.foodAggression)});
                this.ai.addNode(n4, "Action", "Eat", function() {that.Eat()});
            n4 = this.ai.addNode(n3, "Sequence", "Mate");
                this.ai.addNode(n4, "Action", "Mating?", function() {that.IsMating()});
                this.ai.addNode(n4, "Action", "FindMate", function() {that.FindMate()});
                this.ai.addNode(n4, "Action", "Attack", function() {that.Attack(that.dna.matingAggression)});
                this.ai.addNode(n4, "Action", "Mate", function() {that.Mate()});
        n2 = this.ai.addNode(n1, "Selector", "Idle");
            this.ai.addNode(n2, "Action", "Attack", function() {that.Attack(that.dna.wanderAggression)});
            this.ai.addNode(n2, "Action", "Wander", function() {that.Wander()});

        if (dna == undefined) {
            this.dna = DNA.default()
        } else {
            this.dna = dna;
        }

        this.topAcc = this.dna.metabolicRate * 2;
        this.topVel = this.dna.metabolicRate * 10;

        this.acceleration.set(Vector.random(1));
        btRenderer.setTree(this.ai);
        this.ai.setActive(this.ai.root);
        this.ai.root.resetIndices();
    }

    // setStats() { 
    //     this.health = this.parseStat(this.health, document.getElementById("health").value);
    //     this.maxhealth = this.parseStat(this.maxhealth, document.getElementById("maxHealth").value);
    //     this.hunger = this.parseStat(this.hunger, document.getElementById("hunger").value);
    //     this.thirst = this.parseStat(this.thirst, document.getElementById("thirst").value);
    //     this.energy = this.parseStat(this.energy, document.getElementById("energy").value);

    //     this.dna.metabolicRate = this.parseStat(this.dna.metabolicRate, document.getElementById("metabolicRate").value);
    //     this.dna.thirstThreshold = this.parseStat(this.dna.thirstThreshold, document.getElementById("thirstThreshold").value);
    //     this.dna.hungerThreshold = this.parseStat(this.dna.hungerThreshold, document.getElementById("hungerThreshold").value);
    //     this.dna.hungerThreshold = this.parseStat(this.dna.matingThreshold, document.getElementById("matingThreshold").value);
    //     this.dna.energyThreshold = this.parseStat(this.dna.energyThreshold, document.getElementById("energyThreshold").value);
    //     this.dna.thirstSated = this.parseStat(this.dna.thirstSated, document.getElementById("thirstSated").value);
    //     this.dna.hungerSated = this.parseStat(this.dna.energySated, document.getElementById("hungerSated").value);
    //     this.dna.energySated = this.parseStat(this.dna.energySated, document.getElementById("energySated").value);
    //     this.dna.wanderWeight = this.parseStat(this.dna.wanderWeight, document.getElementById("wanderWeight").value);
    //     this.dna.uphillWeight = this.parseStat(this.dna.uphillWeight, document.getElementById("uphillWeight").value);
    //     this.dna.plantWeight = this.parseStat(this.dna.plantWeight, document.getElementById("plantWeight").value);
    //     this.dna.meatWeight = this.parseStat(this.dna.meatWeight, document.getElementById("meatWeight").value);
    //     this.dna.waterWeight = this.parseStat(this.dna.waterWeight, document.getElementById("waterWeight").value);
    //     this.dna.waterWeight = this.parseStat(this.dna.matingWeight, document.getElementById("matingWeight").value);
    //     this.dna.orientationWeight = this.parseStat(this.dna.orientationWeight, document.getElementById("orientationWeight").value);
    //     this.dna.cohesionWeight = this.parseStat(this.dna.cohesionWeight, document.getElementById("cohesionWeight").value);
    //     this.dna.separationWeight = this.parseStat(this.dna.separationWeight, document.getElementById("separationWeight").value);
    // }

    parseStat(stat, newValue) {
        var ret = stat;
        newValue = parseFloat(newValue);
        if (!isNaN(newValue)) {
            ret = newValue;
        }
        return ret;
    }

    //#region CHECKS ///////////////////////////////////////////////////////////
    
    IsAboveWater() {
        if (terrain.isAboveWater(this.position)) {
            // console.log("Not under water");
            this.ai.finishAction(true);
        } else {
            // console.log("Under water");
            this.ai.finishAction(false);
        }
    }

    IsHeadedDownhill() {
        var heading = this.position.clone();
        heading.add(this.facing.mult(3));
        if (terrain.getHeight(this.position.x, this.position.y) > terrain.getHeight(heading.x, heading.y)) {
            this.ai.finishAction(true);
        } else {
            this.ai.finishAction(false);
        }
    }

    IsThirsty() {
        if (this.thirsty && this.thirst >= this.dna.thirstSated) {
            this.thirsty = false;
        }
        if (this.thirst < this.dna.thirstThreshold) {
            this.thirsty = true;
        }
        this.ai.finishAction(this.thirsty);
    }

    IsHungry() {
        if (this.hungry && this.hunger >= this.dna.hungerSated) {
            this.hungry = false;
        }
        if (this.hunger < this.dna.hungerThreshold) {
            this.hungry = true;
        }
        this.ai.finishAction(this.hungry);
    }

    IsTired() {
        if (this.sleepy && this.energy >= this.dna.energySated) {
            this.sleepy = false;
        }
        if (this.energy < this.dna.energyThreshold) {
            this.sleepy = true;
        }
        this.ai.finishAction(this.sleepy);
    }

    IsMating() {
        if (this.mate > this.dna.matingThreshold && game.npcs.length < 200) {
            this.mating = true;
        }
        this.ai.finishAction(this.mating);
    }

    //#endregion CHECKS ///////////////////////////////////////////////////////////

    //#region ACTIONS ///////////////////////////////////////////////////////////

    Drink() {
        if (!(terrain.isAboveWater(this.position))) {
            this.thirst++;
            this.waterDrank++;
            if (this.thirst > 100) this.thirst = 100;
            this.ai.finishAction(true);
        } else {
            this.ai.finishAction(false);
        }
    }

    Eat() {
        // console.log("Eating food");
        var near = game.quadtree.retrieve(this.position.x, this.position.y, 10);
        var ret = false;
        for (var r of near) {
            if (r instanceof Resource) {
                if (r.amount > 0) {
                    if (r.type == "bush")
                        this.hunger += 1 - this.dna.foodPreference/2.0;
                    if (r.type == "rawMeat")
                        this.hunger += this.dna.foodPreference/2.0;
                    r.amount--;
                    this.foodEaten++;
                } else {
                    r.remove();
                }
                if (this.hunger > 100) this.hunger = 100;
                ret = true;
                break;
            }
        }
        this.ai.finishAction(ret);
    }

    Attack(weight) {
        // console.log("Attacking");
        var near = game.quadtree.retrieve(this.position.x, this.position.y, 5);
        var offset = this.dna.attackPreference/2.0;
        for (var r of near) {
            if (r instanceof Npc) {
                if (r.isMale) offset = (2-this.dna.attackPreference)/2.0;
                if (r.spr == this.spr) offset *= 1-this.dna.loyalty;
                if  (Math.random() < weight*offset && this.attackTimer < 0) {
                    this.energy -= 1;
                    r.health -= 25;
                    r.lastDamage = "Violence"
                    this.attackTimer = this.dna.attackDelay;
                    break;
                }
            }
        }
        this.ai.finishAction(true);
    }

    Mate() {
        var near = game.quadtree.retrieve(this.position.x, this.position.y, 10);
        var ret = false;
        for (var m of near) {
            if (m instanceof Npc && m.spr == this.spr && this.isMale != m.isMale) {
                if (m.mating && m.isMale != this.isMale) {
                    var donation;
                    var mDonation;
                    if (this.isMale) {
                        donation = this.dna.matingDonationM;
                        mDonation = m.dna.matingDonationF;
                    } else {
                        donation = this.dna.matingDonationF;
                        mDonation = m.dna.matingDonationM;
                    }

                    var obj = Npc.create(this.position.clone(), this.spr, DNA.crossover(this.dna, m.dna));
                    obj.dna.mutate(3);
                    obj.energy = donation + mDonation;

                    this.energy -= donation + 5; // The 5 is half of the energy minimum for meat
                    if (this.energy < 0) {
                        this.health += this.energy;
                        this.lastDamage = "mating";
                    }

                    m.energy -= mDonation + 5;
                    if (m.energy < 0) {
                        m.health += m.energy;
                        m.lastDamage = "mating";
                    }
                    m.mating = false;
                    m.mate = 0;
                    m.births++;

                    this.mating = false;
                    this.mate = 0;
                    this.births++;
                    // game.pause();
                    // console.log("me");
                    // console.log(this);
                    // console.log("other");
                    // console.log(m);
                    // console.log("child");
                    // console.log(obj);
                    ret = true;
                    break;
                }
            }
        }
        this.ai.finishAction(ret);
    }

    FindWater() { // Abandon this and just move away from center?
        if (!(terrain.isAboveWater(this.position))) {
            this.ai.finishAction(true);
        } else {
            var p = new Vector();
            var lowest = 1;
            var i,j;
            var temp;
            var height;
            var found = false;
            var nearest = this.vision;
            var chosen = new Vector();
            for (i = 0; i < Math.PI*2; i += 0.3) {
                p.set(this.position);
                for (j = 0; j < 50; j += 5) {
                    temp = Vector.fromAngle(i);
                    temp.scale(j);
                    p.add(temp);
                    // if (j > 40) Resource.create(p.clone(), "bush");
                    height = terrain.getHeight(p.x, p.y);
                    if (height != null) {
                        if (!found && height < lowest) {
                            lowest = height;
                            chosen.set(p);
                        }
                        if (height < 0.375) {
                            if (found && j < nearest) {
                                nearest = j;
                                chosen.set(p);
                            } else {
                                found = true;
                            }
                        }                        
                    }
                }
            }
            if (found) {
                chosen.subtract(this.position);
                chosen.mult(this.dna.waterWeight * this.thirst/this.dna.thirstThreshold);
                this.acceleration.add(chosen);
                this.ai.finishAction(true);
            } else {
                this.ai.finishAction(false);
            }           
        }
    }

    FindFood() {
        var ret = this.FindPlants();
        this.ai.finishAction(ret || this.FindMeat());
    }

    FindPlants() {
        // console.log("Finding Plants");
        var ret = false;        
        var nearest;
        var d = this.vision;
        var temp;
        for (var r of this.canSee) {
            if (r instanceof Resource && r.type == "bush") {
                temp = Vector.distance(this.position, r.position);
                if (temp < d) {
                    d = temp;
                    nearest = r;
                }
            }
        }
        if (nearest != undefined) {
            this.acceleration.add(Vector.towardPoint(this.position, nearest.position).mult(this.dna.plantWeight * this.hunger/this.dna.hungerThreshold));
            if (d < 15) ret = true;
        }
        return ret;
    }

    FindMeat() {
        // console.log("Finding Meat");
        var ret = false;
        var nearest;
        var d = this.vision;
        var temp;
        for (var r of this.canSee) {
            if (r instanceof Resource && r.type == "rawMeat") {
                temp = Vector.distance(this.position, r.position);
                if (temp < d) {
                    d = temp;
                    nearest = r;
                }
            }
        }
        if (nearest != undefined) {
            this.acceleration.add(Vector.towardPoint(this.position, nearest.position).mult(this.dna.meatWeight * this.hunger/this.dna.hungerThreshold));
            if (d < 15) ret = true;
        }
        return ret;
    }

    FindMate() {
        // console.log("Finding mate");
        var nearest;
        var d = this.vision;
        var temp;
        for (var r of this.canSee) {
            if (r instanceof Npc && r.spr == this.spr) {
                temp = Vector.distance(this.position, r.position);
                if (temp < d) {
                    d = temp;
                    nearest = r;
                }
            }
        }
        if (nearest != undefined) {
            this.acceleration.add(Vector.towardPoint(this.position, nearest.position).mult(this.dna.matingWeight * this.mate/this.dna.matingThreshold));
            if (d < 10) {
                this.ai.finishAction(true);
            } else {
                this.ai.finishAction(false);
            }
        } else {
            this.ai.finishAction(false);
        }
    }

    Wander() {
        // console.log("Wandering");
        var temp = this.facing.clone();
        if (this.velocity.magnitude() > this.dna.wanderWeight*10) {
            temp.add(Vector.random(this.dna.wanderWeight));
        }
        this.acceleration.add(temp);
        this.ai.finishAction(true);
    }

    MoveUphill() {
        // console.log("Moving uphill");
        var p = terrain.getSlope(this.position.x,this.position.y);
        p.mult(this.dna.uphillWeight / terrain.getHeight(this.position.x, this.position.y)/0.375);
        this.acceleration.subtract(p);
        this.ai.finishAction(true);       
    }

    TurnAround() {
        this.acceleration.add(this.facing.mult(-1));
        // console.log("turned around");
        this.ai.finishAction(true);
    }

    Orientation() { // TODO weight this by fitness?
        var avg = Vector.zero();
        var count = 0;
        for (var e of this.canSee) {
            if (e instanceof Npc && e.spr == this.spr) {
                avg.add(e.velocity);
                count++;
            }
        }
        if (count > 0) {
            avg.div(count);
            this.acceleration.add(avg.mult(this.dna.orientationWeight));
        }
        this.ai.finishAction(true);
    }

    Cohesion() { // TODO weight this by fitness?
        var avg = Vector.zero();
        var count = 0;
        for (var e of this.canSee) {
            if (e instanceof Npc && e.spr == this.spr) {
                avg.add(e.position);
                count++;
            }
        }
        if (count > 0) {
            avg.div(count).subtract(this.position).mult(this.dna.cohesionWeight);
            this.acceleration.add(avg);
        }
        this.ai.finishAction(true);        
    }

    Separation() {
        var avg = Vector.zero();
        var total = 0;
        for (var e of this.canSee) {
            var dist = Vector.distance(this.position, e.position);
            if (dist < this.separation && e instanceof Npc) {
                var sep = this.position.clone();
                sep.subtract(e.position);
                var rate = (this.separation - dist)/this.separation;
                sep.mult(Math.pow(rate,2));
                avg.add(sep);
                total++;
            }
        }
        if (total > 0) {
            avg.div(total);
            if (avg.magnitude() > 0.25) 
                this.acceleration.add(avg.mult(this.dna.separationWeight));
        }
        this.ai.finishAction(true);
    }

    //#endregion ACTIONS ///////////////////////////////////////////////////////////

    perceptionCheck() {
        this.canSee = game.quadtree.retrieveCone(this.position.x, this.position.y, this.vision, this.velocity.x, this.velocity.y, this.visionCone);
        this.canSee.splice(this.canSee.indexOf(this),1);
    }

    metabolize() {
        if (Math.random()*50000 <= 1) {
            this.lastDamage = "the random number gods";
            this.health = 0;
        }
        
        if (this.health <= 0) {
            this.die();
        }

        var temp = this.energy;

        if (this.energy < 100) {
            this.hunger -= this.dna.metabolicRate;
            this.thirst -= this.dna.metabolicRate;
            if (this.hunger > 0 && this.thirst > 0) {
                this.energy += this.dna.metabolicRate*5;
                if (this.health < this.maxhealth) {
                    this.health += this.dna.metabolicRate;
                    this.energy -= this.dna.metabolicRate*2;
                }
            } else if (this.thirst <= 0) { // Dehydrated
                this.energy += this.dna.metabolicRate;
                // this.health -= this.dna.metabolicRate;
            } else { // Starving
                this.energy += this.dna.metabolicRate;
                // this.health -= this.dna.metabolicRate;
            }
        }

        this.energyGenerated += this.energy - temp;

        this.energy -= this.dna.metabolicRate;

        this.energy -= this.velocity.magnitude()/16;
        // this.energy -= this.acceleration.magnitude()/2;

        if (this.energy < 0) {
            this.energy = 0;
            this.lastDamage = "malnutrition";
            this.health -= this.dna.metabolicRate;
        } else if (this.energy > this.dna.energyThreshold) {
            this.mate += this.dna.metabolicRate;
            if (this.mate > 100) this.mate = 100;
        }
        if (this.hunger < 0) this.hunger = 0;
        if (this.thirst < 0) this.thirst = 0;
    }

    update() {
        this.ai.getBehavior();
        this.metabolize();
        this.perceptionCheck();

        this.timeAlive++;
        this.attackTimer--;

        if (terrain.getHeight(this.position.x, this.position.y) < 0.35) {
            this.health -= 0.1;
            this.lastDamage = "drowning";
        }

        if (this.child && this.timeAlive > 500) {
            this.child = false;
            var sprite = this.spr + "Adult";
            if (!this.isMale) sprite += "Female";
            this.sprite = assetMgr.getSprite(sprite);
        }

        var heading = this.position.clone();
        heading.add(this.facing.mult(3));

        this.velocity.z = 0;
        this.position.z = 0; // This is dirty, but the npcs are gettings jumpy and I don't know why
        super.update();
        this.distanceTraveled += this.velocity.magnitude();
        this.facing.set(this.velocity);
    }

    die() {
        if (!this.dead) {
            var meat = Resource.create(this.position, "rawMeat", Math.random()*Math.PI*2, 0.01);
            meat.amount = this.energy + 10;
            if (game.cameraTarget == this) {
                //game.dropCamera();
                game.selectRandomNpc();
            }
            game.ui.pushMessage("A " + this.spr + " was killed by " + this.lastDamage, "#800");
            this.dead = true;
            game.remove(this);
        }
    }

    takeDamage(other) {
        this.health -= other.damage;
    }

    draw(ctx, dt) {
        super.draw(ctx, dt, true);
        super.drawHealth(ctx);
    }

    //#region save

    save() {
        return JSON.stringify({
            position:this.position, 
            velocity:this.velocity, 
            direction:this.direction, 
            acceleration:this.acceleration, 
            topAcc:this.topAcc,
            topVel:this.topVel,
            dead:this.dead,
            elapsedTime:this.elapsedTime, 
            facing:this.facing, 

            spr:this.spr,
            vision:this.vision, 
            visionCone:this.visionCone, 
            separation:this.separation,

            dna:this.dna,
            timeAlive:this.timeAlive,
            distanceTraveled:this.distanceTraveled,
            foodEaten:this.foodEaten,
            waterDrank:this.waterDrank,
            energyGenerated:this.energyGenerated,
            births:this.births, 

            health:this.health, 
            hunger:this.hunger,
            thirst:this.thirst,
            mate:this.mate,
            energy:this.energy});
    }

    static load(data) {
        data = JSON.parse(data);
        var obj = Npc.create(Vector.create(data.position), data.spr);
        obj.sprite = assetMgr.getSprite(data.spr)
        obj.velocity = Vector.create(data.velocity);
        obj.direction = Vector.create(data.direction);
        obj.acceleration = Vector.create(data.acceleration);
        obj.vision = data.vision;
        obj.visionCone = data.visionCone;
        obj.separation = data.separation;
        obj.topAcc = data.topAcc;
        obj.topVel = data.topVel;
        obj.dead = data.dead;
        obj.elapsedTime = data.elapsedTime;
        obj.facing = Vector.create(data.facing);
        obj.health = data.health;
        obj.thirst = data.thirst;
        obj.mate = data.mate;
        obj.energy = data.energy;
        obj.dna = data.dna;
        obj.timeAlive = data.timeAlive;
        obj.distanceTraveled = data.distanceTraveled;
        obj.foodEaten = data.foodEaten;
        obj.waterDrank = data.waterDrank;
        obj.energyGenerated = data.energyGenerated;
        obj.births = data.births;
        return obj;
    }

    //#endregion save
}