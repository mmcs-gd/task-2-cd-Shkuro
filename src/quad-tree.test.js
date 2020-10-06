import Circle from './figures/circle'
import { checkCollisionsWithTree } from './figures/figure-utils'
import Rectangle from './figures/rectangle'
import QuadTree, { Point } from './quad-tree'

describe('QuadTree contructor', () => {
    it('should be empty in the initial state', () => {
        const boundary = new Rectangle(0, 0, 100, 100)
        const tree = new QuadTree(boundary)

        expect(tree.length).toBe(0)
    })

    it('should throw an exception when boundary has not been passed', () => {
        expect(() => {
            const tree = new QuadTree()
        }).toThrow(TypeError)
    })

    it('should throw an exception when boundary is not a Rectangle', () => {
        expect(() => {
            const tree = new QuadTree(42)
        }).toThrow(TypeError)
    })
})

describe("QuadTree (cap = 1)", () => {
    let tree;
    beforeEach(() => {
        const boundary = new Rectangle(0, 0, 100, 100)
        tree = new QuadTree(boundary, 1)

        tree.insert({ x: 60, y: 60 });
        tree.insert({ x: 40, y: 80 });
        tree.insert({ x: 30, y: 20 });
        tree.insert({ x: 70, y: 90 });
        tree.insert({ x: 90, y: 20 });
        tree.insert({ x: 20, y: 60 });
        tree.insert({ x: 10, y: 80 });
        tree.insert({ x: 70, y: 30 });
    })
    it('should insert points correctly', () => {
        expect(tree.length).toBe(8);
        expect(tree._points).toContainEqual({ x: 60, y: 60 });
        expect(tree._hasChildren).toBeTruthy();
        expect(tree._children[0]._points).toContainEqual({ x: 30, y: 20 });
        expect(tree._children[1]._points).toContainEqual({ x: 90, y: 20 });
        expect(tree._children[2]._points).toContainEqual({ x: 40, y: 80 });
        expect(tree._children[3]._points).toContainEqual({ x: 70, y: 90 });

        expect(tree._children[1]._hasChildren).toBeTruthy();
        expect(tree._children[1]._children[2]._points).toContainEqual({ x: 70, y: 30 });

        expect(tree._children[2]._hasChildren).toBeTruthy();
        expect(tree._children[2]._children[0]._points).toContainEqual({ x: 20, y: 60 });
        expect(tree._children[2]._children[2]._points).toContainEqual({ x: 10, y: 80 });
    })

    it('should calculate borders correctly', () => {
        expect(tree._children[0]._boundary).toEqual(new Rectangle(0, 0, 50, 50));
        expect(tree._children[1]._boundary).toEqual(new Rectangle(50, 0, 50, 50));
        expect(tree._children[2]._boundary).toEqual(new Rectangle(0, 50, 50, 50));
        expect(tree._children[3]._boundary).toEqual(new Rectangle(50, 50, 50, 50));

        expect(tree._children[1]._children[0]._boundary).toEqual(new Rectangle(50, 0, 25, 25));
        expect(tree._children[1]._children[1]._boundary).toEqual(new Rectangle(75, 0, 25, 25));
        expect(tree._children[1]._children[2]._boundary).toEqual(new Rectangle(50, 25, 25, 25));
        expect(tree._children[1]._children[3]._boundary).toEqual(new Rectangle(75, 25, 25, 25));

        expect(tree._children[2]._children[0]._boundary).toEqual(new Rectangle(0, 50, 25, 25));
        expect(tree._children[2]._children[1]._boundary).toEqual(new Rectangle(25, 50, 25, 25));
        expect(tree._children[2]._children[2]._boundary).toEqual(new Rectangle(0, 75, 25, 25));
        expect(tree._children[2]._children[3]._boundary).toEqual(new Rectangle(25, 75, 25, 25));
    })
})

