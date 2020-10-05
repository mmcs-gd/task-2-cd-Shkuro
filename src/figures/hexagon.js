import Circle from './circle';
import * as utils from './figure-utils';
import Rectangle from './rectangle';

export default class Hexagon {
    static generate({ width, height }, { minW, maxW, minH, maxH }, speed = 1) {
        const minR = Math.min(minW, minH);
        const maxR = Math.max(maxW, maxH);
        const r = minR + Math.random() * (maxR - minR);

        const x = Math.random() * (width - maxR);
        const y = Math.random() * (height - maxR);

        const vx = Math.random() > 0.5 ? speed : -speed;
        const vy = Math.random() > 0.5 ? speed : -speed;

        const fig = new Hexagon(x, y, r);
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
        this.type = utils.FigTypes.Hexagon;
    }

    get side() {
        return this.r;
    }

    get smallR() {
        return this.r * Math.sqrt(3) / 2;
    }

    //#region points
    // points are nubmered from 1 to 6 clockwise
    // starting with the top point
    get p1() {
        return { x: this.x, y: this.y - this.r };
    }

    get p2() {
        return { x: this.x + this.smallR, y: this.y - this.r / 2 };
    }

    get p3() {
        return { x: this.x + this.smallR, y: this.y + this.r / 2 };
    }

    get p4() {
        return { x: this.x, y: this.y + this.r };
    }

    get p5() {
        return { x: this.x - this.smallR, y: this.y + this.r / 2 };
    }

    get p6() {
        return { x: this.x - this.smallR, y: this.y - this.r / 2 };
    }
    //#endregion

    //#region edges
    get edge12() {
        return { p1: this.p1, p2: this.p2 };
    }
    get edge23() {
        return { p1: this.p2, p2: this.p3 };
    }
    get edge34() {
        return { p1: this.p3, p2: this.p4 };
    }
    get edge45() {
        return { p1: this.p4, p2: this.p5 };
    }
    get edge56() {
        return { p1: this.p5, p2: this.p6 };
    }
    get edge61() {
        return { p1: this.p6, p2: this.p1 };
    }
    //#endregion

    get left() {
        return this.x - this.smallR;
    }

    get right() {
        return this.x + this.smallR;
    }

    get top() {
        return this.y - this.r;
    }

    get bottom() {
        return this.y + this.r;
    }

    get isAlive() {
        return this.collisions < 3;
    }

    intersects(fig) {
        return utils.intersects(this, fig);
    }

    isVertex(point) {
        return utils.pointsAreEqual(this.p1, point) ||
            utils.pointsAreEqual(this.p2, point) ||
            utils.pointsAreEqual(this.p3, point) ||
            utils.pointsAreEqual(this.p4, point) ||
            utils.pointsAreEqual(this.p5, point) ||
            utils.pointsAreEqual(this.p6, point);
    }

    classify(point, v1, v2) {
        const a = { x: v2.x - v1.x, y: v2.y - v1.y };
        const b = { x: point.x - v1.x, y: point.y - v1.y };
        const res = a.x * b.y - b.x * a.y;
        if (res < 0) {
            return false;
        }
        if (res > 0) {
            return true;
        }
        if (a.x * b.x < 0 ||
            a.y * b.y < 0 ||
            Math.sqrt(a.x * a.x + a.y * a.y) < Math.sqrt(b.x * b.x + b.y * b.y)) {
            return false;
        }
        return true;
    }

    contains(point) {
        return this.isVertex(point) ||
            this.classify(point, this.p1, this.p2) &&
            this.classify(point, this.p2, this.p3) &&
            this.classify(point, this.p3, this.p4) &&
            this.classify(point, this.p5, this.p6) &&
            this.classify(point, this.p6, this.p1);
    }

    isFullyInsideRect(rect) {
        return rect.contains(this.p1) &&
            rect.contains(this.p2) &&
            rect.contains(this.p3) &&
            rect.contains(this.p4) &&
            rect.contains(this.p5) &&
            rect.contains(this.p6);
    }

    range() {
        return new Circle(this.x, this.y, this.r * 3);
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(context) {
        if (this.isAlive) {
            context.beginPath();
            context.fillStyle = this.colors[this.collisions];
            context.moveTo(this.p1.x, this.p1.y);

            context.lineTo(this.p2.x, this.p2.y);
            context.lineTo(this.p3.x, this.p3.y);
            context.lineTo(this.p4.x, this.p4.y);
            context.lineTo(this.p5.x, this.p5.y);
            context.lineTo(this.p6.x, this.p6.y);
            context.lineTo(this.p1.x, this.p1.y);

            context.fill();
            context.strokeStyle = "black";
            context.lineWidth = 3;
            context.stroke();
            context.closePath();
        }
    }
}