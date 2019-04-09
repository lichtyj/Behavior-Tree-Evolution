
class BtRenderer {
    constructor() {
        this.ctx;
        this.cSize = 800;
        this.bt;
        this.size = 20;
        this.offset = 20;

        this.x = 0;
        this.y = 0;
        this.width = this.size*4;

    }

    init() {
        var canvas = document.getElementById("btCanvas");
        canvas.style.background = '#888';
        canvas.width = this.cSize*2;
        canvas.height = this.cSize;
        this.ctx = canvas.getContext('2d');
    }

    setTree(newBt) {
        if (newBt instanceof BehaviorTree) {
            this.bt = newBt;
            console.log("Drawing " + newBt.entity.spr + "'s tree");
            this.drawTree();
        } else {
            console.error("Not a behavior tree");
        }
    }

    drawTree() {
        var tree = this.bt.root.getTree();
        console.log(tree);
        
        for (var i = 0; i < tree.length; i++) {
            this.drawNode(tree[i]);
            console.log(tree[i]);
        }
    }

    nodeColors(node) {
        var color;
        switch(node.constructor.name) {
            case "SelectorNode": 
                color = "#600";
                break;
            case "SequenceNode":
                color = "#006";
                break;
            case "ActionNode":
                color = "#060";
                break;
            default:
                color = "#FFF";
                break;
        }
        return color;
    }

    drawNode(node) {
        x = this.cSize/2;
        y = this.offset + node.level * this.size*2;
        var color = this.nodeColors(node);

        if (node.selected) {
            this.ctx.fillStyle = "#FFF";
        } else {
            this.ctx.fillStyle = color;
        }
        this.ctx.fillRect(x, y, this.size, this.size);

        if (node.active) {
            this.ctx.fillStyle = "#FFF";
            this.ctx.fillRect(x+this.size/4, y+this.size/4, this.size/2, this.size/2);
        }
        if (node.state == "failed") {
            this.ctx.fillStyle = "#F00";
            this.ctx.fillRect(x+this.size/4, y+this.size/4, this.size/2, this.size/2);
        }
        if (node.state == "success") {
            this.ctx.fillStyle = "#0F0";
            this.ctx.fillRect(x+this.size/4, y+this.size/4, this.size/2, this.size/2);
        }
        this.ctx.strokeStyle = "#000";

        this.ctx.fillStyle = "#FFF";
        this.ctx.font = "10px Arial";
        this.ctx.fillText(node.name, x, y);
    }

// var maxX = parent.x;    // This can go away.  From here
// parent.width = size*2;
// for (var c of parent.children) {
//     maxX = c.x;
//     c.x -= size;
//     parent.width += c.width;
// }
// if (parent.children.length != 0) {
//     newNode.x = maxX+size;
// } else {
//     newNode.x = maxX;
// }
// newNode.y = newNode.level*size*2+offset; // To here.

// drawTree() {
//     // ctx.canvas.width = ctx.canvas.width;
//     // this.root.drawNode(ctx);
// }


getNode(x,y) {
    var ret = null;
    if (this.y <= y) {
        if (this.y + size >= y && this.x <= x && this.x + size >= x) {
            ret = this;
        } else {
            for (var c of this.children) {
                ret = c.getNode(x,y);
                if (ret != null) break;
            }        
        }
    }
    return ret;
}

    updateWidths() {
        var depth = this.getRoot().getDepth();
        var level;
        while (depth > 0) {
            level = this.getRoot().getLevelPop(depth--);
            for (var l of level) {
                l.width = size*2;
                for (var c of l.children) {
                    l.width += c.width;
                }
            }
        }
    }



    
    offset() {
        var x = this.x-this.width/2;
        var dx = this.width/(this.children.length+1);
        for (var i = 0; i < this.children.length; i++) {
            x += dx;
            this.children[i].x = x;
            this.children[i].offset();
        }
    }
}
