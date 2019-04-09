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
        this.maxhealth = 100;
        this.healthThreshold = 150; // Genetic

        this.stamina = 1000;
        this.maxStamina = 1000;
        this.staminaThreshold = 500; // Genetic

        this.isMale = (Math.random()*2 | 0 == 0);
        this.aggression = 1 // genetic
        this.damage = 2;
        this.attackTimer = 0;
        this.attacking = false;
        this.matingTimer = 0;
        this.matingThreshold = 25 // genetic

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
        var n1 = this.ai.addNode(this.ai.root, "Sequence", "Seq")
        this.ai.addNode(n1, "Action", "Wander", function() {that.Wander()});
        this.ai.addNode(n1, "Action", "Orientation", function() {that.Orientation()});
        this.ai.addNode(n1, "Action", "Cohesion", function() {that.Cohesion()});
        this.ai.addNode(n1, "Action", "Separation", function() {that.Separation()});
        btRenderer.setTree(this.ai);
        this.ai.setActive(this.ai.root);
        this.ai.root.resetIndices();
    }

    //#region ACTIONS ///////////////////////////////////////////////////////////

    Wander() {
        this.acceleration.add(Vector.random(.1).add(this.facing).limit(1));
        this.ai.finishAction("success");
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
            this.acceleration.add(avg).limit(.05);
        }
        this.ai.finishAction("success");
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
            avg.div(count).subtract(this.position).limit(.2); // TODO weight the limit by something?
            this.acceleration.add(avg);
        }
        this.ai.finishAction("success");        
    }

    Separation() {
        var avg = Vector.zero();
        for (var e of this.canSee) {
            var sep = this.position.clone();
            sep.subtract(e.position);
            var rate = (this.separation - 
                Vector.distance(this.position,e.position))/this.separation;
            sep.mult(Math.pow(rate,2));
            avg.add(sep);
        }
        this.acceleration.add(avg);
        this.ai.finishAction("success");
    }

    //#endregion ACTIONS ///////////////////////////////////////////////////////////

    perceptionCheck() {
        return game.quadtree.retrieveCone(this.position.x, this.position.y, this.vision, this.velocity.x, this.velocity.y, this.visionCone);
    }

    update() {
        if (this.health <= 0) this.die();

        if (this.aiTimer-- <= 0) {
            this.energy--;
            this.aiTimer = this.ai.tick();
        }

        this.canSee = this.perceptionCheck();
        this.canSee.splice(this.canSee.indexOf(this),1);

        if (this.stamina <= 0) {
            // this.topVel = this.crawlSpeed;
        } else {
            this.stamina -= this.velocity.magnitude();
        }

        this.velocity.z = 0;
        this.position.z = 0; // This is dirty, but the npcs are gettings jumpy and I don't know why
        super.update();
        this.facing.set(this.velocity);
    }

    die() {
        if (!this.dead) {
            Resource.create(this.position, "rawMeat", Math.random()*Math.PI*2);
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