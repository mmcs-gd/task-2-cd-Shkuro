import { FigTypes } from '../figures/figure-utils';
import Hexagon from '../figures/hexagon';

describe('Hexagon getters', () => {
    it('should calculate borders correctly', () => {
        const h = new Hexagon(0, 0, 6);
        const smallR = 3 * Math.sqrt(3);
        expect(h.left).toBe(-smallR);
        expect(h.top).toBe(-6);
        expect(h.right).toBe(smallR);
        expect(h.bottom).toBe(6);
    })

    it('should calculate points and edges correctly', () => {
        const h = new Hexagon(0, 0, 6);
        const smallR = 3 * Math.sqrt(3);
        const p1 = { x: 0, y: -6 };
        const p2 = { x: smallR, y: -3 };
        const p3 = { x: smallR, y: 3 };
        const p4 = { x: 0, y: 6 };
        const p5 = { x: -smallR, y: 3 };
        const p6 = { x: -smallR, y: -3 };
        
        expect(h.p1).toEqual(p1);
        expect(h.p2).toEqual(p2);
        expect(h.p3).toEqual(p3);
        expect(h.p4).toEqual(p4);
        expect(h.p5).toEqual(p5);
        expect(h.p6).toEqual(p6);  
        
        expect(h.edge12).toEqual({ p1, p2 });
        expect(h.edge23).toEqual({ p1: p2, p2: p3 });
        expect(h.edge34).toEqual({ p1: p3, p2: p4 });
        expect(h.edge45).toEqual({ p1: p4, p2: p5 });
        expect(h.edge56).toEqual({ p1: p5, p2: p6 });
        expect(h.edge61).toEqual({ p1: p6, p2: p1 });
    })

    it('should calculate hexagon properties correctly',() => {
        const h = new Hexagon(0, 0, 6);
        const smallR = 3 * Math.sqrt(3);
        expect(h.smallR).toEqual(smallR);
        expect(h.side).toEqual(6);
    })

    it('should calculate isAlive property correctly',() => {
        const h = new Hexagon(0, 0, 6);
        expect(h.isAlive).toBeTruthy();
        h.collisions += 1;
        expect(h.isAlive).toBeTruthy();
        h.collisions += 1;
        expect(h.isAlive).toBeTruthy();
        h.collisions += 1;
        expect(h.isAlive).toBeFalsy();
    })    
})

describe('Hexagon.contains()', () => {
    let h;
    beforeEach(() => {
        h = new Hexagon(0,0,6);
    })

    it('should return true if point is inside', () => {
        expect(h.contains({ x: 1, y: 1 })).toBeTruthy();
    })

    it('should return true if point is located on edge', () => {
        expect(h.contains({ x: h.smallR, y: 0 })).toBeTruthy();
    })

    it('should return false if point is outside of hexagon', () => {
        expect(h.contains({ x: 7, y: 7 })).toBeFalsy();
    })
})

