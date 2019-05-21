class GUI {
    constructor(uiCtx) {
        this.uiCtx = uiCtx;

        this.textFade = [];
        this.msg = [];
        this.msgColor = [];
    }

    draw() {
        this.clearUI();
        // graphing.drawPlots() // TODO move this to a new canvas
        this.drawMessages();
        if (game.cameraTarget instanceof(Npc)) {
            this.drawStats(game.cameraTarget);
        }
    }

    clearUI() {
        this.uiCtx.canvas.width = viewSize;
    }

    pushMessage(msg, color) {
        // console.log("UI msg: " + msg);
        // if (color == undefined) color = "#FFF";
        // this.msg.push(msg);
        // this.msgColor.push(color);
        // this.textFade.push(200);
    }

    popMessage(i) {
        this.msg.splice(i,1);
        this.msgColor.splice(i,1);
        this.textFade.splice(i,1);
    }

    drawStats(npc) {
        var x = 16;
        var y = 16;
        this.drawStat(x, y+=16, "Type", npc.spr, "#000");
        this.drawStat(x, y+=16, "Health", npc.health);
        this.drawStat(x, y+=16, "Hunger", npc.hunger, (npc.hunger < npc.dna.gene["hungerThreshold"])? "#F00": "#FFF");
        this.drawStat(x, y+=16, "Thirst", npc.thirst, (npc.thirst < npc.dna.gene["thirstThreshold"])? "#F00": "#FFF");
        this.drawStat(x, y+=16, "Mate", npc.mate, (npc.mate > npc.dna.gene["matingThreshold"])? "#F00": "#FFF");
        this.drawStat(x, y+=16, "Energy", npc.energy);
        this.drawStat(x, y+=16, "Position", npc.position.x.toFixed(2) + ", " + npc.position.y.toFixed(2));
        this.drawStat(x, y+=16, "Altitude", terrain.getHeight(npc.position.x, npc.position.y));
        var slope = terrain.getSlope(npc.position.x, npc.position.y);
        this.drawStat(x, y+=16, "Slope", slope.x.toFixed(2) + ", " + slope.y.toFixed(2));
        this.drawStat(x, y+=16, "Velocity", npc.velocity.x.toFixed(2) + ", " + npc.velocity.y.toFixed(2));
        this.drawStat(x, y+=16, "Vel Mag", npc.velocity.magnitude());
        this.drawStat(x, y+=16, "Time Alive", npc.timeAlive);
        }

    drawStat(x, y, stat, value, color) {
        if (typeof value === "number") value = parseFloat(value.toFixed(2));
        stat = stat + ": " + value;
        this.uiCtx.globalAlpha = 0.5;
        var twidth = this.uiCtx.measureText(stat).width;
        this.uiCtx.fillStyle = "#666";
        this.uiCtx.fillRect(x-4, y-12, twidth + 8, 16)
        this.uiCtx.globalAlpha = 1;
        if (color === undefined) color = "#FFF";
        this.uiCtx.fillStyle = color;
        this.uiCtx.fillText(stat, x, y);
    }
    
    drawMessages() {
        var i;
        for (i = this.msg.length-1; i > 0; i--) {
            var twidth = this.uiCtx.measureText(this.msg[i]).width;
            var ty = game.viewHeight - 16 + (i - (this.msg.length-1))*16;
            this.uiCtx.fillStyle = "#666";
            this.uiCtx.globalAlpha = this.textFade[i]--/100;
            this.uiCtx.fillRect(12, ty-12, twidth + 8, 16)
            this.uiCtx.fillStyle = this.msgColor[i];
            // this.uiCtx.fillText(this.msg[i], (game.viewWidth - twidth)*.5 | 0, (game.viewHeight)*.25 + (i - this.msg.length)*16);
            this.uiCtx.fillText(this.msg[i], 16, ty);
            if (this.textFade[i] <= 1) this.popMessage(i);
        }
    }
}