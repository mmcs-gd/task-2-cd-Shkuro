import Triangle from '../figures/triangle';
import Circle from '../figures/circle';
import Hexagon from '../figures/hexagon';

describe("Circle VS Triangle", () => {
    it("circle inside triangle", () => {
        const t = new Triangle(0, 0, 6);
        const c = new Circle(0, 0, 4);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("triangle inside circle", () => {
        const t = new Triangle(0, 0, 6);
        const c = new Circle(-1, -1, 8);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle contains 2 points of triangle", () => {
        const t = new Triangle(0, 0, 6);
        const c = new Circle(4, 2, 7);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle contains 1 point of triangle", () => {
        const t = new Triangle(0, 0, 6);
        const c = new Circle(4, 5, 5);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle intersects right edge of triangle", () => {
        const t = new Triangle(0, 0, 6);
        const c = new Circle(5, 2, 3);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle intersects bottom edge of triangle", () => {
        const t = new Triangle(0, 0, 6);
        const c = new Circle(1, -5, 3);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle intersects left edge of triangle", () => {
        const t = new Triangle(0, 0, 6);
        const c = new Circle(-5, 3, 3);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("no intersection", () => {
        const t = new Triangle(100, 100, 60);
        const c = new Circle(44, 47, 30);
        expect(c.intersects(t)).toBeFalsy();
        expect(t.intersects(c)).toBeFalsy();
    })
})

describe("Circle VS Hexagon", () => {
    it("hexagon inside circle", () => {
        const t = new Hexagon(0, 0, 6);
        const c = new Circle(0, 0, 7);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle inside hexagon", () => {
        const t = new Hexagon(0, 0, 6);
        const c = new Circle(-1, 1, 3);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle contains 1 point of hexagon", () => {
        const t = new Hexagon(0, 0, 6);
        const c = new Circle(-4, 1, 3);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle contains 2 points of hexagon", () => {
        const t = new Hexagon(0, 0, 6);
        const c = new Circle(-4, 1, 5);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle contains 3 points of hexagon", () => {
        const t = new Hexagon(0, 0, 6);
        const c = new Circle(-4, 2, 6);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle contains 4 points of hexagon", () => {
        const t = new Hexagon(0, 0, 6);
        const c = new Circle(-2, 0, 7);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle contains 5 points of hexagon", () => {
        const t = new Hexagon(0, 0, 6);
        const c = new Circle(-2, 1, 8);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("circle intersects edge of hexagon", () => {
        const t = new Hexagon(0, 0, 6);
        const c = new Circle(-5, 0, 2);
        expect(c.intersects(t)).toBeTruthy();
        expect(t.intersects(c)).toBeTruthy();
    })

    it("no intersection", () => {
        const t = new Hexagon(100, 100, 60);
        const c = new Circle(197, 99, 30);
        expect(c.intersects(t)).toBeFalsy();
        expect(t.intersects(c)).toBeFalsy();
    })
})

describe('Triangle vs Hexagon', () => {
    it('triangle inside hexagon', () => {
        const h = new Hexagon(0, 0, 6);
        const t = new Triangle(0, 0, 4);
        expect(h.intersects(t)).toBeTruthy();
        expect(t.intersects(h)).toBeTruthy();
    })

    it('hexagon contains triangle', () => {
        const h = new Hexagon(0, 0, 6);
        const t = new Triangle(0, 0, 30);
        expect(h.intersects(t)).toBeTruthy();
        expect(t.intersects(h)).toBeTruthy();
    })

    it('triangle contains 1 point of hexagon', () => {
        const h = new Hexagon(0, 0, 6);
        const t = new Triangle(0, 8, 3);
        expect(h.intersects(t)).toBeTruthy();
        expect(t.intersects(h)).toBeTruthy();
    })

    it('hexagon contains 1 point of triangle', () => {
        const h = new Hexagon(0, 0, 6);
        const t = new Triangle(-3, -6, 3);
        expect(h.intersects(t)).toBeTruthy();
        expect(t.intersects(h)).toBeTruthy();
    })

    it('no intersection', () => {
        const h = new Hexagon(0, 0, 6);
        const t = new Triangle(10, 2, 3);
        expect(h.intersects(t)).toBeFalsy();
        expect(t.intersects(h)).toBeFalsy();
    })
})