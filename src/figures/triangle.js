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
        this.type = utils.FigTypes.Triangle;
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
    // left point
    get p1() {
        return { x: this.x - this.r, y: this.y + this.smallR };
    }
    // top point
    get p2() {
        return { x: this.x, y: this.y - this.r };
    }
    // right point
    get p3() {
        return { x: this.x + this.r, y: this.y + this.smallR };
    }
    //#endregion points

    //#region edges
    get edge12() {
        return { p1: this.p1, p2: this.p2 };
    }
    get edge23() {
        return { p1: this.p2, p2: this.p3 };
    }
    get edge31() {
        return { p1: this.p3, p2: this.p1 };
    }
    //#endregion

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

    intersects(fig) {
        return utils.intersects(this, fig);
    }

    contains(point) {
        return utils.pointInTriangle(point, this.p2, this.p3, this.p1);
    }

    simpleCollisionsCheck(figures) {
        for (const fig of figures) {
            if (fig.isAlive && fig !== this && utils.intersects(this, fig)) {
                // console.log({ this: JSON.stringify(this), fig: JSON.stringify(fig)})
                this.collisions += 1;

                this.vx *= -1;
                this.vy *= -1;
                // console.log({ this: JSON.stringify(this), fig: JSON.stringify(fig)})
                console.log("")
            }
        }
    }

    move(canvas, figures) {
        if (this.isAlive) {
            utils.checkWalls(this, canvas);
            this.simpleCollisionsCheck(figures);

            this.x += this.vx;
            this.y += this.vy;
        }
    }

    draw(context) {
        if (this.isAlive) {
            context.beginPath();
            context.fillStyle = this.colors[this.collisions];
            context.moveTo(this.p2.x, this.p2.y);
            for (const p of [this.p3, this.p1, this.p2]) {
                context.lineTo(p.x, p.y);
            }    
            context.fill();
            context.strokeStyle = "black";
            context.lineWidth = 3;
            context.stroke();
            context.closePath();
        }
    }
}