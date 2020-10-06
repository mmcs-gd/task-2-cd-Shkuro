import Hexagon from "./hexagon";
import Triangle from "./triangle";
import Circle from './circle';

export const FigTypes = { Rect: 0, Circle: 1, Triangle: 2, Hexagon: 3 };

export function generateFigure({ width, height }, { minW, maxW, minH, maxH }, figType, speed = 1) {
    const minR = Math.min(minW, minH);
    const maxR = Math.min(maxW, maxH);
    const r = minR + Math.random() * (maxR - minR);

    const x = Math.random() * (width - maxR);
    const y = Math.random() * (height - maxR);

    const vx = Math.random() > 0.5 ? speed : -speed;
    const vy = Math.random() > 0.5 ? speed : -speed;

    let fig;
    switch (figType) {
        case FigTypes.Circle: {
            fig = new Circle(x, y, r);
            break;
        }
        case FigTypes.Triangle: {
            fig = new Triangle(x, y, r);
            break;
        }
        case FigTypes.Hexagon: {
            fig = new Hexagon(x, y, r);
            break;
        }
    }

    fig.vx = vx;
    fig.vy = vy;

    return fig;
}

export function checkWalls(fig, { width, height }) {
    checkLeftWall(fig);
    checkTopWall(fig);
    checkRightWall(fig, width);
    checkBottomWall(fig, height);
}

export function checkLeftWall(fig) {
    if (fig.left <= 0) {
        fig.vx *= -1;
    }
}

export function checkTopWall(fig) {
    if (fig.top <= 0) {
        fig.vy *= -1;
    }
}

export function checkRightWall(fig, width) {
    if (fig.right >= width) {
        fig.vx *= -1;
    }
}

export function checkBottomWall(fig, height) {
    if (fig.bottom >= height) {
        fig.vy *= -1;
    }
}

export function checkCollisionsWithTree(fig, tree) {
    const range = fig.range();
    const candidates = tree.queryRange(range);
    for (const p of candidates) {
        const other = p.figure;
        if (other !== fig && fig.intersects(other)) {
            fig.collisions += 1;
            fig.vx *= -1;
            fig.vy *= -1;
        }
    }
}

export function checkCollisionsWithFigures(fig, figures) {
    for (const other of figures) {
        if (other.isAlive && other !== fig && intersects(fig, other)) {
            fig.collisions += 1;
            fig.vx *= -1;
            fig.vy *= -1;
        }
    }
}

function rectWithRect(r1, r2) {
    return (r1.x < r2.x + r2.w
        && r1.x + r1.w > r2.x
        && r1.y < r2.y + r2.h
        && r1.y + r1.h > r2.y);
}

function circleWithCircle(c1, c2) {
    var dx = c1.x - c2.x;
    var dy = c1.y - c2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return (distance < c1.r + c2.r);
}

function triangleWithTriangle(t1, t2) {
    for (const p of [t2.p1, t2.p2, t2.p3]) {
        if (t1.contains(p)) {
            return true;
        }
    }
    for (const p of [t1.p1, t1.p2, t1.p3]) {
        if (t2.contains(p)) {
            return true;
        }
    }
    return false;
}

