import * as utils from './figure-utils';

export default class Triangle {
    static generate({width, height}, id) {
        const minR = width / 30;
        const maxR = width / 20;
        const r = minR + Math.random() * (maxR - minR);

        const x = Math.random() * (width - maxR);
        const y = Math.random() * (height - maxR);

        const minV = 2;
        const maxV = 2;
        const vx = minV + Math.random() * (maxV - minV);
        const vy = minV + Math.random() * (maxV - minV);

        const fig = new Triangle(x, y, r);
        fig.id = id;
        fig.vx = vx;
        fig.vy = vy;
        fig.type = utils.FigTypes.Triangle;

        return fig;
    }

    // (x,y) - center of the circumscribed circle
    // r - radius of the circumscribed circle
    constructor(x, y, r, colors = ["green", "yellow", "red"]) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.collisions = 0;
        this.colors = colors;
    }

    get side() {
        return this.r * 3 / Math.sqrt(3);
    }

    get smallR() {
        return this.r / 2;
    }

    get height() {
        return this.r * 3 / 2;
    }

    //#region points
    get topPoint() {
        return { x: this.x, y: this.y - this.r };
    }

    get leftPoint() {
        return { x: this.x - this.r, y: this.y + this.smallR };
    }

    get rightPoint() {
        return { x: this.x + this.r, y: this.y + this.smallR };
    }
    //#endregion points

    get left() {
        return this.x - this.r;
    }

    get right() {
        return this.x + this.r;
    }

    get top() {
        return this.y - this.r;
    }

    get bottom() {
        return this.y + this.smallR;
    }

    get isAlive() {
        return this.collisions < 3;
    }

    contains(point) {
        return utils.pointInTriangle(point, this.tioPoint, this.rightPoint, this.leftPoint);
    }

    simpleCollisionCheck(figures) {
        for (const fig of figures) {
            if (fig.isAlive && fig !== this && utils.intersects(this, fig)) {
                console.log({ this: JSON.stringify(this), fig: JSON.stringify(fig)})
                this.collisions += 1;

                this.vx *= -1;
                this.vy *= -1;
                console.log({ this: JSON.stringify(this), fig: JSON.stringify(fig)})
                console.log("")
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
            context.fillStyle = this.colors[this.collisions];
            context.moveTo(this.topPoint.x, this.topPoint.y);
            for (const p of [this.rightPoint, this.leftPoint, this.topPoint]) {
                context.lineTo(p.x, p.y);
            }
            
            // context.lineTo(this.leftPoint.x, this.leftPoint.y);
            // context.lineTo(this.rightPoint.x, this.rightPoint.y);
            // context.lineTo(this.topPoint.x, this.topPoint.y);
            
            context.fill();
            context.strokeStyle = "black";
            context.lineWidth = 3;
            context.stroke();
            context.closePath();
        }
    }
}