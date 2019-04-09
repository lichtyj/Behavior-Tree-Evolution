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
        this.paused = true;
        this.ui = new GUI(uiCtx);
        this.state = "loading";
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
        this.ui.pushMessage("CLICK TO BEGIN", "#FFF");
        document.getElementById("viewport").blur();
        this.state = "ready";
    }

    cameraMove(direction) {
        this.cameraTarget.position.add(direction);
    }

    gameLoop() {
        if (!game.paused) { 
            var current = performance.now();
            game.dt += Math.min(.02, (current - game.lastFrame) / 1000);   // duration capped at 20ms
            while(game.dt > game.step) {
                game.dt -= game.step;
                game.update(game.step);
                game.draw(game.step);
            }
            game.lastFrame = current;
            game.ui.draw();
        }

        if (game.state == "loading") {
            terrain.load();
        }
        window.requestAnimationFrame(game.gameLoop);
    }

    update(dt) {
        this.quadtree.clear();
        for (var i = this.entities.length-1; i >= 0; i--) {
            this.quadtree.insert(this.entities[i]);
        }

        controls.actions();

        this.updateView();

        for (var i = this.entities.length-1; i >= 0; i--) {
            this.entities[i].update(dt);    
        }
        while (this.toRemove.length > 0) {
            this.entities.splice(this.entities.indexOf(this.toRemove.pop()),1);
        }
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

    pause() {
        if (this.state == "playing") {
            this.paused = true;
            this.ui.pushMessage("PAUSED", "#F00");
            this.ui.pushMessage("- click to continue -","#FFF");
            game.ui.draw();
        }
    }

    resume() {

        if (this.state == "ready") {
            this.state = "playing";
            this.ui.pushMessage("Running", "#F00");
        }

        if (this.paused){
            this.paused = false;
            this.ctx.globalAlpha = 1;
            this.ui.pushMessage("Resumed", "#F00");
            window.requestAnimationFrame(game.gameLoop);
        }
    }
 
    addEntity(entity) {
        this.entities.push(entity);
    }

    remove(entity) {
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
        if (this.state == "playing")
            saveString = this.saveData();
    }

    load() {
        game.entities = [];
        this.loadData(saveString);
    }

    loadData(data) {
        // map
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