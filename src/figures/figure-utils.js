export const FigTypes = { Rect: 0, Circle: 1, Triangle: 2, Hexagon: 3 };

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
    // Find the closets point to the circle within the rect
    let closestX = clamp(c.x, r.x, r.x + r.w);
    let closestY = clamp(c.y, r.y, r.y + r.h);

    // calc the distance between the circle's center and this closest point
    let dx = c.x - closestX;
    let dy = c.y - closestY;

    // if the distance is less than the circle's radius, an intersection occurs
    return (dx * dx + dy * dy) < (c.r * c.r);
}

function rectWithTriangle(r, t) {
    return false;
}

function rectWithHexagon(r, h) {
    return false;
}

function circleWithTriangle(c, t) {
    for (const p of [t.p1, t.p2, t.p3]) {
        if (c.contains(p)) {
            return true;
        }
    }
    for (const l of [t.edge12, t.edge23, t.edge31]) {
        if (lineIntersectsCircle(l, c)) {
            return true;
        }
    }
    // circle is inside triangle
    if (t.contains({ x: c.x, y: c.y}) && c.r < t.r) {
        return true;
    }
    return false;
}

function circleWithHexagon(c, h) {
    for (const p of [h.p1, h.p2, h.p3, h.p4, h.p5, h.p6]) {
        if (c.contains(p)) {
            return true;
        }
    }
    for (const l of [h.edge12, h.edge23, h.edge34, h.edge45, h.edge56, h.edge61]) {
        if (lineIntersectsCircle(l, c)) {
            return true;
        }
    }
    // circle is inside hexagon
    if (h.contains({ x: c.x, y: c.y}) && c.r < h.r) {
        return true;
    }
    return false;
}

function triangleWithHexagon(t, h) {
    for (const p of [t.p1, t.p2, t.p3]) {
        if (h.contains(p)) {
            return true;
        }
    }
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
                case FigTypes.Triangle: {
                    return rectWithTriangle(fig1, fig2);
                }
                case FigTypes.Hexagon: {
                    return rectWithHexagon(fig1, fig2);
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
                case FigTypes.Rect: {
                    return rectWithTriangle(fig2, fig1);
                }
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
                case FigTypes.Rect: {
                    return rectWithHexagon(fig2, fig1);
                }
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

export function pointInHexagon(pt, h) {
    let x = Math.abs(pt.x - h.x);
    let y = Math.abs(pt.y - h.y);

    let p0 = { x: h.x, y: h.y };
    let p1 = h.p1;
    let p2 = h.p2;
    let p3 = { x: h.p2.x, y: h.y };

    let p_angle_01 = (p0.x - x) * (p1.y - y) - (p1.x - x) * (p0.y - y);
    let p_angle_20 = (p2.x - x) * (p0.y - y) - (p0.x - x) * (p2.y - y);
    let p_angle_03 = (p0.x - x) * (p3.y - y) - (p3.x - x) * (p0.y - y);
    let p_angle_12 = (p1.x - x) * (p2.y - y) - (p2.x - x) * (p1.y - y);
    let p_angle_32 = (p3.x - x) * (p2.y - y) - (p2.x - x) * (p3.y - y);

    let is_inside_1 = (p_angle_01 * p_angle_12 >= 0) && (p_angle_12 * p_angle_20 >= 0);
    let is_inside_2 = (p_angle_03 * p_angle_32 >= 0) && (p_angle_32 * p_angle_20 >= 0);

    return is_inside_1 || is_inside_2;
}

export function lineIntersectsCircle(l, circle) {
    
    const a = l.p2.y - l.p1.y;
    const b = l.p1.x - l.p2.x;
    const c = a * l.p1.x + b * l.p1.y;
    
    const d = Math.abs(a * circle.x + b * circle.y + c) / Math.sqrt(a*a + b*b);
    // console.log("line", l);
    // console.log("d", d);
    if (circle.r >= d) {
        let x = d;
        let y1 = Math.sqrt(circle.r*circle.r -d*d);
        let y2 = -y1;

        const minX = Math.min(l.p1.x, l.p2.x);
        const maxX = Math.min(l.p1.x, l.p2.x);
        const minY = Math.min(l.p1.y, l.p2.y);
        const maxY = Math.min(l.p1.y, l.p2.y);
        

        if (minX <= x && x <= maxX &&
            ((minY <= y1 && y1 <= maxY) || 
            (minY <= y2 && y2 <= maxY))) {
                // console.log("intersects")
                return true;
            }
    }
    return false;
}

export function intersectLines(l1, l2) {
    return linesIntersection(l1.p1, l1.p2, l2.p1, l2.p2);
}

export function linesIntersection(p1, p2, p3, p4) {
    const a1 = p2.y - p1.y;
    const b1 = p1.x - p2.x;
    const c1 = a1 * p1.x + b1 * p1.y;

    const a2 = p4.y - p3.y;
    const b2 = p3.x - p4.x;
    const c2 = a2 * p3.x + b2 * p3.y;

    const det = a1 * b2 - a2 * b1;
    if (det === 0) {
        return null;
    } else {
        let x = (b2 * c1 - b1 * c2) / det;
        let y = (a1 * c2 - a2 * c1) / det;
        return { x, y };
    }
}