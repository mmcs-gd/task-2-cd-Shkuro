import Rectangle from './figures/rectangle';
import * as utils from './figures/figure-utils';
import QuadTree, { Point } from './quad-tree';

const canvas = document.getElementById("cnvs");
const counter = document.getElementById("counter");
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
    counter.innerText = gameState.figures.length;

    const boundary = new Rectangle(0, 0, canvas.width, canvas.height);
    const tree = new QuadTree(boundary);
    gameState.figures.forEach(f => tree.insert(new Point(f.x, f.y, f)));
    moveFigures(tree);

    // moveFigures();

}

function cleareFigures() {
    if (gameState.figures.length > 0) {
        gameState.figures = gameState.figures.filter(fig => fig.isAlive)
    }
}

function moveFigures(tree) {
    // for (let fig of gameState.figures) {
    //     fig.simpleCollisionsCheck(gameState.figures);
    // }
    for (let fig of gameState.figures) {
        utils.checkWalls(fig, canvas);
        if (tree) {
            utils.checkCollisionsWithTree(fig, tree);
        } else {
            utils.checkCollisionsWithFigures(fig, gameState.figures);
        }
        // fig.move(canvas, gameState.figures, tree);
    }
    cleareFigures();
    for (let fig of gameState.figures) {
        fig.x += fig.vx;
        fig.y += fig.vy;
        
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

    const settings = {
        minW: canvas.width / 300,
        maxW: canvas.width / 100,
        minH: canvas.height / 300,
        maxH: canvas.height / 100
    };

    for (let i = 0; i < 600; ++i) {
        const r = Math.random();
        if (r < 0.3) {
            gameState.figures.push(utils.generateFigure(canvas, settings, utils.FigTypes.Circle, 0.5));
        } else if (r < 0.6) {
            gameState.figures.push(utils.generateFigure(canvas, settings, utils.FigTypes.Triangle, 0.5));
        } else {
            gameState.figures.push(utils.generateFigure(canvas, settings, utils.FigTypes.Circle, 0.5));
        }
    }
}

setup();
run();
