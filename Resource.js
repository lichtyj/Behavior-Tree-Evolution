class Resource extends StaticEntity {
    constructor(position, type, rotation, spin) {
        super(position, type, rotation);
        this.spin = spin;
        this.type = type;
        this.amount = 100;
    }

    static create(position, type, rotation, spin) {
        var obj = new Resource(position, type, rotation, spin);
        game.addEntity(obj);
        return obj;
    }

    remove() {
        game.remove(this);
    }

    draw(ctx, dt) {
        if (this.type == "rawMeat") {
            if (this.amount <= 0) this.remove();
            if (Math.random() < 0.01) this.amount--;
        }
        this.rotation += this.spin;
        this.elapsedTime += dt;
        this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, 
            0/*this.position.z*/, this.rotation, this.bounce += .075, null, true);
    }

    save() {
        return JSON.stringify({position:this.position, type:this.type, 
            rotation:this.rotation, spin:this.spin, amount:this.amount});
    }

    static load(data) {
        data = JSON.parse(data);
        var obj = Resource.create(Vector.create(data.position), data.type, data.rotation, data.spin);
        obj.amount = data.amount;
        return obj;
    }
}