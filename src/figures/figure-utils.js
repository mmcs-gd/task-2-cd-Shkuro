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
    var distance = Math.sqrt(dx*dx + dy*dy);
    return (distance < c1.r + c2.r);
    //#region physics
    // const dist = Math.sqrt((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y));
    // const maxR = Math.max(c1.r, c2.r);
    // if ((dist < maxR && dist < c1.r + c2.r)
    //     || (dist < maxR && dist === c1.r + c2.r)
    //     || (dist >= maxR && c1.r + dist === c2.r)
    //     || (dist > maxR && c2.r + dist === c1.r)) {
    //     return true;
    // }
    // return false;
    //#endregion
}

function triangleWithTriangle(t1, t2) {
    // TODO
    return false;
}

function hexagonWithHexagon(h1, h2) {
    // TODO
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
    return (dx*dx + dy*dy) < (c.r * c.r);
}

function rectWithTriangle(r, t) {
    // TODO
    return false;
}

function rectWithHexagon(r, h) {
    // TODO
    return false;
}

function circleWithTriangle(c, t) {
    // TODO
    return false;
}

function circleWithHexagon(c, h) {
    // TODO
    return false;
}

function triangleWithHexagon(t, h) {
    // TODO
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