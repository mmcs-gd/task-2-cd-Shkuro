import Circle from './circle';
import * as utils from './figure-utils';
import Rectangle from './rectangle';

export default class Triangle {
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

    range() {
        return new Circle(this.x, this.y, this.r * 3);
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    /* istanbul ignore next */
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