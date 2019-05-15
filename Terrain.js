class Terrain {
    constructor() {
        this.map = [worldSize*worldSize];
        this.colors = [];
        this.type = [];

        this.zoom = 256;
    }

    init() {
        this.colors.push({r:10 , g:40 , b:98});
        this.type.push("Deepest water");
        this.colors.push({r:22 , g:50 , b:105});
        this.type.push("Deep water");
        this.colors.push({r:33 , g:61 , b:115});
        this.type.push("Deep water");
        this.colors.push({r:65 , g:110 , b:160});
        this.type.push("Water");
        this.colors.push({r:80 , g:142 , b:185});
        this.type.push("Shallow water");
        this.colors.push({r:97 , g:162 , b:209});
        this.type.push("Shallows");
        this.colors.push({r:222 , g:212 , b:174});
        this.type.push("Sand");
        this.colors.push({r:117 , g:179 , b:95});
        this.type.push("Land");
        this.colors.push({r:101 , g:161 , b:96});
        this.type.push("Land");
        this.colors.push({r:85 , g:144 , b:97});
        this.type.push("Land");
        this.colors.push({r:83 , g:125 , b:92});
        this.type.push("High Land");
        this.colors.push({r:95 , g:117 , b:103});
        this.type.push("High Land");
        this.colors.push({r:105 , g:105 , b:105});
        this.type.push("Mountain");
        this.colors.push({r:135 , g:135 , b:135});
        this.type.push("Mountain");
        this.colors.push({r:195 , g:195 , b:195});
        this.type.push("Snowline");
        this.colors.push({r:235 , g:235 , b:245});
        this.type.push("Peak");
    }

    isInBounds(x, y) {
        return (x >= 0 && y >= 0 && x < this.map.length && y < this.map[0].length);
    }

    getHeight(x,y) {
        x = x|0;
        y = y|0;
        return (this.isInBounds(x,y))? this.map[x][y] : null;
    }

    getTerrainType(x,y) {
        var m = this.getHeight(x,y)*this.type.length | 0;
        return this.type[m];
    }

    getSlope(x,y) {
        var slope = new Vector(this.getHeight(x - 1, y) - this.getHeight(x + 1, y),
            this.getHeight(x, y - 1) - this.getHeight(x, y + 1));
        return slope.mult(100);
    }

    getRandomLand(noCollisions) {
        if (noCollisions == undefined) noCollisions = false;
        var valid = false;
        var h;
        var pos;
        while (!valid) {
            pos = Vector.randomPositive(worldSize, false);
            h = this.getHeight(pos.x, pos.y);
            if ((h > 0.375 && h < 0.875) && (game.quadtree.retrieve(pos.x, pos.y, 10).length == 0 || !noCollisions)) {
                valid = true;
            }
        }
        return pos;
    }

    getRandomLandRange(min, max, noCollisions) {
        if (noCollisions == undefined) noCollisions = false;
        var valid = false;
        var h;
        var pos;
        while (!valid) {
            pos = Vector.randomPositive(worldSize, false);
            h = this.getHeight(pos.x, pos.y);
            if ((h > min && h < max) && (game.quadtree.retrieve(pos.x, pos.y, 10).length == 0 || !noCollisions)) {
                valid = true;
            }
        }
        return pos;
    }

    getRandomLowLand(noCollisions) {
        if (noCollisions == undefined) noCollisions = false;
        var valid = false;
        var h;
        var pos;
        while (!valid) {
            pos = Vector.randomPositive(worldSize, false);
            h = this.getHeight(pos.x, pos.y);
            if (h < 0.375 && (game.quadtree.retrieve(pos.x, pos.y, 10).length == 0 || !noCollisions)) {
                valid = true;
            }
        }
        return pos;
    }

    isAboveWater(pos) {
        return (this.getHeight(pos.x,pos.y) > 0.375);
    }

    load() {
        this.map = generateTerrainMap(worldSize, 1, 6);
        this.clampWorld();
        this.draw();
        console.log("Done drawing world");
        this.generatePlants(200);
        game.start();
    }

    clampWorld() {
        var x,y,d;
        var s = worldSize/2;
        // var a = 32;
        var a = 0;
        for (x = 0; x < worldSize; x++) {
            for (y = 0; y < worldSize; y++) {
                d = this.distToCenter(x,y);
                if (d > s + a) {
                    this.map[x][y] = -1;
                } else if (d > s && d < s + a) {
                    this.map[x][y] *= (1-Math.pow(d/(s+a),2))*.125;
                } else {
                    this.map[x][y] *= 1-Math.pow(d/s,2);
                }
                if (this.map[x][y] < 0) this.map[x][y] = -1;
            }
        }
    }

    draw() {
        var total = worldSize*worldSize*4;
        var v = new Uint8ClampedArray(total);
        var j,k, x, y;
        var i = 0;
        for (y = 0; y < worldSize; y++) {
            for (x = 0; x < worldSize; x++) {
                j = this.map[x][y];
                k = j;
                
                if (k < 0) k = 0;
                if (k > 1) k = 1;

                k = Math.round(k*(this.colors.length-1));
                if (j == -1 || isNaN(k)) {
                    v[i++] = this.colors[0].r;
                    v[i++] = this.colors[0].g;
                    v[i++] = this.colors[0].b;
                } else {
                    v[i++] = this.colors[k].r;
                    v[i++] = this.colors[k].g;
                    v[i++] = this.colors[k].b;
                }
                v[i++] = 255;
            }
        }
            var can = document.createElement('canvas');
            can.width = worldSize;
            can.height = worldSize;
            var tempCtx = can.getContext('2d');
            tempCtx.putImageData(new ImageData(v, worldSize, worldSize), 0, 0);
            game.ctx.canvas.style.background = "url(" + can.toDataURL('terrain/png', 1.0) + ")";
            // game.ctx.canvas.style.background = "#00F";
            console.log("");
            game.ctx.canvas.style.backgroundRepeat = "initial";
            game.ctx.canvas.style.backgroundColor = "rgb(" + this.colors[0].r + ", " + this.colors[0].g + ", " + this.colors[0].b + ", "  + ")";
            game.ctx.canvas.style.backgroundSize = (this.zoom)+"%";
            game.updateView();
    }

    distToCenter(x,y) {
        return this.distToPoint(x,y, worldSize*.5, worldSize*.5);
    }

    distToPoint(x,y, px, py) {
        return Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
    }

    populate() {
        terrain.generateObjects(250);        
        terrain.generateFood(10);
        terrain.generatePlants(10);
        // terrain.generateChickens(20);
    }

    zoomIn(amount) {
        if (amount == undefined) console.error("zoom amount undefined");
        this.zoom += this.zoom*amount;
        console.log(this.zoom);
        game.ctx.canvas.style.backgroundSize = (this.zoom)+"%";
        game.updateView();
    }

    generateObjects(count) {
        var type;
        for (var i = 0; i < count; i++) {
            switch (Math.floor(Math.random()*4)) {
                case 0:
                    type = "bush";
                    break;
                case 1: 
                    type = "tree";
                    break;
                case 2: 
                    type = "tree2";
                    break;
                case 3: 
                    type = "rock";
                    break;
            }
            StaticEntity.create(this.getRandomLand(), type, Math.random()*Math.PI*2);
        }
    }

    generateFood(count) {
        var type;
        var spin = 0.01;
        for (var i = 0; i < count; i++) {
            switch (Math.floor(Math.random()*0)) {
                case 0:
                    type = "rawMeat";
                    break;
            }
            game.addEntity(new Resource(this.getRandomLand(true), type, Math.random()*Math.PI*2, spin));
        }
    }

    generatePlants(count) {
        var type;
        var spin = 0;
        for (var i = 0; i < count; i++) {
            switch (Math.floor(Math.random()*0)) {
                case 0:
                    type = "bush";
                    break;
            }
            // game.addEntity(new Resource(this.getRandomLand(true), type, Math.random()*Math.PI*2, spin));
            game.addEntity(new Resource(this.getRandomLandRange(0.5, 0.8, true), type, Math.random()*Math.PI*2, spin));
        }
    }

    generateNpcs(count, type) {
        var temp;
        for (var i = 0; i < count; i++) {
            temp = DNA.default();
            temp.mutate(50);
            Npc.create(this.getRandomLand(), type, temp);
        };
    }

    save() {
        return JSON.stringify(this.map);
    }

    static load(data) {
        this.map = JSON.parse(data);
        draw();
    }
}