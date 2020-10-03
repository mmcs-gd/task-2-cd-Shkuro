const { default: Rectangle } = require("./figures/rectangle");
const {  default: Circle } = require("./figures/circle");
const {  default: Triangle } = require("./figures/triangle");
const {  default: Hexagon } = require("./figures/hexagon");

const canvas = document.getElementById("cnvs");

const gameState = {};

function queueUpdates(numTicks) {
    for (let i = 0; i < numTicks; i++) {
        gameState.lastTick = gameState.lastTick + gameState.tickLength
        update(gameState.lastTick)
    }
}

function draw(tFrame) {
    const context = canvas.getContext('2d');

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    // draw
    drawFigures(context);
}

function drawFigures(context) {
    for (let fig of gameState.figures) {
        fig.draw(context);
    }
}

function update(tick) {
    cleareFigures();
    moveFigures();
}

function cleareFigures() {
    if (gameState.figures.length > 0) {
        gameState.figures = gameState.figures.filter(fig => fig.isAlive)
    }
}

function moveFigures() {
    for (let fig of gameState.figures) {
        fig.move(canvas, gameState.figures);
    }
}

function run(tFrame) {
    gameState.stopCycle = window.requestAnimationFrame(run)

    const nextTick = gameState.lastTick + gameState.tickLength
    let numTicks = 0

    if (tFrame > nextTick) {
        const timeSinceTick = tFrame - gameState.lastTick
        numTicks = Math.floor(timeSinceTick / gameState.tickLength)
    }
    queueUpdates(numTicks)
    draw(tFrame)
    gameState.lastRender = tFrame
}

function stopGame(handle) {
    window.cancelAnimationFrame(handle);
}

function setup() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gameState.lastTick = performance.now()
    gameState.lastRender = gameState.lastTick
    gameState.tickLength = 15 //ms
    gameState.figures = [];
    // for (let i = 0; i < 2; ++i) {
    //     gameState.figures.push(Rectangle.generate(canvas, "rect"+i));
    // }
    for (let i = 0; i < 15; ++i) {
        gameState.figures.push(Hexagon.generate(canvas, "rect"+i));
    }
}

setup();
run();
