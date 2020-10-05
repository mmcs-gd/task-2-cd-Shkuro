import * as utils from './figure-utils';
import Rectangle from './rectangle';

export default class Circle {
    static generate({ width, height }, { minW, maxW, minH, maxH }, speed = 1) {
        const minR = Math.min(minW, minH);
        const maxR = Math.min(maxW, maxH);
        const r = minR + Math.random() * (maxR - minR);

        const x = Math.random() * (width - maxR);
        const y = Math.random() * (height - maxR);

        const vx = Math.random() > 0.5 ? speed : -speed;
        const vy = Math.random() > 0.5 ? speed : -speed;

        const fig = new Circle(x, y, r);
        fig.vx = vx;
        fig.vy = vy;

        return fig;
    }

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

    isFullyInsideRect(rect) {
        return rect.contains({ x: this.x, y: this.top }) &&
            rect.contains({ x: this.x, y: this.bottom }) &&
            rect.contains({ x: this.left, y: this.y }) &&
            rect.contains({ x: this.right, y: this.y });
    }

    simpleCollisionsCheck(figures) {
        for (const fig of figures) {
            if (fig.isAlive && fig !== this && utils.intersects(this, fig)) {
                this.collisions += 1;

                this.vx *= -1;
                this.vy *= -1;
            }
        }
    }

    quadTreeCheck(tree) {
        const bounds = new Rectangle(
            this.left,
            this.top,
            this.right - this.left,
            this.bottom - this.top);
        const candidates = tree.queryRange(bounds);
        for (const other of candidates) {
            if (this !== other && this.intersects(other)) {
                this.collisions += 1;
                this.vx *= -1;
                this.vy *= -1;
            }
        }
    }

    range() {
        return new Circle(this.x, this.y, this.r * 3);
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

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