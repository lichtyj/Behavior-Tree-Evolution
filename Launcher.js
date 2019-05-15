var game;
var assetMgr = new AssetManager();
var terrain = new Terrain();
var controls = new Controls();
var btRenderer = new BtRenderer();
var graphing = new Graphing();
var viewSize = 400;
var dataWidth = 300;
var dataHeight = 1680;
var borderBuffer = 30;
var worldSize = 1024;
var ready = 0;
var saveString = "";

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
    console.log("Done loading image assets");
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

    // data canvas
    var dCanvas = document.getElementById("dataCanvas");
    dCanvas.width = dataWidth;
    dCanvas.height = dataHeight;
    // dCanvas.style.imageRendering = "Pixelated";
    var dCtx = dCanvas.getContext('2d', { alpha: true });
    // dCtx.imageSmoothingEnabled = false;


    game = new GameEngine(ctx, uiCtx);
    game.init();
    graphing.init(dCtx);
    btRenderer.init();
    terrain.init();
    controls.init();
    setDefaults();
}

function setDefaults() {
    
    var defaultDNA = DNA.default();

    document.getElementById("logDNA").value += 
    "isRecord, " + 
    "age, " + 
    "tod, " + 
    "births, " + 
    "death, " +

    "metabolicRate, " + 
    "thirstThreshold, " + 
    "hungerThreshold, " + 
    "matingThreshold, " + 
    "energyThreshold, " + 

    "thirstSated, " + 
    "hungerSated, " + 
    "energySated, " + 
    "wanderWeight, " + 
    "uphillWeight, " + 

    "foodPreference, " + 
    "attackPreference, " + 

    "meatWeight, " + 
    "plantWeight, " + 
    "waterWeight, " + 
    "matingWeight, " + 
    "orientationWeight, " + 
    "cohesionWeight, " + 
    "separationWeight, " + 

    "matingDonationM, " + 
    "matingDonationF, " + 

    "drowningAggression, " + 
    "foodAggression, " + 
    "drinkAggression, " + 
    "matingAggression, " + 
    "wanderAggression, " + 
    "attackDelay, " + 
    "loyalty\n";

    document.getElementById("health").value = 100;
    document.getElementById("maxHealth").value = 100;
    document.getElementById("hunger").value = 100;
    document.getElementById("thirst").value = 100;
    document.getElementById("mate").value = 0;
    document.getElementById("energy").value = 100;
    document.getElementById("metabolicRate").value = defaultDNA.metabolicRate;
    document.getElementById("thirstThreshold").value = defaultDNA.thirstThreshold;
    document.getElementById("hungerThreshold").value = defaultDNA.hungerThreshold;
    document.getElementById("matingThreshold").value = defaultDNA.matingThreshold;
    document.getElementById("energyThreshold").value = defaultDNA.energyThreshold;
    document.getElementById("thirstSated").value = defaultDNA.thirstSated;
    document.getElementById("hungerSated").value = defaultDNA.hungerSated;
    document.getElementById("energySated").value = defaultDNA.energySated;
    document.getElementById("wanderWeight").value = defaultDNA.wanderWeight;
    document.getElementById("uphillWeight").value = defaultDNA.uphillWeight;
    document.getElementById("foodPreference").value = defaultDNA.foodPreference;
    document.getElementById("attackPreference").value = defaultDNA.attackPreference;
    document.getElementById("meatWeight").value = defaultDNA.meatWeight;
    document.getElementById("plantWeight").value = defaultDNA.plantWeight;
    document.getElementById("waterWeight").value = defaultDNA.waterWeight;
    document.getElementById("matingWeight").value = defaultDNA.matingWeight;
    document.getElementById("orientationWeight").value = defaultDNA.orientationWeight;
    document.getElementById("cohesionWeight").value = defaultDNA.cohesionWeight;
    document.getElementById("separationWeight").value = defaultDNA.separationWeight;

    document.getElementById("matingDonationM").value = defaultDNA.matingDonationM;
    document.getElementById("matingDonationF").value = defaultDNA.matingDonationF;

    document.getElementById("drowningAggression").value = defaultDNA.drowningAggression;
    document.getElementById("foodAggression").value = defaultDNA.foodAggression;
    document.getElementById("drinkAggression").value = defaultDNA.drinkAggression;
    document.getElementById("matingAggression").value = defaultDNA.matingAggression;
    document.getElementById("wanderAggression").value = defaultDNA.wanderAggression;

    document.getElementById("attackDelay").value = defaultDNA.attackDelay;
    document.getElementById("loyalty").value = defaultDNA.loyalty;
}