describe('Hexagon.intersects()', () => {
    let h;
    beforeEach(() => {
        h = new Hexagon(0,0,4);
    })

    //      ___
    //     /   \
    //   _|_    |
    //  /  \\__/
    // |     |
    //  \___/

    it('should return true if hexagons are intersected (top-right <-> bottom-left, same radius)', () => {
        const otherH = new Hexagon(4,-4,4);
        expect(h.intersects(otherH)).toBeTruthy();
    })

    it('should return true if hexagons are intersected (top-right <-> bottom-left, smaller radius)', () => {
        const otherH = new Hexagon(3,-3,2);
        expect(h.intersects(otherH)).toBeTruthy();
    })

    it('should return true if hexagons are intersected (top-right <-> bottom-left, bigger radius)', () => {
        const otherH = new Hexagon(5,-5,6);
        expect(h.intersects(otherH)).toBeTruthy();
    })

    it('should return true if hexagons are intersected (top-left <-> bottom-right)', () => {
        const otherH = new Hexagon(-5,-5,6);
        expect(h.intersects(otherH)).toBeTruthy();
        //   ___
        //  /   \
        // |    _|_
        //  \__//  \
        //    |     |
        //     \___/
    })

    it('should return true if hexagons are intersected (top <-> bottom)', () => {
        const otherH = new Hexagon(0,-3,1);
        expect(h.intersects(otherH)).toBeTruthy();

        //        ___
        //       /   \
        //      |_____|
        //     / \___/ \
        //    /         \
        //   |           |
        //    \         /
        //     \_______/
    })


    it('should return true if hexagons are intersected (left <-> right)', () => {
        const otherH = new Hexagon(4,0,6);
        expect(h.intersects(otherH)).toBeTruthy();
        
        //    ___ ___
        //   /  /\   \
        //  |  |  |   |
        //   \__\/___/
    })

    it('should return true if hexagon contains other hexagon', () => {
        const otherH = new Hexagon(0,0,6);
        expect(h.intersects(otherH)).toBeTruthy();
    })

    it('should return false if hexagons are not intersected', () => {
        const otherH = new Hexagon(6,6,2);
        expect(h.intersects(otherH)).toBeFalsy();
    })
})

describe('Hexagon.simpleCollisionsCheck()', () => {
    let h;
    beforeEach(() => {
        h = new Hexagon(0,0,4);
    })

    it('should increase collisions if hexagon intersects other hexagon', () => {
        const otherH = new Hexagon(4,0,6);
        h.simpleCollisionsCheck([otherH]);
        expect(h.collisions).toBe(1);        
    })

    it('should not increase collisions if hexagons are not intersected', () => {
        const otherH = new Hexagon(6,6,2);
        h.simpleCollisionsCheck([otherH]);
        expect(h.collisions).toBe(0);        
    })    
})

describe('Hexagon.move()', () => {
    it('should move hexagon according to its speed', () => {
        const h = new Hexagon(50,50,4);
        h.vx = 1;
        h.vy = 1;
        h.move({width: 100, height: 100}, []);
        expect(h.x).toBe(51);
        expect(h.y).toBe(51);
    })

    it('should check left wall and change speed', () => {
        const h = new Hexagon(0,50,4);
        h.vx = -1;
        h.vy = 0;
        h.move({width: 100, height: 100}, []);
        expect(h.vx).toBe(1);
        expect(h.vy).toBe(0);
    })

    it('should check right wall and change speed', () => {
        const h = new Hexagon(100,50,4);
        h.vx = 1;
        h.vy = 0;
        h.move({width: 100, height: 100}, []);
        expect(h.vx).toBe(-1);
        expect(h.vy).toBe(0);
    })

    it('should check top wall and change speed', () => {
        const h = new Hexagon(50,0,4);
        h.vx = 0;
        h.vy = -1;
        h.move({width: 100, height: 100}, []);
        expect(h.vx).toBe(0);
        expect(h.vy).toBe(1);
    })

    it('should check bottom wall and change speed', () => {
        const h = new Hexagon(50,100,4);
        h.vx = 0;
        h.vy = 1;
        h.move({width: 100, height: 100}, []);
        expect(h.vx).toBe(0);
        expect(h.vy).toBe(-1);
    })

    it('should not do anything if triangle is not alive', () => {
        const h = new Hexagon(0,0,6);
        h.collisions = 3;
        h.vx = 1;
        h.vy = 1;
        h.move({width: 100, height: 100}, []);
        expect(h.x).toBe(0);
        expect(h.y).toBe(0);
    })
})

describe('Hexagon generation', () => {
    it('should generate figure correctly', () => {
        const canvas = { width: 100, height: 100 };
        const h = Hexagon.generate(canvas);
        expect(h.x).toBeGreaterThan(0);
        expect(h.x).toBeLessThan(canvas.width);
        
        expect(h.y).toBeGreaterThan(0);
        expect(h.y).toBeLessThan(canvas.height);
        expect(h.type).toBe(FigTypes.Hexagon);
    })
})