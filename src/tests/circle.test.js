import * as utils from '../figures/figure-utils';
import Circle from '../figures/circle';

describe('Circle getters', () => {
    it('should calculate borders correctly', () => {
        const c = new Circle(0, 0, 4);
        expect(c.left).toBe(-4);
        expect(c.top).toBe(-4);
        expect(c.right).toBe(4);
        expect(c.bottom).toBe(4);
    })

    it("should calculate isAlive property correctly", () => {
        const c = new Circle(0,0,6);
        expect(c.isAlive).toBeTruthy();
        c.collisions += 1;
        expect(c.isAlive).toBeTruthy();
        c.collisions += 1;
        expect(c.isAlive).toBeTruthy();
        c.collisions += 1;
        expect(c.isAlive).toBeFalsy();
    })

    it("should return correct range", () => {
        const c = new Circle(0,0,6);
        const r = c.range();
        expect(r.x).toBe(c.x);
        expect(r.y).toBe(c.y);
        expect(r.r).toBe(c.r * 3);        
    })
})

describe('Circle.contains()', () => {
    let c;
    beforeEach(() => {
        c = new Circle(0,0,6);
    })

    it('should return true if point is inside', () => {
        expect(c.contains({ x: 1, y: 1 })).toBeTruthy();
    })

    it('should return true if point is on border', () => {
        expect(c.contains({ x: 6, y: 0 })).toBeTruthy();
        expect(c.contains({ x: -6, y: 0 })).toBeTruthy();
        expect(c.contains({ x: 0, y: 6 })).toBeTruthy();
        expect(c.contains({ x: 0, y: -6 })).toBeTruthy();
    })

    it('should return false if point is outside', () => {
        expect(c.contains({ x: 7, y: 1 })).toBeFalsy();
    })
})

describe('Circle.intersects()', () => {
    let c;
    beforeEach(() => {
        c = new Circle(0,0,6);
    })

    it('should return true if circles are intesected', () => {
        const otherC = new Circle(7,1,3);
        expect(c.intersects(otherC)).toBeTruthy();
    })

    it('should return true if one circle contains other', () => {
        const otherC = new Circle(0,0,3);
        expect(c.intersects(otherC)).toBeTruthy();
    })

    it('should return false if circles are not intesected', () => {
        const otherC = new Circle(9,9,3);
        expect(c.intersects(otherC)).toBeFalsy();
    })
})

describe('Circle.simpleCollisionsCheck()', () => {
    let c;
    beforeEach(() => {
        c = new Circle(0,0,6);
    })

    it('should increase collisions if circle intersects other circle', () => {
        const otherC = new Circle(7,1,3);
        utils.checkCollisionsWithFigures(c, [otherC]);
        expect(c.collisions).toBe(1);        
    })

    it('should not increase collisions if circles are not intersected', () => {
        const otherC = new Circle(9,9,3);
        utils.checkCollisionsWithFigures(c, [otherC]);
        expect(c.collisions).toBe(0);        
    })
})

describe('Circle.move()', () => {
    it('should move circle according to its speed', () => {
        const c = new Circle(50,50,4);
        c.vx = 1;
        c.vy = 1;
        c.move();
        expect(c.x).toBe(51);
        expect(c.y).toBe(51);
    })

    it('should check left wall and change speed', () => {
        const c = new Circle(0,50,4);
        c.vx = -1;
        c.vy = 0;
        utils.checkWalls(c, {width: 100, height: 100});
        expect(c.vx).toBe(1);
        expect(c.vy).toBe(0);
    })

    it('should check right wall and change speed', () => {
        const c = new Circle(100,50,4);
        c.vx = 1;
        c.vy = 0;
        utils.checkWalls(c, {width: 100, height: 100});
        expect(c.vx).toBe(-1);
        expect(c.vy).toBe(0);
    })

    it('should check top wall and change speed', () => {
        const c = new Circle(50,0,4);
        c.vx = 0;
        c.vy = -1;
        utils.checkWalls(c, {width: 100, height: 100});
        expect(c.vx).toBe(0);
        expect(c.vy).toBe(1);
    })

    it('should check bottom wall and change speed', () => {
        const c = new Circle(50,100,4);
        c.vx = 0;
        c.vy = 1;
        utils.checkWalls(c, {width: 100, height: 100});
        expect(c.vx).toBe(0);
        expect(c.vy).toBe(-1);
    })

    it('should not do anything if circle is not alive', () => {
        const c = new Circle(0,0,6);
        c.collisions = 3;
        c.vx = 1;
        c.vy = 1;
        utils.checkWalls(c, {width: 100, height: 100});
        expect(c.x).toBe(0);
        expect(c.y).toBe(0);
    })
})

describe('Circle generation', () => {
    it('should generate figure correctly', () => {
        const canvas = { width: 100, height: 100 };
        const settings = {
            minW: canvas.width / 100,
            maxW: canvas.width / 50,
            minH: canvas.height / 100,
            maxH: canvas.height / 50
        };
        const c = utils.generateFigure(canvas, settings, utils.FigTypes.Circle);
        expect(c.x).toBeGreaterThan(0);
        expect(c.x).toBeLessThan(canvas.width);
        
        expect(c.y).toBeGreaterThan(0);
        expect(c.y).toBeLessThan(canvas.height);
        expect(c.type).toBe(utils.FigTypes.Circle);
    })
})