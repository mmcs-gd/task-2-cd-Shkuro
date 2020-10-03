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

    it('should calculate points correctly', () => {
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
        h = new Hexagon(0,0,6);
    })

    it('should return true if hexagons are intersected (top-right)', () => {

        //     ___
        //    /   \
        //   |__   |
        //  / \_\_/
        // |     |
        //  \___/

        //      ___
        //     /   \
        //   _|_    |
        //  /  \\__/
        // |     |
        //  \___/
    })
})