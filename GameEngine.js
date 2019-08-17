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
        this.logging = true;

        this.npcs = [];
        this.population = 0;
        this.time = 0;

        this.dataLogTimer = 25
        this.plantTimer = 50;

        this.dataLogInterval = 250;
        this.plantInterval = 25;

        this.runTitle = "Test";
        this.dataHeader = { 
            plantInterval: this.plantInterval,  
            dataLogInterval: this.dataLogInterval,
            dataIntervals: 0
        }
    }

    init() {
        this.quadtree = new Quadtree(1, 0, 0, worldSize, worldSize, null);
        this.quadtree.init();
        this.cameraTarget = {position: new Vector(worldSize/2, worldSize/2, 0)};
        this.ui.pushMessage("BUILDING WORLD...", "#FFF");
        window.setTimeout(this.gameLoop, 10);
    }

    start() {
        terrain.generateNpcs(100, "chicken");
        this.ui.pushMessage("<P> TO BEGIN", "#FFF");
        game.ui.draw();
        this.state = "ready";
    }

    endSimulation(state) {
        this.pause();
        saveString = graphing.dumpData();
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(saveString));
        pom.setAttribute('download', 'saveData.json');
        pom.click();
        console.error("Simulation complete - " + state);
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
        // if (game.visualization) {
            // window.requestAnimationFrame(game.gameLoop);
        // } else {
            setTimeout(game.gameLoop, 0);
        // }
    }

    update(dt) {
        this.quadtree.clear();
        for (var i = this.entities.length-1; i >= 0; i--) {
            this.quadtree.insert(this.entities[i]);
        }

        this.timers();

        controls.actions();

        this.updateView();

        for (var i = this.entities.length-1; i >= 0; i--) {
            this.entities[i].update(dt);    
        }
        while (this.toRemove.length > 0) {
            var rem = this.toRemove.pop();
            this.entities.splice(this.entities.indexOf(rem),1);
            if (rem instanceof Npc && this.getNpcs().length < 2) {
                // this.endSimulation("Failed");
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

    timers() {
        this.plantTimer--;
        this.dataLogTimer--;

        if (this.logging && this.dataLogTimer <= 0) {
            this.dataLogTimer = this.dataLogInterval;
            graphing.logTimeSlice();
        }

        if (this.plantTimer <= 0) {
            this.plantTimer = this.plantInterval;
            if (game.entities.length < 1500) terrain.generatePlants(5);
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

    getAvgDna() {
        var npcs = getNpcs();
        var dna = new DNA();
        for (var npc of npcs) {
            for (var i = 0; i < DNA.names.length; i++) {
                dna.gene[DNA.names[i]] += npc.dna.gene[DNA.names[i]];
            }
        }
        for (var i = 0; i < DNA.names.length; i++) {
            dna.gene[DNA.names[i]] /= npcs.length;
        }
        return dna;
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
        } else {
            this.dropCamera();
        }
    }

    dropCamera() {
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
            if (entity.timeAlive > this.recordAge && entity.births > 0 && entity.dna.gene["metabolicRate"] > 0.001) {
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
            if (entity.dna.gene["metabolicRate"] > this.recordMetabolism) {
                this.recordMetabolism = entity.dna.gene["metabolicRate"];
                this.recordMetabolismDNA = entity.dna;
                isRecord = true;
            }
            if (entity.energyGenerated > this.recordEnergyGen) {
                this.recordEnergyGen = entity.energyGenerated;
                this.recordEnergyGenDNA = entity.dna;
                isRecord = true;
            }
            graphing.logDeath(entity.lastDamage);
        };
        this.toRemove.push(entity);
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
