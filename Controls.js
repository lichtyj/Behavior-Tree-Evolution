class Controls {
    constructor() {
        this.keys = [];
        this.lmb = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.doc;
    }

    init() {
        var that = this;
        this.doc =  document.getElementById("viewport");
        this.doc.addEventListener("keydown", function(e) {
            that.keyDown(e.keyCode)});
        this.doc.addEventListener("keyup", function(e) {
            that.keyUp(e.keyCode)});
        // this.doc.addEventListener("focus", function() {
        //     that.focus()});
        // this.doc.addEventListener("blur", function() {
        //     that.blur()});
        this.doc.addEventListener("mouseup", function(e) {
            that.mouseButton(e, false) });
        this.doc.addEventListener("mousedown", function(e) {
            that.mouseButton(e, true) });
        this.doc.addEventListener("wheel", function(e) {
            that.mouseWheel(Math.sign(e.deltaY)) });
    }

    // focus() {
    //     game.resume();
    //     document.getElementById("body").style="overflow: hidden;"
    // }

    // blur() {
    //     game.pause();
    //     document.getElementById("body").style="overflow: auto;"
    // }

    keyUp(num) {
        delete this.keys.splice(this.keys.indexOf(num),1);
    }

    keyDown(num) {
        if (this.keys.indexOf(num) == -1) {
            // console.log(num);
            this.keys.push(num);
        }
    }

    mouseButton(e, pressed) {
        if (pressed) {
            this.mouseX = (game.view.x + (game.viewWidth + e.layerX - 200)/2) | 0;
            this.mouseY = (game.view.y + (game.viewHeight + e.layerY - 200)/2) | 0;
            if (this.keys.indexOf("lmb") == -1) this.keys.push("lmb");
        } else {
            this.keyUp("lmb");
        }
    }

    mouseWheel(y) {
        // terrain.zoomIn(y*.05);
    }

    pausedActions() {
        if (game.paused) {            
            for (var key of this.keys) {
                switch(key) {
                    case 32: // space
                        game.update(game.step);
                        game.draw(game.step);
                        game.ui.draw();
                        this.keyUp(key);
                        break;
                    case 80: // P
                        game.resume();
                        this.keyUp(key);
                        break;
                }
            }
        }
    }

    actions() {
        var moving = Vector.zero();
        for (var key of this.keys) {
            switch(key) {
                case 65: // A
                    moving.add(Vector.left());
                    break;
                case 68: // D
                    moving.add(Vector.right());
                    break;
                case 69: // E
                    if (game.cameraTarget instanceof(Npc)) {
                        game.cameraTarget.lastDamage = "you";
                        game.cameraTarget.die();
                    }
                    this.keyUp(key);
                    break;
                case 71: // G
                    terrain.generateObjects(25);
                    this.keyUp(key);
                    break;
                case 72: // H
                    terrain.generateFood(25);
                    this.keyUp(key);
                    break;
                case 80: // P
                    game.pause();
                    this.keyUp(key);
                    break;
                case 82: // R
                    game.selectRandomNpc();
                    this.keyUp(key);
                    break;
                case 83: // S
                    moving.add(Vector.back());
                    break;
                case 87: // W
                    moving.add(Vector.forward());
                    break;
                case 118: // F7
                    game.save();
                    this.keyUp(key);
                    break;
                case 120: // F9
                    game.load();
                    this.keyUp(key);
                    break;
                case "lmb":
                    if (this.keys.indexOf(81) != -1) { //  Q
                        var npc = Npc.create(new Vector(this.mouseX, this.mouseY, 0), "chicken");
                        npc.dna.mutate(50);
                        // npc.setStats();
                        game.ui.pushMessage("Added chicken");
                    } else {
                        game.selectNpc(this.mouseX, this.mouseY);
                    }
                    this.keyUp(key);
                    break;
            }
        }

        if (moving.magnitude() != 0) {
            game.cameraMove(moving.limit(game.viewSpeed));
        }
    }
}