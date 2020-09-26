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
        fig.type = utils.FigTypes.Rect;

        return fig;
    }

    constructor(x, y, w, h, colors = ["green", "yellow", "red"]) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.collisions = 0;
        this.colors = colors;
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

    simpleCollisionCheck(figures) {
        for (let fig of figures) {
            if (fig.isAlive && fig !== this && utils.intersects(this, fig)) {
                console.log("collide", {this: JSON.stringify(this), fig: JSON.stringify(fig)})
                
                this.collisions += 1;
                // let angle = Math.atan(Math.abs(this.vy) / Math.abs(this.vx));
                // const total = Math.abs(this.vy) / Math.sin(angle);
                // const tmpVx = this.vx + fig.vx;
                // const tmpVy = this.vy + fig.vy;
                // angle = Math.atan(Math.abs(tmpVy) / Math.abs(tmpVx));
                // this.vx = total * Math.cos(angle) * Math.sign(tmpVx);
                // this.vy = total * Math.sin(angle) * Math.sign(tmpVy);
                this.vx *= -1;
                this.vy *= -1;
            }
        }
    }

    move(canvas, figures) {
        if (this.isAlive) {
            utils.checkWalls(this, canvas);
            this.simpleCollisionCheck(figures);

            this.x += this.vx;
            this.y += this.vy;
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