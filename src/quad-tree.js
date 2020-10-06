import Rectangle from './figures/rectangle';
export class Point {
    constructor(x, y, figure) {
        this.x = x;
        this.y = y;
        this.figure = figure;
    }
}

export default class QuadTree {
    // at the beginning boundary is the whole canvas
    // capacity is maximum points which tree can have
    constructor(boundary, capacity = 4) {
        if (!boundary) {
            throw TypeError('boundary is null or undefined')
        }

        if (!(boundary instanceof Rectangle)) {
            throw TypeError('boundary should be a Rectangle')
        }

        this._points = []
        this._boundary = boundary
        this._capacity = capacity
        this._hasChildren = false
        this._children = []
    }

    insert(point) {
        if (!this._boundary.contains(point)) {
            return
        }
        if (this._points.length < this._capacity) {
            this._points.push(point);
            return
        }

        if (!this._hasChildren) {
            this._subdivide();
        }

        this._children.forEach(child => child.insert(point));
    }

    get length() {
        let count = this._points.length
        if (this._hasChildren) {
            for (const child of this._children) {
                count += child.length;
            }
        }
        return count
    }

    // find points in given circle range
    queryRange(range, found = []) {
        const { _boundary: bound, _points: pts, _children: children } = this;
        
        if (!range.intersects(bound)) {
            return found;
        }

        for (const p of pts) {
            if (range.contains(p)) {
                found.push(p);
            }
        }

        if (this._hasChildren) {
            children.forEach(child => child.queryRange(range, found));
        }

        return found
    }

    _subdivide() {
        const { x, y, w, h } = this._boundary;
        const quadCoords = [
            { x, y },
            { x: x + w / 2, y },
            { x, y: y + h / 2 },
            { x: x + w / 2, y: y + h / 2 }
        ];
        this._children = quadCoords.map(({x, y}) => {
            const r = new Rectangle(x, y, w/2, h/2);
            return new QuadTree(r, this._capacity);
        })
        this._hasChildren = true;
    }

    clear() {
        // clear _points and _children arrays
        // see https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
        this._points = []
        this._children = []
        this._hasChildren = false
    }
}
