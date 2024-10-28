class Circle {
  constructor(center, p1, p2) {
    this.center = center;
    this.p1 = new Point(p1.x, p1.y);
    this.p2 = new Point(p2.x, p2.y);
    this.radius = Point.distance(center, p1);
  }

  static circleIntersection2(c1, c2, domainRadius, domainCenter) {
    let tollerance = 1.01;
    if (mode == 0) {
      if (graphSize > 14 & graphSize % 2 == 1) {
        tollerance = 1.005;
      }
      if (graphSize >= 20) {
        tollerance = 1.001;
      }
    } else {
      if (graphSize >= 13) {
        tollerance = 1.005;
      }
      if (graphSize >= 14) {
        tollerance = 1.01;
      }
    }

    let a, dx, dy, d, h, rx, ry;
    let x2, y2;

    dx = c1.center.x - c2.center.x;
    dy = c1.center.y - c2.center.y;

    d = Point.distance(c1.center, c2.center);

    if (d > (c2.radius + c1.radius)) {
      return null;
    }
    if (d < Math.abs(c2.radius - c1.radius)) {
      return null;
    }

    a = ((c2.radius * c2.radius) - (c1.radius * c1.radius) + (d * d)) / (2.0 * d);

    x2 = c2.center.x + (dx * a / d);
    y2 = c2.center.y + (dy * a / d);

    h = Math.sqrt((c2.radius * c2.radius) - (a * a));

    rx = -dy * (h / d);
    ry = dx * (h / d);

    tollerance = 1.0; //trovaremetodo per rendere sempre funzionante sto cancro
    //forse vedere se i cerchi partono insieme

    let sol1 = new Point(approx((x2 + rx), precision), approx((y2 + ry), precision));
    let dis = 5;
    // drawCircle(c1.p1.x,c1.p1.y,dis,false,'red',1);
    // drawCircle(c2.p1.x,c2.p1.y,dis,false,'red',1);
    // drawCircle(c1.p2.x,c1.p2.y,dis,false,'red',1);
    // drawCircle(c2.p2.x,c2.p2.y,dis,false,'red',1);
    if (Point.distance(c1.p1, c2.p1) < dis || Point.distance(c1.p2, c2.p1) < dis || Point.distance(c1.p1, c2.p2) < dis || Point.distance(c1.p2, c2.p2) < dis) {
      return null;
    }

    // console.log(c1,c2);
    if (Point.distance(sol1, domainCenter) > domainRadius * tollerance) {
      // console.log(sol1);
      return sol1;
    }

    let sol2 = new Point(approx((x2 - rx), precision), approx((y2 - ry), precision));

    if (Point.distance(sol2, domainCenter) > domainRadius * tollerance) {
      // console.log(sol2);
      return sol2;
    }

    return null;
  }

  static startTogether(circle1,circle2){
    let tollerance=5;
    return Point.distance(circle1.p1,circle2.p1)<tollerance||
        Point.distance(circle1.p1,circle2.p2)<tollerance||
        Point.distance(circle1.p2,circle2.p1)<tollerance||
        Point.distance(circle1.p2,circle2.p2)<tollerance;
  }

  static circleIntersection(circle1, circle2, domainRadius, domainCenter) {
    const x1 = circle1.center.x;
    const y1 = circle1.center.y;
    const r1 = circle1.radius;
    const x2 = circle2.center.x;
    const y2 = circle2.center.y;
    const r2 = circle2.radius;
    const d = Math.hypot(x2 - x1,y2 - y1);
    if (d > r1 + r2) {
      return null;
    }
    if (d < Math.abs(r1 - r2)) {
      return null;
    }
    if(Circle.startTogether(circle1,circle2)){
      return null;
    }
    const a = (Math.pow(r1, 2) - Math.pow(r2, 2) + Math.pow(d, 2)) / (2 * d);
    const h = Math.sqrt(Math.pow(r1, 2) - Math.pow(a, 2));

    const x3 = x1 + (a * (x2 - x1)) / d;
    const y3 = y1 + (a * (y2 - y1)) / d;

    let s1 = new Point(x3 + (h * (y2 - y1)) / d, y3 - (h * (x2 - x1)) / d)
    let s2 = new Point(x3 - (h * (y2 - y1)) / d, y3 + (h * (x2 - x1)) / d)
    if (Point.distance(s1,domainCenter)>domainRadius){
      return s1;
    }
    if (Point.distance(s2,domainCenter)>domainRadius){
      return s2;
    }
    
    return null;
  }
}


//intersections

function findCircleIntersections(circles, domainRadius, domainCenter, savedPoints) {
  let num = 0;
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      let inters = Circle.circleIntersection(circles[i], circles[j], domainRadius, domainCenter);
      if (inters != null) {
        // console.log(intersCheckbox.checked);
        if (intersCheckbox.checked) {
          // drawCircle(inters.x, inters.y, intersSize, fillIntersection, intersColor, thickness);
        }
        if (savedPoints != null) {
          savedPoints.push(inters);
        }
        num++;
      }
    }
  }

  return num;
}
