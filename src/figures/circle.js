import * as utils from './figure-utils';

export default class Circle {
    static generate({ width, height }, id) {
        const minR = height / 20;
        const maxR = height / 10;
        const r = minR + Math.random() * (maxR - minR);

        const x = Math.random() * (width - maxR);
        const y = Math.random() * (height - maxR);

        const minV = 2;
        const maxV = 2;
        const vx = minV + Math.random() * (maxV - minV);
        const vy = minV + Math.random() * (maxV - minV);

        const fig = new Circle(x, y, r);
        fig.id = id;
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

    simpleCollisionsCheck(figures) {
        for (const fig of figures) {
            if (fig.isAlive && fig !== this && utils.intersects(this, fig)) {
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

            this.x += this.vx;
            this.y += this.vy;
        }
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