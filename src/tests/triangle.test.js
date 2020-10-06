import * as utils from '../figures/figure-utils';
import Triangle from '../figures/triangle';

describe('Triangle getters', () => {
    it('should calculate borders correctly', () => {
        const t = new Triangle(0, 0, 6);
        expect(t.left).toBe(-6);
        expect(t.top).toBe(-6);
        expect(t.right).toBe(6);
        expect(t.bottom).toBe(3);
    })

    it('should calculate points correctly', () => {
        const t = new Triangle(0, 0, 6);
        const p1 = { x: -6, y: 3 };
        const p2 = { x: 0, y: -6 };
        const p3 = { x: 6, y: 3 };
        expect(t.p1).toEqual(p1);
        expect(t.p2).toEqual(p2);
        expect(t.p3).toEqual(p3);

        expect(t.edge12).toEqual({p1, p2});
        expect(t.edge23).toEqual({p1: p2, p2: p3});
        expect(t.edge31).toEqual({p1: p3, p2: p1});
    })

    it("should calculate triangle properties correctly", () => {
        const t = new Triangle(0,0,6);
        expect(t.side).toBe(18 / Math.sqrt(3));
        expect(t.smallR).toBe(3);
        expect(t.height).toBe(9);
    })

    it("should calculate isAlive property correctly", () => {
        const t = new Triangle(0,0,6);
        expect(t.isAlive).toBeTruthy();
        t.collisions += 1;
        expect(t.isAlive).toBeTruthy();
        t.collisions += 1;
        expect(t.isAlive).toBeTruthy();
        t.collisions += 1;
        expect(t.isAlive).toBeFalsy();
    })

    it("should return correct range", () => {
        const t = new Triangle(0,0,6);
        const r = t.range();
        expect(r.x).toBe(t.x);
        expect(r.y).toBe(t.y);
        expect(r.r).toBe(t.r * 3);        
    })
})

describe("Triangle.contains()", () => {
    let t;
    beforeEach(() => {
        t = new Triangle(0,0,6);
    })

    it('should return true if point is inside', () => {
        expect(t.contains({ x: 1, y: 1 })).toBeTruthy();        
    })

    it('should return true if point is located on edge', () => {
        // left
        expect(t.contains({ x: -1.5, y: 3 * Math.sqrt(3) / 2 })).toBeTruthy();
        // right
        expect(t.contains({ x: 1.5, y: 3 * Math.sqrt(3) / 2 })).toBeTruthy();
        // bottom
        expect(t.contains({ x: 0, y: 3 })).toBeTruthy();

        //       /\
        //      /  \
        //     ○    ○
        //    /      \
        //   /____○___\        
    })

    it('should return false if point is out of triangle',() => {
        expect(t.contains({ x: 5, y: 1 })).toBeFalsy();
    })
})

describe("Triangle.intersects()", () => {
    let t;
    beforeEach(() => {
        t = new Triangle(0,0,6);
    })

    it('should return true if triangles are intersected (to the right)', () => {
        const otherT = new Triangle(4.5, -0.5, 4);
        expect(t.intersects(otherT)).toBeTruthy();

        //        /\
        //     /\/  \
        //    / /\___\
        //   /    \
        //  /______\    
    })

    it('should return true if triangles are intersected (to the left)', () => {
        const otherT = new Triangle(-4.5, -0.5, 4);
        expect(t.intersects(otherT)).toBeTruthy();

        //   /\   
        //  /  \/\
        // /__ /\ \
        //    /    \
        //   /______\    
    })

    it('should return true if triangles are intersected (to the bottom)', () => {
        const otherT = new Triangle(0, 7, 4);
        expect(t.intersects(otherT)).toBeTruthy();
      
        //     /\
        //    /  \
        //   /    \
        //  /___○__\
        //     /\
        //    /  \ 
        //   /____\
    })

    it('should return true if one triangle contains other', () => {
        const otherT = new Triangle(0, 0, 1);
        expect(t.intersects(otherT)).toBeTruthy();

        //      /\
        //     /  \
        //    / /\ \
        //   / /__\ \
        //  /________\    
    })

    it('should return true if one triangle contains other [2]', () => {
        const otherT = new Triangle(0, 0, 10);
        expect(t.intersects(otherT)).toBeTruthy();

        //      /\
        //     /  \
        //    / /\ \
        //   / /__\ \
        //  /________\    
    })

    it('should return false if triangles are not intersected', () => {
        const otherT = new Triangle(7, 7, 3);
        expect(t.intersects(otherT)).toBeFalsy();
    })
})

describe('Triangle.simpleCollisionsCheck()', () => {
    let t;
    beforeEach(() => {
        t = new Triangle(0,0,6);
    })

    it('should increase collisions if triangle intersects other triangle', () => {
        const otherT = new Triangle(4.5, -0.5, 4);
        
        utils.checkCollisionsWithFigures(t, [otherT]);
        expect(t.collisions).toBe(1);        
    })

    it('should not increase collisions if triangle are not intersected', () => {
        const otherT = new Triangle(7, 7, 3);
        utils.checkCollisionsWithFigures(t, [otherT]);
        expect(t.collisions).toBe(0);
    })  
})

describe('Triangle.move()', () => {
    it('should move triangle according to its speed', () => {
        const t = new Triangle(50,50,4);
        t.vx = 1;
        t.vy = 1;
        t.move();
        expect(t.x).toBe(51);
        expect(t.y).toBe(51);
    })

    it('should check left wall and change speed', () => {
        const t = new Triangle(0,50,4);
        t.vx = -1;
        t.vy = 0;
        utils.checkWalls(t, {width: 100, height: 100});
        expect(t.vx).toBe(1);
        expect(t.vy).toBe(0);
    })

    it('should check right wall and change speed', () => {
        const t = new Triangle(100,50,4);
        t.vx = 1;
        t.vy = 0;
        utils.checkWalls(t, {width: 100, height: 100});
        expect(t.vx).toBe(-1);
        expect(t.vy).toBe(0);
    })

    it('should check top wall and change speed', () => {
        const t = new Triangle(50,0,4);
        t.vx = 0;
        t.vy = -1;
        utils.checkWalls(t, {width: 100, height: 100});
        expect(t.vx).toBe(0);
        expect(t.vy).toBe(1);
    })

    it('should check bottom wall and change speed', () => {
        const t = new Triangle(50,100,4);
        t.vx = 0;
        t.vy = 1;
        utils.checkWalls(t, {width: 100, height: 100});
        expect(t.vx).toBe(0);
        expect(t.vy).toBe(-1);
    })

    it('should not do anything if triangle is not alive', () => {
        const t = new Triangle(0,0,6);
        t.collisions = 3;
        t.vx = 1;
        t.vy = 1;
        utils.checkWalls(t, {width: 100, height: 100});
        expect(t.x).toBe(0);
        expect(t.y).toBe(0);
    })
})

describe('Triangle generation', () => {
    it('should generate figure correctly', () => {
        const canvas = { width: 100, height: 100 };
        const settings = {
            minW: canvas.width / 100,
            maxW: canvas.width / 50,
            minH: canvas.height / 100,
            maxH: canvas.height / 50
        };
        const t = utils.generateFigure(canvas, settings, utils.FigTypes.Triangle);
        expect(t.x).toBeGreaterThan(0);
        expect(t.x).toBeLessThan(canvas.width);
        
        expect(t.y).toBeGreaterThan(0);
        expect(t.y).toBeLessThan(canvas.height);
        expect(t.type).toBe(utils.FigTypes.Triangle);
    })
})

