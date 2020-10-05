import * as utils from "./figure-utils";

export default class Rectangle {
    static generate({width, height}, id) {
        const minW = width / 20;
        const maxW = width / 10;
        const w = minW + Math.random() * (maxW - minW);

        const minH = height / 20;
        const maxH = height / 10;
        const h = minH + Math.random() * (maxH - minH);

        const x = Math.random() * (width - maxW);
        const y = Math.random() * (height - maxH);

        const minV = 2;
        const maxV = 2;
        const vx = minV + Math.random() * (maxV - minV);
        const vy = minV + Math.random() * (maxV - minV);
        const fig = new Rectangle(x, y, w, h);
        fig.id = id;
        fig.vx = vx;
        fig.vy = vy;

        return fig;
    }

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.type = utils.FigTypes.Rect;
    }

    get left() {
        return this.x
    }

    get right() {
        return this.x + this.w
    }

    get top() {
        return this.y
    }

    get bottom() {
        return this.y + this.h
    }

    get isAlive() {
        return this.collisions < 3;
    }

    contains(point) {
        return (point.x >= this.x &&
            point.x < this.x + this.w &&
            point.y >= this.y &&
            point.y < this.y + this.h)
    }

    intersects(rect) {
        return utils.intersects(this, rect);
    }

    simpleCollisionsCheck(figures) {
        for (let fig of figures) {
            if (fig.isAlive && fig !== this && utils.intersects(this, fig)) {
                console.log("collide", {this: JSON.stringify(this), fig: JSON.stringify(fig)})
                
                this.collisions += 1;

                this.vx *= -1;
                this.vy *= -1;
            }
        }
    }

    move(canvas, figures) {
        if (this.isAlive) {
            utils.checkWalls(this, canvas);
            this.simpleCollisionsCheck(figures);

            // this.x += this.vx;
            // this.y += this.vy;
        }
    }

    draw(context) {
        if (this.isAlive) {
            context.beginPath();
            context.rect(this.left, this.top, this.w, this.h);
            context.fillStyle = this.colors[this.collisions];
            context.fill();
            context.strokeStyle = "black";
            context.lineWidth = 3;
            context.stroke();
            context.closePath();
        }
    }
}