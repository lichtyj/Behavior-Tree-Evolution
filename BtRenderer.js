
class BtRenderer {
    constructor() {
        this.ctx;
        this.cSize = 400;
        this.bt;
        this.size = 30;
        this.gap = 20;
        this.offset = 25;

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
            // console.log("Drawing " + newBt.entity.spr + "'s tree");
            this.getOffsets(newBt.root);
            this.formatTree(newBt.root);
            this.centerTree(newBt.root);
            this.drawTree();
        } else {
            console.error("Not a behavior tree");
        }
    }

    centerTree(node) {
        var avg = 0;

        for (var c of node.children) {
            this.centerTree(c);
            avg += c.x;
        }
        if (node.children.length > 0) {
            avg /= node.children.length
            node.x = avg;
        }
    }

    formatTree(node) {
        // console.log(node.name + ": " + node.xOffset);
        node.x = 0;
        if (node.parent != null) {
            var index = node.parent.children.indexOf(node);
            if (index > 0) {
                node.x += node.parent.children[index-1].xOffset + 
                node.parent.children[index-1].x + index;
            } else {
                node.x += node.parent.x + index;
            }
            if (index > 1) {
                node.x--;
            }
        }
        for (var c of node.children) {
            this.formatTree(c);
        }
    }

    getOffsets(node) {
        var maxOffset = 0;
        for (var c of node.children) {
            maxOffset += this.getOffsets(c);
        }
        if (node.children.length > 0) {
            maxOffset += node.children.length - 1;
        }
        node.xOffset = maxOffset;
        return maxOffset;
    }

    drawTree() {
        this.clearCanvas();
        var tree = this.bt.root.getTree();
        // console.log(tree);
        
        for (var i = 0; i < tree.length; i++) {
            this.drawNode(tree[i]);
            // console.log(tree[i]);
        }
    }

    clearCanvas() {
        this.ctx.canvas.width = this.cSize*2;
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
            case "InverterNode":
                color = "#606";
                break;
            default:
                color = "#333";
                break;
        }
        return color;
    }

    // getMaxWidth(current, node) {
    //     var max = 0;
    //     if (current != node) {
    //         var temp = 0;
    //         for (var i = 0; i < current.children.length; i++) {
    //             temp = this.getMaxWidth(current.children[i], node);
    //             if (temp == -1) {
    //                 return max;
    //             } else if (temp > max) {
    //                 max = temp;
    //             }
    //         }
    //     } else {
    //         return -1;
    //     }
    //     if (current.parent != null) {
    //         max += current.parent.children.indexOf(current)+1;
    //     }
    //     return max;
    // }

    // getSpacing(node) {
    //     var spacing = this.size + this.gap;
    //     var x = this.getMaxWidth(this.bt.root, node)
    //     if (x == -1) x = 0;
    //     return x*spacing + this.offset;
    // }

    // getIndexing(current, node) {
    //     var max = 0;
    //     var temp;
    //     if (current != node) {
    //         max = current.children.length-1;
    //         temp = 0;
    //         for (var c of current.children) {
    //             temp = this.getIndexing(c, node);
    //             if (temp > max) max = temp;
    //         }
    //     } else if (current.parent != null) {
    //         max = current.parent.children.indexOf(current);
    //     }
    //     return max;
    // }

    // getSpacing(node) {
    //     var spacing = this.size + this.gap;
    //     var x = this.offset;
    //     while (node.parent != null) {
    //         var index = node.parent.children.indexOf(node);
    //         if (index > 0) {
    //             var index2 = node.parent.children[index-1].children.length-1;
    //             if (index2 > 0) x += index2*spacing;
    //         }
    //         x += index*spacing;
    //         node = node.parent;
    //     }
    //     return x;
    // }

    drawNode(node) {
        var spacing = this.size + this.gap;
        var x;
        var y = this.offset/2 + node.level * (this.size + this.gap/2);
        var color = this.nodeColors(node);

        // x = this.getSpacing(node);
        // x = this.getIndexing(this.bt.root, node)*spacing + this.offset;
        x = node.x*spacing + this.offset;
        // console.log(x);

        if (node.selected) {
            this.ctx.fillStyle = "#FFF";
        } else {
            this.ctx.fillStyle = color;
        }

        if (node.parent != null) {
            this.ctx.strokeStyle = "#333";
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(x + this.size/2, y + 3);
            this.ctx.lineTo(node.parent.x*spacing + this.offset + this.size/2, y - this.gap/2);
            this.ctx.stroke();
        }

        this.ctx.fillRect(x, y, this.size, this.size);

        this.ctx.fillStyle = "#FFF";
        this.ctx.font = "10px Arial";
        var twidth = this.ctx.measureText(node.name).width;
        this.ctx.fillText(node.name, x + (this.size - twidth)/2, y + this.size*.66);
    }

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