function hexagonWithHexagon(h1, h2) {
    for (const p of [h2.p1, h2.p2, h2.p3, h2.p4, h2.p5, h2.p6]) {
        if (h1.contains(p)) {
            return true;
        }
    }

    for (const p of [h1.p1, h1.p2, h1.p3, h1.p4, h1.p5, h1.p6]) {
        if (h2.contains(p)) {
            return true;
        }
    }
    return false;
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// https://gist.github.com/vonWolfehaus/5023015
// на всякий случай еще вариант http://www.jeffreythompson.org/collision-detection/circle-rect.php

function rectWithCircle(r, c) {
    // circle contains rect
    const rectPts = [
        { x: r.x, y: r.y },
        { x: r.x, y: r.y + r.h },
        { x: r.x + r.w, y: r.y + r.h },
        { x: r.x + r.w, y: r.y }
    ];
    if (c.contains(rectPts[0]) &&
        c.contains(rectPts[1]) &&
        c.contains(rectPts[2]) &&
        c.contains(rectPts[3])
    ) {
        return true;
    }

    // rect contains circle
    const circlePts = [
        { x: c.left, y: c.y },
        { x: c.x, y: c.top },
        { x: c.right, y: c.y },
        { x: c.x, y: c.bottom }
    ];
    if (r.contains(circlePts[0]) &&
        r.contains(circlePts[1]) &&
        r.contains(circlePts[2]) &&
        r.contains(circlePts[3])
    ) {
        return true;
    }

    // Find the closets point to the circle within the rect
    let closestX = clamp(c.x, r.x, r.x + r.w);
    let closestY = clamp(c.y, r.y, r.y + r.h);

    // calc the distance between the circle's center and this closest point
    let dx = c.x - closestX;
    let dy = c.y - closestY;

    return ((dx * dx + dy * dy) < (c.r * c.r));
}

function circleWithTriangle(c, t) {
    // circle contains triangle's point
    for (const p of [t.p1, t.p2, t.p3]) {
        if (c.contains(p)) {
            return true;
        }
    }

    // triangle contains circle's point
    const circlePts = [
        { x: c.left, y: c.y },
        { x: c.x, y: c.top },
        { x: c.right, y: c.y },
        { x: c.x, y: c.bottom }
    ];
    for (const p of circlePts) {
        if (t.contains(p)) {
            return true;
        }
    }

    // circle is inside triangle
    if (t.contains({ x: c.x, y: c.y }) && c.r < t.r) {
        return true;
    }
    return false;
}

function circleWithHexagon(c, h) {
    // circle contains hexagons's point
    for (const p of [h.p1, h.p2, h.p3, h.p4, h.p5, h.p6]) {
        if (c.contains(p)) {
            return true;
        }
    }

    // triangle contains circle's point
    const circlePts = [
        { x: c.left, y: c.y },
        { x: c.x, y: c.top },
        { x: c.right, y: c.y },
        { x: c.x, y: c.bottom }
    ];
    for (const p of circlePts) {
        if (h.contains(p)) {
            return true;
        }
    }

    // circle is inside hexagon
    if (h.contains({ x: c.x, y: c.y }) && c.r < h.r) {
        return true;
    }
    return false;
}

function triangleWithHexagon(t, h) {
    // hexagon contains triangle's point
    for (const p of [t.p1, t.p2, t.p3]) {
        if (h.contains(p)) {
            return true;
        }
    }

    // triangle contains hexagon's point
    for (const p of [h.p1, h.p2, h.p3, h.p4, h.p5, h.p6]) {
        if (t.contains(p)) {
            return true;
        }
    }

    return false;
}

export function intersects(fig1, fig2) {
    switch (fig1.type) {
        case FigTypes.Rect: {
            switch (fig2.type) {
                case FigTypes.Rect: {
                    return rectWithRect(fig1, fig2);
                }
                case FigTypes.Circle: {
                    return rectWithCircle(fig1, fig2);
                }
            }
        }
        case FigTypes.Circle: {
            switch (fig2.type) {
                case FigTypes.Rect: {
                    return rectWithCircle(fig2, fig1);
                }
                case FigTypes.Circle: {
                    return circleWithCircle(fig1, fig2);
                }
                case FigTypes.Triangle: {
                    return circleWithTriangle(fig1, fig2);
                }
                case FigTypes.Hexagon: {
                    return circleWithHexagon(fig1, fig2);
                }
            }
        }
        case FigTypes.Triangle: {
            switch (fig2.type) {
                case FigTypes.Circle: {
                    return circleWithTriangle(fig2, fig1);
                }
                case FigTypes.Triangle: {
                    return triangleWithTriangle(fig1, fig2);
                }
                case FigTypes.Hexagon: {
                    return triangleWithHexagon(fig1, fig2);
                }
            }
        }
        case FigTypes.Hexagon: {
            switch (fig2.type) {
                case FigTypes.Circle: {
                    return circleWithHexagon(fig2, fig1);
                }
                case FigTypes.Triangle: {
                    return triangleWithHexagon(fig2, fig1);
                }
                case FigTypes.Hexagon: {
                    return hexagonWithHexagon(fig1, fig2);
                }
            }
        }
    }
}

export function sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

export function pointInTriangle(pt, v1, v2, v3) {
    const d1 = sign(pt, v1, v2);
    const d2 = sign(pt, v2, v3);
    const d3 = sign(pt, v3, v1);
    const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(has_neg && has_pos);
}

export function pointsAreEqual(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}