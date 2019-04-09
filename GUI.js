class GUI {
    constructor(uiCtx) {
        this.uiCtx = uiCtx;

        this.textFade = [];
        this.msg = [];
        this.msgColor = [];
    }

    draw() {
        this.clearUI();
        this.drawMessages();
    }

    clearUI() {
        this.uiCtx.canvas.width = viewSize;
    }

    pushMessage(msg, color) {
        console.log("UI msg: " + msg);
        if (color == undefined) color = "#FFF";
        this.msg.push(msg);
        this.msgColor.push(color);
        this.textFade.push(200);
    }

    popMessage(i) {
        this.msg.splice(i,1);
        this.msgColor.splice(i,1);
        this.textFade.splice(i,1);
    }
    
    drawMessages() {
        var i;
        for (i = this.msg.length-1; i > 0; i--) {
            this.uiCtx.globalAlpha = this.textFade[i]--/100;
            var twidth = this.uiCtx.measureText(this.msg[i]).width;
            var ty = game.viewHeight - 16 + (i - (this.msg.length-1))*16;
            this.uiCtx.fillStyle = "#666";
            this.uiCtx.fillRect(12, ty-12, twidth + 8, 16)
            this.uiCtx.fillStyle = this.msgColor[i];
            // this.uiCtx.fillText(this.msg[i], (game.viewWidth - twidth)*.5 | 0, (game.viewHeight)*.25 + (i - this.msg.length)*16);
            this.uiCtx.fillText(this.msg[i], 16, ty);
            if (this.textFade[i] <= 1) this.popMessage(i);
        }
    }
}