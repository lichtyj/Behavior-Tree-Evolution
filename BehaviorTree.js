class BehaviorTree {
    constructor(entity) {
        this.root = new ParentNode(null);
        this.root.name = "Root";
        this.entity = entity;
        this.selected = this.root;
        this.timer = 0;
    }

    setActive(node) {
        if (node instanceof BNode) {
            if (this.active != null) this.active.active = false;
            this.active = node;
            this.active.active = true;
        } else {
            console.error(node + " is not a node.");
        }
    }

    setSelected(node) {
        if (this.selected instanceof BNode) this.selected.selected = false;
        this.selected = node;
        if (this.selected instanceof BNode) this.selected.selected = true;
    }

    select(e) {
        var x = e.clientX - ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - ctx.canvas.getBoundingClientRect().top;
        this.setSelected(this.root.getNode(x,y));
        this.formatTree();
    }

    finishAction(state) {
        if (this.active instanceof ActionNode)
            this.active.finish(state, this);
    }

    tick() {
        this.active.tick(this);
        return this.active.delay;
    }

    getBehavior() {
        this.root.tick(this);
    }

    addNode(parent, type, name, arg1) {
        var newNode;
        switch(type) {
            case "Selector":
                newNode = new SelectorNode(parent, name);
                break;
            case "Sequence":
                newNode = new SequenceNode(parent, name);
                break;
            case "Inverter":
                newNode = new InverterNode(parent, name);
                break;
            case "Action":
                newNode = new ActionNode(parent, name, arg1);
                break;
            default:
                newNode = new ParentNode(parent, name);
                break;
        }
        if (parent instanceof ActionNode || 
            (parent instanceof InverterNode && parent.children.length > 0)) {
            console.error("Invalid Tree Operation");
        } else {
            parent.children.push(newNode);
        }
        return newNode;
    }
}