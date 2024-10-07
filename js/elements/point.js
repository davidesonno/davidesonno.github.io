class Point {
    constructor(x, y) {
        this.x = approx(x, precision);
        this.y = approx(y, precision);
    }

    static generatePoint(cX, cY, r, number, delta, a0) {
        let x = cX + r * Math.cos(toRadians(number * delta + a0));
        let y = cY - r * Math.sin(toRadians(number * delta + a0));
        return new Point(x, y);
    }
 
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return approx(Math.hypot(dx, dy), pixelPrecision);
    }

    equals(p) {
        return this.x == p.x && this.y == p.y;
    }

    static middle(p1,p2){
      return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    }
}