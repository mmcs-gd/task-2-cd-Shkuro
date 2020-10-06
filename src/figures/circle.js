import * as utils from './figure-utils';
import Rectangle from './rectangle';

export default class Circle {
    constructor(x, y, radius, colors = ["green", "yellow", "red"]) {
        this.x = x;
        this.y = y;
        this.r = radius;

        this.colors = colors;
        this.collisions = 0;
        this.type = utils.FigTypes.Circle;
    }

    get isAlive() {
        return this.collisions < 3;
    }

    get left() {
        return this.x - this.r
    }

    get right() {
        return this.x + this.r
    }

    get top() {
        return this.y - this.r
    }

    get bottom() {
        return this.y + this.r
    }

    intersects(fig) {
        return utils.intersects(this, fig);
    }

    contains(point) {
        return ((this.x - point.x) * (this.x - point.x) + (this.y - point.y) * (this.y - point.y)) <= this.r * this.r;
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
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        context.fillStyle = this.colors[this.collisions];
        context.fill();
        context.strokeStyle = "black";
        context.lineWidth = 3;
        context.stroke();
        context.closePath();
    }
}