describe("QuadTree (cap = 4)", () => {
    let tree;
    beforeEach(() => {
        const boundary = new Rectangle(0, 0, 100, 100)
        tree = new QuadTree(boundary, 4)

        tree.insert({ x: 60, y: 60 }); // 1
        tree.insert({ x: 40, y: 80 }); // 2
        tree.insert({ x: 30, y: 20 }); // 3
        tree.insert({ x: 70, y: 90 }); // 4
        tree.insert({ x: 90, y: 20 }); // 5
        tree.insert({ x: 20, y: 60 }); // 6
        tree.insert({ x: 10, y: 80 }); // 7
        tree.insert({ x: 70, y: 30 }); // 8
        tree.insert({ x: 10, y: 10 }); // 9
        tree.insert({ x: 40, y: 40 }); // 10
        tree.insert({ x: 80, y: 50 }); // 11
        tree.insert({ x: 60, y: 10 }); // 12
        tree.insert({ x: 10, y: 30 }); // 13
        tree.insert({ x: 40, y: 60 }); // 14
        tree.insert({ x: 20, y: 40 }); // 15
        tree.insert({ x: 40, y: 10 }); // 16
        tree.insert({ x: 15, y: 20 }); // 17
        tree.insert({ x: 30, y: 5 });  // 18
        tree.insert({ x: 35, y: 30 }); // 19
        tree.insert({ x: 5, y: 45 });  // 20


    })

    it('should insert points correctly', () => {
        expect(tree.length).toBe(20);
        expect(tree._points).toContainEqual({ x: 60, y: 60 });
        expect(tree._points).toContainEqual({ x: 40, y: 80 });
        expect(tree._points).toContainEqual({ x: 30, y: 20 });
        expect(tree._points).toContainEqual({ x: 70, y: 90 });
        expect(tree._hasChildren).toBeTruthy();

        expect(tree._children[0].length).toBe(9);
        expect(tree._children[0]._points).toContainEqual({ x: 10, y: 10 });
        expect(tree._children[0]._points).toContainEqual({ x: 40, y: 40 });
        expect(tree._children[0]._points).toContainEqual({ x: 10, y: 30 });
        expect(tree._children[0]._points).toContainEqual({ x: 20, y: 40 });

        expect(tree._children[1].length).toBe(3);
        expect(tree._children[1]._points).toContainEqual({ x: 90, y: 20 });
        expect(tree._children[1]._points).toContainEqual({ x: 70, y: 30 });
        expect(tree._children[1]._points).toContainEqual({ x: 60, y: 10 });

        expect(tree._children[2].length).toBe(3);
        expect(tree._children[2]._points).toContainEqual({ x: 20, y: 60 });
        expect(tree._children[2]._points).toContainEqual({ x: 10, y: 80 });
        expect(tree._children[2]._points).toContainEqual({ x: 40, y: 60 });

        expect(tree._children[3].length).toBe(1);
        expect(tree._children[3]._points).toContainEqual({ x: 80, y: 50 });

        expect(tree._children[0]._hasChildren).toBeTruthy();

        expect(tree._children[0]._children[0].length).toBe(1);
        expect(tree._children[0]._children[0]._points).toContainEqual({ x: 15, y: 20 });

        expect(tree._children[0]._children[1].length).toBe(2);
        expect(tree._children[0]._children[1]._points).toContainEqual({ x: 40, y: 10 });
        expect(tree._children[0]._children[1]._points).toContainEqual({ x: 30, y: 5 });

        expect(tree._children[0]._children[2].length).toBe(1);
        expect(tree._children[0]._children[2]._points).toContainEqual({ x: 5, y: 45 });

        expect(tree._children[0]._children[3].length).toBe(1);
        expect(tree._children[0]._children[3]._points).toContainEqual({ x: 35, y: 30 });
    })

    it('should query correctly for Rectangle(0,0,25,25)', () => {
        const found = tree.queryRange(new Rectangle(0,0,25,25));
        expect(found).toContainEqual({ x: 10, y: 10 });
        expect(found).toContainEqual({ x: 15, y: 20 });
    })

    it('should query correctly for Rectangle(5,15,35,20)', () => {
        const found = tree.queryRange(new Rectangle(5,15,35,20));
        expect(found).toContainEqual({ x: 15, y: 20 });
        expect(found).toContainEqual({ x: 30, y: 20 });
        expect(found).toContainEqual({ x: 10, y: 30 });
        expect(found).toContainEqual({ x: 35, y: 30 });
    })
})

describe("Tree with figures", () => {
    let tree;
    let figures;
    beforeEach(() => {
        const c1 = new Circle(20,20,7);
        const c2 = new Circle(80,40,9);
        const c3 = new Circle(90,50,6);
        const c4 = new Circle(70,30,3);
        
        figures = [c1, c2,c3,c4];

        const boundary = new Rectangle(0, 0, 100, 100);
        tree = new QuadTree(boundary, 1);

        tree.insert(new Point(c1.x, c1.y, c1));
        tree.insert(new Point(c2.x, c2.y, c2));
        tree.insert(new Point(c3.x, c3.y, c3));
        tree.insert(new Point(c4.x, c4.y, c4));
    })

    it('should find candidates correctly', () => {
        const range = figures[1].range();
        const found = tree.queryRange(range);
        // including testing figure
        expect(found.length).toBe(3);
    })

    it('should find candidates correctly [2]', () => {
        const range = figures[2].range();
        const found = tree.queryRange(range);
        // including the testing figure
        expect(found.length).toBe(2);
    })

    it('should calculate collisions correctly', () => {
        for (const f of figures) {
            checkCollisionsWithTree(f, tree);
        }
        expect(figures[0].collisions).toBe(0);
        expect(figures[1].collisions).toBe(1);
        expect(figures[2].collisions).toBe(1);
        expect(figures[0].collisions).toBe(0);        
    })
})