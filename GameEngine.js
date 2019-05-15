class GameEngine {
    constructor(ctx, uiCtx) {
        this.entities = [];
        this.ctx = ctx;
        this.lastFrame = 0;
        this.dt = 0;
        this.step = 1/60;
        this.viewWidth = ctx.canvas.width;
        this.viewHeight = ctx.canvas.height;
        this.viewSpeed = 3;
        this.cameraTarget = null;
        this.cameraOffset= new Vector();
        this.view = new Vector();
        this.quadtree;
        this.toRemove = [];
        this.paused = false;
        this.ui = new GUI(uiCtx);
        this.state = "loading";

        this.recordAge = 0;
        this.recordAgeDNA = DNA.default();
        this.recordBirths = 0;
        this.recordBirthsDNA = DNA.default();
        this.recordFood = 0;
        this.recordFoodDNA = DNA.default();
        this.recordWater = 0;
        this.recordWaterDNA = DNA.default();
        this.recordDist = 0;
        this.recordDistDNA = DNA.default();
        this.recordMetabolism = 0;
        this.recordMetabolismDNA = DNA.default();
        this.recordEnergyGen = 0;
        this.recordEnergyGenDNA = DNA.default();

        this.visualization = true;

        this.npcs = [];
        this.population = 0;
        this.time = 0;

        this.plantTimer = 1000;
    }

    init() {
        console.log("Initialized");
        this.quadtree = new Quadtree(1, 0, 0, worldSize, worldSize, null);
        this.quadtree.init();
        this.cameraTarget = {position: new Vector(worldSize/2, worldSize/2, 0)};
        this.ui.pushMessage("BUILDING WORLD...", "#FFF");
        console.log("Loading");
        window.setTimeout(this.gameLoop, 10);
    }

    start() {
        terrain.generateNpcs(50, "chicken");
        this.ui.pushMessage("<P> TO BEGIN", "#FFF");
        game.ui.draw();
        this.state = "ready";
    }

    cameraMove(direction) {
        if (!(this.cameraTarget instanceof(Npc))) {
            this.cameraTarget.position.add(direction.mult(4));
        }
    }

    gameLoop() {
        if (!game.paused) { 
            game.time++;
            var current = performance.now();
            game.dt += Math.min(.02, (current - game.lastFrame) / 1000);   // duration capped at 20ms
            while(game.dt > game.step) {
                game.dt -= game.step;
                game.update(game.step);
                if (game.visualization) game.draw(game.step);
            }
            game.lastFrame = current;
            game.ui.draw();
        } else {
            controls.pausedActions();
        }

        if (game.state == "loading") {
            terrain.load();
        }
        if (game.visualization) {
            window.requestAnimationFrame(game.gameLoop);
        } else {
            setTimeout(game.gameLoop, 0);
        }
    }

    update(dt) {
        this.quadtree.clear();
        for (var i = this.entities.length-1; i >= 0; i--) {
            this.quadtree.insert(this.entities[i]);
        }


        this.plantTimer--;
        if (this.plantTimer <= 0) {
            this.plantTimer = 1000;
            if (game.entities.length < 600) terrain.generatePlants(10);
        }

        controls.actions();

        this.updateView();

        for (var i = this.entities.length-1; i >= 0; i--) {
            this.entities[i].update(dt);    
        }
        while (this.toRemove.length > 0) {
            var rem = this.toRemove.pop();
            this.entities.splice(this.entities.indexOf(rem),1);
            if (rem instanceof Npc && this.getNpcs().length < 2) {
                this.killNpcs();
                console.error("Everyone died. Reseeding.  Max age: " + this.recordAge);
                var temp;
                for (var i = 0; i < 50; i++) {
                    temp = DNA.crossover(this.getRandomRecord(), this.recordEnergyGenDNA);
                    temp.mutate(50);
                    Npc.create(terrain.getRandomLand(), "chicken", temp);
                }
            }
        }
    }

    getRandomRecord() {
        var ret;
        switch(Math.random()*4|0) {
            case 0:
                ret = this.recordBirthsDNA;
                break;
            case 1:
                ret = this.recordFoodDNA;
                break;
            case 2:
                ret = this.recordWaterDNA;
                break;
            case 3:
                ret = this.recordEnergyGenDNA;
                break;
        }
        if (!(ret instanceof DNA)) {
            console.error("Error in get random record");
        }
        return ret;
    }

    draw(dt) {
        this.ctx.canvas.width = this.ctx.canvas.width;
        var toDraw = this.quadtree.retrieve(this.view.x + (viewSize>>1), this.view.y + (viewSize>>1), viewSize*.75);
        toDraw.sort(function(a,b) {return a.position.y-b.position.y});
        for (var i = 0; i < toDraw.length; i++) {
            toDraw[i].draw(this.ctx, dt);
        }
    }

    updateView() {
        this.view.x = (this.cameraTarget.position.x + this.cameraOffset.x - this.viewWidth*.5);
        this.view.y = (this.cameraTarget.position.y + this.cameraOffset.y - this.cameraOffset.z - this.viewHeight*.5);
        var vx = -this.view.x - (terrain.zoom-100)*2 + (worldSize - this.viewWidth)*.5;
        var vy = -this.view.y - (terrain.zoom-100)*2 + (worldSize - this.viewHeight)*.5;
        this.ctx.canvas.style.backgroundPosition = vx + "px " + vy + "px";
    }

    selectRandomNpc() {
        var npcs = this.getNpcs();
        var r = npcs[Math.random()*npcs.length|0];
        if (r != undefined) this.selectNpc(r.position.x, r.position.y);
    }

    getNpcs() {
        var npcs = [];
        for (var npc of this.entities) {
            if (npc instanceof Npc) npcs.push(npc);
        }
        return npcs;
    }

    killNpcs() {
        for (var npc of this.entities) {
            if (npc instanceof Npc) npc.die();
        }
    }

    selectNpc(x, y) {
        var near = this.quadtree.retrieve(x,y, 10);
        var nearest;
        if (near.length > 0) {
            var mouse = new Vector(x,y);
            for (var n of near) {
                if (n instanceof Npc && (nearest == undefined || Vector.distanceSqrd(mouse, n.position) < Vector.distanceSqrd(mouse, nearest.position))) {
                    nearest = n;
                }
            }
        }
        if (nearest != undefined) {
            this.cameraTarget = nearest;
            this.initEntityView(nearest);
        } else {
            this.dropCamera();
        }
    }

    initEntityView(npc) {
        btRenderer.setTree(npc.ai);
        // this.setStats(npc);
    }

    dropCamera() {
        btRenderer.clearCanvas();
        this.cameraTarget = {position: new Vector(this.view.x + this.viewWidth/2, this.view.y + this.viewHeight/2, 0)};
    }

    pause() {
        this.paused = true;
        this.ui.pushMessage("PAUSED", "#F00");
        this.ui.pushMessage("- click to continue -","#FFF");
        game.ui.draw();
    }

    resume() {

        if (this.paused){
            this.paused = false;
            this.ctx.globalAlpha = 1;
            this.ui.pushMessage("Resumed", "#F00");
            window.requestAnimationFrame(game.gameLoop);
        }
    }
 
    addEntity(entity) {
        if (entity instanceof Npc) this.population++;
        this.entities.push(entity);
    }

    remove(entity) {
        if (entity instanceof Npc) {
            this.population--;
            var isRecord = false;
            if (entity.timeAlive > this.recordAge && entity.births > 0 && entity.dna.metabolicRate > 0.001) {
                this.recordAge = entity.timeAlive;
                this.recordAgeDNA = entity.dna;
                isRecord = true;
            }
            if (entity.births > this.recordBirths) {
                this.recordBirths = entity.births;
                this.recordBirthsDNA = entity.dna;
                isRecord = true;
            }
            if (entity.foodEaten > this.recordFood) {
                this.recordFood = entity.foodEaten;
                this.recordFoodDNA = entity.dna;
                isRecord = true;
            }
            if (entity.waterDrank > this.recordWater) {
                this.recordWater = entity.waterDrank;
                this.recordWaterDNA = entity.dna;
                isRecord = true;
            }
            if (entity.distanceTraveled > this.recordDist) {
                this.recordDist = entity.distanceTraveled;
                this.recordDistDNA = entity.dna;
                isRecord = true;
            }
            if (entity.dna.metabolicRate > this.recordMetabolism) {
                this.recordMetabolism = entity.dna.metabolicRate;
                this.recordMetabolismDNA = entity.dna;
                isRecord = true;
            }
            if (entity.energyGenerated > this.recordEnergyGen) {
                this.recordEnergyGen = entity.energyGenerated;
                this.recordEnergyGenDNA = entity.dna;
                isRecord = true;
            }
            
            
            //this.logDNA(entity.dna, entity.timeAlive, this.time, entity.births, isRecord, entity.lastDamage);            
        };
        this.toRemove.push(entity);
    }

    logDNA(dna, age, tod, births, record, cause) {
        document.getElementById("logDNA").value += 
        record + ", " + 
        age + ", " + 
        tod + ", " +
        births + ", " + 
        cause + ", " + 
        dna.metabolicRate + ", " + 
        dna.thirstThreshold + ", " + 
        dna.hungerThreshold + ", " + 
        dna.matingThreshold + ", " + 
        dna.energyThreshold + ", " + 
        dna.thirstSated + ", " + 
        dna.hungerSated + ", " + 
        dna.energySated + ", " + 

        dna.wanderWeight + ", " + 
        dna.uphillWeight + ", " + 

        dna.foodPreference + ", " + 
        dna.attackPreference + ", " + 
        
        dna.plantWeight + ", " + 
        dna.meatWeight + ", " + 
        dna.waterWeight + ", " + 
        dna.matingWeight + ", " + 
        dna.orientationWeight + ", " + 
        dna.cohesionWeight + ", " + 
        dna.separationWeight + ", " + 
        dna.matingDonationM + ", " + 
        dna.matingDonationF + ", " + 

        dna.drowningAggression + ", " + 
        dna.foodAggression + ", " + 
        dna.drinkAggression + ", " + 
        dna.matingAggression + ", " + 
        dna.wanderAggression + ", " +
        
        dna.attackDelay + ", " +
        dna.loyalty + "\n";
    }

    setStats(npc) { 
        document.getElementById("health").value = npc.health;
        document.getElementById("maxHealth").value = npc.maxhealth;
        document.getElementById("hunger").value = npc.hunger;
        document.getElementById("thirst").value = npc.thirst;
        document.getElementById("energy").value = npc.energy;
        document.getElementById("metabolicRate").value = npc.dna.metabolicRate;
        document.getElementById("thirstThreshold").value = npc.dna.thirstThreshold;
        document.getElementById("hungerThreshold").value = npc.dna.hungerThreshold;
        document.getElementById("matingThreshold").value = npc.dna.matingThreshold;
        document.getElementById("energyThreshold").value = npc.dna.energyThreshold;
        document.getElementById("thirstSated").value = npc.dna.thirstSated;
        document.getElementById("hungerSated").value = npc.dna.hungerSated;
        document.getElementById("energySated").value = npc.dna.energySated;

        document.getElementById("wanderWeight").value = npc.dna.wanderWeight;
        document.getElementById("uphillWeight").value = npc.dna.uphillWeight;

        document.getElementById("foodPreference").value = npc.dna.foodPreference;
        document.getElementById("attackPreference").value = npc.dna.attackPreference;

        document.getElementById("plantWeight").value = npc.dna.plantWeight;
        document.getElementById("meatWeight").value = npc.dna.meatWeight;
        document.getElementById("waterWeight").value = npc.dna.waterWeight;
        document.getElementById("matingWeight").value = npc.dna.matingWeight;
        document.getElementById("orientationWeight").value = npc.dna.orientationWeight;
        document.getElementById("cohesionWeight").value = npc.dna.cohesionWeight;
        document.getElementById("separationWeight").value = npc.dna.separationWeight;
        document.getElementById("matingDonationM").value = npc.dna.matingDonationM;
        document.getElementById("matingDonationF").value = npc.dna.matingDonationF;

        document.getElementById("drowningAggression").value = npc.dna.drowningAggression;
        document.getElementById("foodAggression").value = npc.dna.foodAggression;
        document.getElementById("drinkAggression").value = npc.dna.drinkAggression;
        document.getElementById("matingAggression").value = npc.dna.matingAggression;
        document.getElementById("wanderAggression").value = npc.dna.wanderAggression;

        document.getElementById("attackAggression").value = npc.dna.attackAggression;
        document.getElementById("loyalty").value = npc.dna.loyalty;
    }

    saveData() {
        var e = [];
        for (var entity of this.entities) {
            e.push({"class":entity.constructor.name, "data":entity.save()});
        }
        return JSON.stringify({entities:e});
    }

    save() {
        saveString = this.saveData();
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(saveString));
        pom.setAttribute('download', 'saveData.json');
        pom.click();
    }

    load() {
        var pom = document.createElement('input');
        pom.setAttribute('type', 'file');
        pom.setAttribute('id', 'load');
        pom.click();
        pom.addEventListener('change', function() {
            var reader = new FileReader();
            reader.addEventListener('load', function() {
                game.loadData(this.result);
            });
            reader.readAsText(pom.files[0]);
        
        }, false);
    }

    loadData(data) {
        game.entities = [];
        data = JSON.parse(data);
        for (var entity of data.entities) {
            switch(entity.class) {
                case "Npc":
                    Npc.load(entity.data);
                    break;
                case "StaticEntity":
                    StaticEntity.load(entity.data);
                    break;
                case "Resource":
                    Resource.load(entity.data);
                    break;
            }
        }
    }
}