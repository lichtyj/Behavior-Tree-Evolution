var game;
var assetMgr = new AssetManager();
var terrain = new Terrain();
var controls = new Controls();
var btRenderer = new BtRenderer();
var viewSize = 400;
var borderBuffer = 30;
var worldSize = 4096;
var ready = 0;
var saveString = "";

assetMgr.queueDownload("./sprites/bush.png");
assetMgr.queueDownload("./sprites/chicken.png");
assetMgr.queueDownload("./sprites/grass.png");
assetMgr.queueDownload("./sprites/particle.png");
assetMgr.queueDownload("./sprites/rawMeat.png");
assetMgr.queueDownload("./sprites/rock.png");
assetMgr.queueDownload("./sprites/shadow.png");
assetMgr.queueDownload("./sprites/tree.png");
assetMgr.queueDownload("./sprites/tree2.png");

assetMgr.downloadAll(function() {
    console.log("Done loading image assets");
    createSprites();
});

function createSprites() {
    var frameduration = 0.15;

    //createSprite(name, frameWidth, frameHeight, layers, frameduration, frames)
    assetMgr.createSprite("bush", 16, 16, 6, frameduration, 1);
    assetMgr.createSprite("chicken", 16, 16, 11, frameduration, 3, true);
    assetMgr.createSprite("grass", 16, 16, 21, frameduration, 1);
    assetMgr.createSprite("rawMeat", 16, 16, 7, frameduration, 1, true);
    assetMgr.createSprite("rock", 16, 16, 9, frameduration*2, 12);
    assetMgr.createSprite("tree", 16, 16, 24, frameduration, 1);
    assetMgr.createSprite("tree2", 16, 16, 19, frameduration, 1);    

    console.log("Done creating sprites");
    setReady();
}

document.addEventListener("DOMContentLoaded", setReady);

function setReady() {
    if (ready == 1) {
        start();
    }
    ready++;
}

function start() {
    // Game canvas
    var canvas = document.getElementById("canvas");
    canvas.width = viewSize;
    canvas.height = viewSize;
    canvas.style.background = '#000';
    canvas.style.imageRendering = "Pixelated";
    canvas.style.backgroundRepeat = "no-repeat";
    var ctx = canvas.getContext('2d', { alpha: true });
    ctx.imageSmoothingEnabled = false;

    // UI canvas
    var uiCanvas = document.getElementById("uiCanvas");
    uiCanvas.width = viewSize;
    uiCanvas.height = viewSize;
    uiCanvas.style.imageRendering = "Pixelated";
    var uiCtx = uiCanvas.getContext('2d', { alpha: true });
    uiCtx.imageSmoothingEnabled = false;

    game = new GameEngine(ctx, uiCtx);
    game.init();
    btRenderer.init();
    terrain.init();
    controls.init();
}



