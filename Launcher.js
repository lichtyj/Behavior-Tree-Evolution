var game;
var assetMgr = new AssetManager();
var terrain = new Terrain();
var controls = new Controls();
var graphing = new Graphing();
var viewSize = 400;
var dataWidth = 800;
var dataHeight = 1680;
var borderBuffer = 30;
var worldSize = 1024;
var ready = 0;
var saveString = "";
// var socket;

assetMgr.queueDownload("./sprites/bush.png");
assetMgr.queueDownload("./sprites/chickenAdultFemale.png");
assetMgr.queueDownload("./sprites/chickenAdult.png");
assetMgr.queueDownload("./sprites/chicken.png");
assetMgr.queueDownload("./sprites/grass.png");
assetMgr.queueDownload("./sprites/particle.png");
assetMgr.queueDownload("./sprites/rawMeat.png");
assetMgr.queueDownload("./sprites/rock.png");
assetMgr.queueDownload("./sprites/shadow.png");
assetMgr.queueDownload("./sprites/tree.png");
assetMgr.queueDownload("./sprites/tree2.png");

assetMgr.downloadAll(function() {
    // console.log("Done loading image assets");
    createSprites();
});

function createSprites() {
    var frameduration = 0.15;

    //createSprite(name, frameWidth, frameHeight, layers, frameduration, frames)
    assetMgr.createSprite("bush", 16, 16, 6, frameduration, 1);
    assetMgr.createSprite("chickenAdult", 16, 16, 11, frameduration, 3, true);    
    assetMgr.createSprite("chickenAdultFemale", 16, 16, 11, frameduration, 3, true);
    assetMgr.createSprite("chicken", 16, 16, 11, frameduration, 3, true);
    assetMgr.createSprite("grass", 16, 16, 21, frameduration, 1);
    assetMgr.createSprite("rawMeat", 16, 16, 7, frameduration, 1, true);
    assetMgr.createSprite("rock", 16, 16, 9, frameduration*2, 12);
    assetMgr.createSprite("tree", 16, 16, 24, frameduration, 1);
    assetMgr.createSprite("tree2", 16, 16, 19, frameduration, 1);    

    // console.log("Done creating sprites");
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

    // data canvas
    var dCanvas = document.getElementById("dataCanvas");
    dCanvas.width = dataWidth;
    dCanvas.height = dataHeight;
    // dCanvas.style.imageRendering = "Pixelated";
    var dCtx = dCanvas.getContext('2d', { alpha: true });
    // dCtx.imageSmoothingEnabled = false;

    // socket = io.connect("http://");
    game = new GameEngine(ctx, uiCtx);
    game.init();
    graphing.init(dCtx);
    terrain.init();
    controls.init();
}