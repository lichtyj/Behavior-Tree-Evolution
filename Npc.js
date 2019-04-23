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
        this.aiTimer = 0;

        // Survival variables
        this.health = 100;
        this.hunger = 100;
        this.thirst = 100;
        this.energy = 100;
        
        // Genetic variables
        this.metabolicRate = 0.1;
        this.hungry = false;
        this.thirsty = false;
        this.sleepy = false;
        this.thirstThreshold = 50;
        this.hungerThreshold = 50;
        this.energyThreshold = 50;
        this.thirstSated = 80;
        this.hungerSated = 80;
        this.energySated = 80;


        this.maxhealth = 100;

        // Search variable
        this.lowestGround = 1;
        this.highestGround = 0;

        this.wanderWeight = .01;
        this.uphillWeight = 10;
        this.foodWeight = 0.1;
        this.waterWeight = 0.1;
        this.orientationWeight = 0.05;
        this.cohesionWeight = 0.1;
        this.separationWeight = 10;

        this.lastDamage = "";

        this.dead = false;
        this.facing = new Vector();
    }

    static create(position, sprite) {
        var obj = new Npc(position, assetMgr.getSprite(sprite));
        obj.spr = sprite;
        game.addEntity(obj);
        obj.init();
        return obj;
    }

    init() {
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
                this.ai.addNode(n5, "Action", "FindLand?", function() {that.MoveUphill()});
            n4 = this.ai.addNode(n3, "Sequence", "Drink");
                this.ai.addNode(n4, "Action", "Thirsty?", function() {that.IsThirsty()});
                this.ai.addNode(n4, "Action", "FindWater", function() {that.FindWater()});
                this.ai.addNode(n4, "Action", "Drink", function() {that.Drink()});
            n4 = this.ai.addNode(n3, "Sequence", "Eat");
                this.ai.addNode(n4, "Action", "Hungry?", function() {that.IsHungry()});
                this.ai.addNode(n4, "Action", "FindFood", function() {that.FindFood()});
                this.ai.addNode(n4, "Action", "Eat", function() {that.Eat()});
        n2 = this.ai.addNode(n1, "Selector", "Idle");
            this.ai.addNode(n2, "Action", "Wander", function() {that.Wander()});

        this.acceleration.set(Vector.random(1));
        btRenderer.setTree(this.ai);
        this.ai.setActive(this.ai.root);
        this.ai.root.resetIndices();
    }

    setStats() { 
        this.health = this.parseStat(this.health, document.getElementById("health").value);
        this.maxhealth = this.parseStat(this.maxhealth, document.getElementById("maxHealth").value);
        this.hunger = this.parseStat(this.hunger, document.getElementById("hunger").value);
        this.thirst = this.parseStat(this.thirst, document.getElementById("thirst").value);
        this.energy = this.parseStat(this.energy, document.getElementById("energy").value);
        this.metabolicRate = this.parseStat(this.metabolicRate, document.getElementById("metabolicRate").value);
        this.thirstThreshold = this.parseStat(this.thirstThreshold, document.getElementById("thirstThreshold").value);
        this.hungerThreshold = this.parseStat(this.hungerThreshold, document.getElementById("hungerThreshold").value);
        this.energyThreshold = this.parseStat(this.energyThreshold, document.getElementById("energyThreshold").value);
        this.wanderWeight = this.parseStat(this.wanderWeight, document.getElementById("wanderWeight").value);
        this.uphillWeight = this.parseStat(this.uphillWeight, document.getElementById("uphillWeight").value);
        this.foodWeight = this.parseStat(this.foodWeight, document.getElementById("foodWeight").value);
        this.waterWeight = this.parseStat(this.waterWeight, document.getElementById("waterWeight").value);
        this.orientationWeight = this.parseStat(this.orientationWeight, document.getElementById("orientationWeight").value);
        this.cohesionWeight = this.parseStat(this.cohesionWeight, document.getElementById("cohesionWeight").value);
        this.separationWeight = this.parseStat(this.separationWeight, document.getElementById("separationWeight").value);
    }

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
        if (this.thirsty && this.thirst >= this.thirstSated) {
            this.thirsty = false;
        }
        if (this.thirst < this.thirstThreshold) {
            this.thirsty = true;
        }
        this.ai.finishAction(this.thirsty);
    }

    IsHungry() {
        if (this.hungry && this.hunger >= this.hungerSated) {
            this.hungry = false;
        }
        if (this.hunger < this.hungerThreshold) {
            this.hungry = true;
        }
        this.ai.finishAction(this.hungry);
    }

    IsTired() {
        if (this.sleepy && this.energy >= this.energySated) {
            this.sleepy = false;
        }
        if (this.energy < this.energyThreshold) {
            this.sleepy = true;
        }
        this.ai.finishAction(this.sleepy);
    }

    //#endregion CHECKS ///////////////////////////////////////////////////////////

    //#region ACTIONS ///////////////////////////////////////////////////////////

    Drink() {
        if (!(terrain.isAboveWater(this.position))) {
            this.thirst++;
            this.lowestGround = 1;
            if (this.thirst > 100) this.thirst = 100;
            this.ai.finishAction(true);
        } else {
            this.ai.finishAction(false);
        }
    }

    FindWater() { // Abandon this and just move away from center?
        // if (!(terrain.isAboveWater(this.position))) {
        //     this.ai.finishAction(true);
        // } else {
            var p = new Vector();
            var lowest = 1;
            var lowestV = new Vector();
            var i;
            var j;
            var temp;
            var found = false;
            var k = 0;
            for (i = 0; i < Math.PI*2; i += 0.3) {
                p.set(this.position);
                for (j = 0; j < 50; j += 5) {
                    temp = Vector.fromAngle(i);
                    temp.scale(j);
                    p.add(temp);
                    // console.log("temp:" + p.x + ", " + p.y);
                    // Resource.create(p.clone(), "bush");
                    k++;
                    temp = terrain.getHeight(p.x, p.y);
                    if (temp < lowest) {
                        lowest = temp;
                        lowestV.set(p);
                    }
                    if (terrain.getHeight(p.x, p.y) < 0.375) {
                        found = true;
                        break;
                    }
                }
            }
            // game.pause();
            if (lowest < this.lowestGround || found) {
                this.lowestGround = lowest;
                lowestV.subtract(this.position);
                this.acceleration.add(lowestV.limit(1)); // This could be weighted
                this.ai.finishAction(true);
            } else {
                this.ai.finishAction(false);
            }           
        // }
    }

    MoveUphill() {
        // console.log("Moving uphill");
        var p = terrain.getSlope(this.position.x,this.position.y);
        p.mult(this.uphillWeight);
        this.acceleration.subtract(p);
        this.ai.finishAction(true);       
    }

    FindFood() {
        // console.log("Finding food");
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
            var temp = Vector.towardPoint(this.position, nearest.position).mult(this.foodWeight);
            this.acceleration.add(Vector.towardPoint(this.position, nearest.position).mult(this.foodWeight));
            if (d < 15) {
                this.ai.finishAction(true);
            } else {
                this.ai.finishAction(false);
            }
        } else {
            this.ai.finishAction(false);
        }
    }

    Eat() {
        // console.log("Eating food");
        var near = game.quadtree.retrieve(this.position.x, this.position.y, 10);
        var ret = false;
        for (var r of near) {
            if (r instanceof Resource && r.type == "bush") {
                if (r.amount > 0) {
                    this.hunger++;
                    r.amount--;
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

    Wander() {
        // console.log("Wandering");
        var temp = this.facing.clone();
        if (this.velocity.magnitude() > this.wanderWeight*10) {
            temp.add(Vector.random(this.wanderWeight));
        }
        this.acceleration.add(temp);
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
            this.acceleration.add(avg.mult(this.orientationWeight));
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
            avg.div(count).subtract(this.position).mult(this.cohesionWeight);
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
                this.acceleration.add(avg.mult(this.separationWeight));
        }
        this.ai.finishAction(true);
    }

    //#endregion ACTIONS ///////////////////////////////////////////////////////////

    perceptionCheck() {
        this.canSee = game.quadtree.retrieveCone(this.position.x, this.position.y, this.vision, this.velocity.x, this.velocity.y, this.visionCone);
        this.canSee.splice(this.canSee.indexOf(this),1);
    }

    metabolize() {
        // if (Math.random()*10000 <= 1) {
        //     this.lastDamage = "the random number gods";
        //     this.health = 0;
        // }
        
        if (this.health <= 0) {
            this.die();
        }

        if (this.energy < 100) {
            this.hunger -= this.metabolicRate;
            this.thirst -= this.metabolicRate;
            if (this.hunger > 0 && this.thirst > 0) {
                this.energy += this.metabolicRate*5;
                if (this.health < this.maxhealth) {
                    this.health += this.metabolicRate;
                    this.energy -= this.metabolicRate*2;
                }
            } else if (this.thirst <= 0) { // Dehydrated
                this.energy += this.metabolicRate;
                // this.health -= this.metabolicRate;
            } else { // Starving
                this.energy += this.metabolicRate;
                // this.health -= this.metabolicRate;
            }
        }

        this.energy -= this.metabolicRate;

        this.energy -= this.velocity.magnitude()/2;
        // this.energy -= this.acceleration.magnitude()/2;

        if (this.energy < 0) {
            this.energy = 0;
            this.lastDamage = "malnutrition";
            this.health -= this.metabolicRate;
        }
        if (this.hunger < 0) this.hunger = 0;
        if (this.thirst < 0) this.thirst = 0;
    }

    update() {
        this.ai.getBehavior();
        this.metabolize();
        this.perceptionCheck();

        var heading = this.position.clone();
        heading.add(this.facing.mult(3));
        // console.log("Slope: " + terrain.getHeight(this.position.x, this.position.y) - terrain.getHeight(heading.x, heading.y));
        // console.log("Slope: " + (terrain.getHeight(this.position.x, this.position.y) - terrain.getHeight(heading.x, heading.y)));

        this.velocity.z = 0;
        this.position.z = 0; // This is dirty, but the npcs are gettings jumpy and I don't know why
        super.update();
        this.facing.set(this.velocity);
    }

    die() {
        if (!this.dead) {
            Resource.create(this.position, "rawMeat", Math.random()*Math.PI*2, 0.01);
            if (game.cameraTarget == this) {
                game.dropCamera();
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

    // save() {
    //     return JSON.stringify({position:this.position, velocity:this.velocity, 
    //         direction:this.direction, acceleration:this.acceleration, rotation:this.rotation, 
    //         gravity:this.gravity, vision:this.vision, visionCone:this.visionCone, 
    //         separation:this.separation, aiTimer:this.aiTimer, health:this.health, 
    //         stamina:this.stamina, isMale:this.isMale, aggression:this.aggression, 
    //         matingTimer:this.matingTimer, targetPos:this.targetPos, inAction:this.inAction, 
    //         find:this.find, onFire:this.onFire, dead:this.dead, rage:this.rage, 
    //         elapsedTime:this.elapsedTime, facing:this.facing, spr:this.spr, runSpeed:this.runSpeed, 
    //         moveSpeed:this.moveSpeed, damage:this.damage, maxhealth:this.maxhealth});
    // }

    // static load(data) {
    //     data = JSON.parse(data);
    //     var obj = Npc.create(Vector.create(data.position), data.spr);
    //     obj.sprite = assetMgr.getSprite(data.spr)
    //     obj.velocity = Vector.create(data.velocity);
    //     obj.direction = Vector.create(data.direction);
    //     obj.acceleration = Vector.create(data.acceleration);
    //     obj.rotation = data.rotation;
    //     obj.gravity = data.gravity;
    //     obj.vision = data.vision;
    //     obj.visionCone = data.visionCone;
    //     obj.separation = data.separation;
    //     obj.aiTimer = data.aiTimer;
    //     obj.health = data.health;
    //     obj.maxhealth = data.maxhealth;
    //     obj.stamina = data.stamina;
    //     obj.isMale = data.isMale;
    //     obj.aggression = data.aggression;
    //     obj.damage = data.damage;
    //     obj.matingTimer = data.matingTimer;
    //     if (data.targetPos != null) obj.targetPos = Vector.create(data.targetPos);
    //     obj.inAction = data.inAction;
    //     obj.find = data.find;
    //     obj.onFire = data.onFire;
    //     obj.dead = data.dead;
    //     obj.rage = data.rage;
    //     obj.runSpeed = data.runSpeed;
    //     obj.moveSpeed = data.moveSpeed;
    //     obj.elapsedTime = data.elapsedTime;
    //     obj.facing = Vector.create(data.facing);
    //     return obj;
    // }
}