class StaticEntity extends Entity {
    constructor(position, type, rotation) {
        super(position, assetMgr.getSprite(type));
        this.rotation = rotation;
        this.elapsedTime = 0;
        this.type = type;
    }

    static create(position, type, rotation) {
        var obj = new StaticEntity(position, type, rotation);
        game.addEntity(obj);
        return obj;
    }

    draw(ctx, dt) {
        this.elapsedTime += dt;
        this.sprite.drawSprite(ctx, this.elapsedTime, this.position.x, this.position.y, 
            0/*this.position.z*/, this.rotation, 0.25, true);   
    }

    save() {
        return JSON.stringify({position:this.position, type:this.type, 
            rotation:this.rotation});
    }

    static load(data) {
        data = JSON.parse(data);
        return StaticEntity.create(Vector.create(data.position), data.type, data.rotation);
    }
}