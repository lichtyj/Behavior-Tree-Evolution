class BNode {
    constructor(parent, name) {
        this.parent = parent;
        this.name = name;
        this.x = 0;
        this.xOffset = 0;
        this.children = [];
        if (parent == null) {
            this.level = 0;
        } else {
            this.level = parent.level + 1;
        }
        this.state;
        this.selected = false;
        this.active = false;
    }

    tick() {
        console.log("tick");
    }

    getDepth() {
        var level = this.level;
        for(var c of this.children) {
            level = Math.max(level, c.getDepth());
        }
        return level;
    }

    getLevelPop(level) {
        var ret = [];
        if (this.level == level) {
            ret.push(this);
        } else {
            for (var c of this.children) {
                ret = ret.concat(c.getLevelPop(level));
            }
        }
        ret.sort(function(a,b) {return b.x - a.x});
        return ret;
    }

    getTree() {
        var ret = [this];
        for (var c of this.children) {
                ret = ret.concat(c.getTree());
        }
        return ret;
    }

    checkValidity() {
        var ret = true;
        if (this.children.length == 0 && this instanceof ActionNode) {
            ret = true;
        } else if (this.children.length == 0) {
            ret = false;
        } else if (this.children.length > 1 && !(this instanceof ParentNode)) {
            ret = false;
        } else {
            for (var c of this.children) {
                ret = (ret && c.checkValidity());
            }
        }

        return ret;
    }

    resetIndices() {
        this.index = 0;
        this.state = undefined;
        if (this instanceof ParentNode) this.maxIndex = this.children.length-1;
        for (var c of this.children) {
            c.resetIndices();
        }
    }
}

class ParentNode extends BNode {
    constructor(parent, name) {
        super(parent, name);
        this.maxIndex = 0;
        this.index = 0;
    }

    tick(tree) {
        // console.log(this.name);
        if (this.index <= this.maxIndex) {
            this.children[this.index++].tick(tree);
        } else {
            if (this.children[this.index-1].state === "success") {
                this.state = "success";
            } else {
                this.state = "failed";
            }
            if (this.parent != null) {
                this.parent.tick(tree);
            } else {
                this.resetIndices();
                // console.log("Reset");
            }
        }
    }
}

class SelectorNode extends ParentNode {
    constructor(parent, name) {
        super(parent, name);
        this.color = "#600";
    }

    tick(tree) {
        // console.log(this.name);
        if (this.index > 0 && this.children[this.index-1].state === "success") {
            this.state = "success";
            this.index = this.maxIndex+1;
        }
        if (this.index <= this.maxIndex) {
            this.children[this.index++].tick(tree);
        } else {
            if (this.children[this.index-1].state === "failed") {
                this.state = "failed";
                // console.log("Selector failed");
            } else {
                this.state = "success";
                // console.log("Selector Success");
            }            
            this.parent.tick(tree);
        }
    }
}

class SequenceNode extends ParentNode {
    constructor(parent, name) {
        super(parent, name);
        this.color = "#006";
    }

    tick(tree) {
        // console.log(this.name);
        if (this.index > 0 && this.children[this.index-1].state === "failed") {
            this.state == "failed";
            this.index = this.maxIndex+1;
        }
        if (this.index <= this.maxIndex) {
            this.children[this.index++].tick(tree);
        } else {
            if (this.children[this.index-1].state === "success") {
                this.state = "success";
            } else {
                this.state = "failed";
            }
            this.parent.tick(tree);
        }
    }
}

class InverterNode extends ParentNode {
    constructor(parent, name) {
        super(parent, name);
        this.color = "#606";
        this.index = 0;
        this.maxIndex = 0;
    }

    tick(tree) {
        // console.log(this.name);
        if (this.index <= this.maxIndex) {
            this.children[this.index++].tick(tree);
        } else {
            if (this.children[0].state === "success") {
                this.state = "failed";
            } else {
                this.state = "success";
            }
            this.parent.tick(tree);
        }
    }
}

class ActionNode extends BNode {
    constructor(parent, name, action) {
        super(parent, name);
        this.action = action;
        this.color = "#060";
    }

    tick(tree) {
        // console.log(this.name);
        tree.setActive(this);
        if (this.state != "running") {
            this.state = "running";
            this.action(this);
        }
    }

    finish(state, tree) {
        if (state) {
            this.state = "success";
        } else {
            this.state = "failed";
        }
        // console.log(this.name + " set to " + this.state);
        this.parent.tick(tree);
    }
}