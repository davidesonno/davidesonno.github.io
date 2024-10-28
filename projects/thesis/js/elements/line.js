class Line {
  constructor(a, b) {
    if (a.x > b.x) { //leftmost point will always be 'a'
      this.a = b;
      this.b = a;
    }
    else {
      this.a = a;
      this.b = b; 
    }
    this.length = Point.distance(this.a, this.b);
    this.circlePoint = null;

    this.facX = approx(this.b.y - this.a.y, precision);
    this.facY = approx(this.a.x - this.b.x, precision);
    this.constantTerm = this.a.x * this.facX + this.a.y * this.facY;
    this.slope = this.facX / (-this.facY);
    // console.log(this.slope);
  }

  static generateBeziereGuide(cX, cY, r, len, num, step, a0) {
    let p1 = Point.generatePoint(cX, cY, r, num, step, a0);
    let p2 = Point.generatePoint(cX, cY, r + len, num, step, a0);

    let cp = Point.generatePoint(cX, cY, r, num, step, a0);
    let line;
    if (p1.x == p2.x) {
      if (p1.y <= cY && p2.y <= cY) {
        line = new Line(p2, p1);
        line.circlePoint = cp;
        line.slope = -Infinity;
        // console.log("prr");
      }
      else if (p1.y >= cY && p2.y >= cY) {
        line = new Line(p1, p2);
        line.circlePoint = cp;
        line.slope = Infinity;
        // console.log("prr");
      }
    } else {
      line = new Line(p1, p2);
      line.circlePoint = cp;
    }
    //console.log(line);
    return line;
  }

  fixCoords(centerHeight) {

    if (!isFinite(this.slope)) { //se verticale
      if (this.a.y <= centerHeight || this.b.y <= centerHeight) {
        this.slope = Infinity;
        let oldA = this.a;
        let oldB = this.b;

        // this.b=this.circlePoint;
        // this.a=oldA.y<oldB.y?oldA:oldB;
      }
      else if (this.a.y >= centerHeight || this.b.y >= centerHeight) {
        this.slope = -Infinity;

        let oldA = this.a;
        let oldB = this.b;

        // this.b=this.circlePoint;
        // this.a=oldA.y>oldB.y?oldA:oldB;
      }
    }

  }

  swapPoints() {
    let aux = this.a;
    this.a = this.b;
    this.b = aux;
  }

  updateTherms(circlePoint) {
    if (this.a.x > this.b.x) {
      let aux = this.a;
      this.a = this.b;
      this.b = aux;
    }

    this.circlePoint = new Point(circlePoint.x, circlePoint.y);
    this.facX = approx(this.b.y - this.a.y, precision);
    this.facY = approx(this.a.x - this.b.x, precision);
    this.constantTerm = this.a.x * this.facX + this.a.y * this.facY;

    this.slope = this.facX / (-this.facY);

    if (this.a.x == this.b.x) {
      if (this.a.y <= h / 2 && this.b.y <= h / 2) {
        this.swapPoints();
        this.circlePoint = circlePoint;
        this.slope = -Infinity;
      }
      else if (this.a.y >= h / 2 && this.b.y >= h / 2) {
        this.circlePoint = circlePoint;
        this.slope = Infinity;
      }
    }

  }

  getY(x) {
    return (this.constantTerm - x * this.facX) / this.facY;
  }

  getX(y) {
    return (this.constantTerm - y * this.facY) / this.facX;
  }

  /**
   *
   * @param {*} newLength
   * @param {*} side if true: anchors the left point, if false otherwise
   */
  resize(newLength, side) {
    let angle = Math.atan(this.slope);
    if (side) {
      this.b.x = this.a.x + newLength * Math.cos(angle);
      if (this.slope >= 0)
        this.b.y = this.a.y + newLength * Math.sin(angle);

      else
        this.b.y = this.a.y - newLength * Math.sin(angle);

    }
    else {
      this.a.x = this.b.x - newLength * Math.cos(angle);
      if (this.slope >= 0)
        this.a.y = this.b.y + newLength * Math.sin(angle);

      else
        this.a.y = this.b.y - newLength * Math.sin(angle);
    }
  }
  resizeFromCirclePoint(newLength) {
    // drawDirectLine(this.a, this.b, 'purple', ctx);
    if (this.circlePoint.equals(this.a)) {
      this.resize(newLength, true);
    }
    else {
      this.resize(newLength, false);
    }
    // this.updateTherms(this.circlePoint);
    // drawDirectLine(this.a, this.b, 'green', ctx);
  }

  resizeOnCirclePoint(length) {
    //this.slope = (this.b.y-this.a.y)/(this.b.x-this.a.x);
    let angle = Math.atan(this.slope);

    if (this.circlePoint.equals(this.a)) {
      this.b.x = this.a.x + length * Math.cos(angle);

      this.b.y = this.a.y + length * Math.sin(angle);
      if (!isFinite(this.slope)) {
        //drawDirectLine(this.a,this.b,'black',ctx);
        this.b.y = this.a.y + length;
      }
    }
    else {
      //console.log("b",this.b,this.circlePoint);
      this.a.x = this.b.x - length * Math.cos(angle);

      this.a.y = this.b.y - length * Math.sin(angle);
      if (!isFinite(this.slope)) {
        //drawDirectLine(this.a,this.b,'black',ctx);
        this.a.y = this.b.y - length; //not checked
      }
    }

    this.length = Point.distance(this.a, this.b);
    //this.updateTherms(this.circlePoint);
    //console.log(this.slope, toDegrees(Math.atan(this.slope)), Math.cos(Math.atan(this.slope)));
    if (this.slope > 0) {
      // drawDirectLine(this.a,this.b,'black',ctx);
    }
  }

  rotateOnCirclePoint(amount) {
    if (amount == 0)
      return;

    let currAngle = Math.atan(this.slope); //radians
    let newAngle = currAngle - toRadians(amount);
    // console.log(this.slope, toDegrees(currAngle), toDegrees(newAngle));
    let l = Point.distance(this.a, this.b);

    if (this.circlePoint.equals(this.a)) {
      this.b = new Point(this.a.x + l * Math.cos(newAngle), this.a.y + l * Math.sin(newAngle));
    }
    else {
      this.a = new Point(this.b.x - l * Math.cos(newAngle), this.b.y - l * Math.sin(newAngle));
    }

    if (this.slope == Infinity) {
      this.b = new Point(this.a.x + l * Math.cos(newAngle), this.a.y + l * Math.sin(newAngle));
    }
    if (this.slope == -Infinity) {
      this.a = new Point(this.b.x + l * Math.cos(newAngle), this.b.y + l * Math.sin(newAngle));
    }

    this.recalcTherms2();

    if (!isFinite(this.slope)) {
      //  console.log(toDegrees(newAngle));
    }

  }

  recalcTherms2() {
    let p1 = this.a;
    let p2 = this.b;

    let cp = this.circlePoint;
    let line = new Line(p1, p2);
    line.circlePoint = cp;

    if (line.a.y <= h / 2 && line.b.y <= h / 2 && line.a.x == line.b.x) {
      line.slope = -Infinity;
      if (line.circlePoint.equals(line.a)) {
        line.swapPoints();
      }
    }
    if (line.a.y >= h / 2 && line.b.y >= h / 2 && line.a.x == line.b.x) {
      line.slope = Infinity;
      if (line.circlePoint.equals(line.b)) {
        line.swapPoints();
      }
    }
    // drawLineBold(this,'black',ctx);
    // if(line.circlePoint.equals(line.a)&&line.slope==-Infinity){
    //   line.slope=Infinity;
    // }
    //console.log(line);
    this.clone2(line);
  }

  recalcTherms() {
    let p1 = this.a;
    let p2 = this.b;

    let cp = this.circlePoint;
    let line;
    if (p1.x == p2.x) {
      if (p1.y <= h / 2 && p2.y <= h / 2) {
        line = new Line(p2, p1);
        line.circlePoint = new Point(cp.x, cp.y);
        line.slope = -Infinity;
        // console.log("settata quiiiii");
      }
      else if (p1.y >= h / 2 && p2.y >= h / 2) {
        // console.log("settata qui");
        line = new Line(p1, p2);
        line.circlePoint = new Point(cp.x, cp.y);
        line.slope = Infinity;
      }
    } else {
      line = new Line(p1, p2);
      line.circlePoint = cp;
    }
    //console.log(line);
    this.clone2(line);
  }

  clone(line) {
    this.a = line.a;
    this.b = line.b;
    this.length = line.length;
    this.circlePoint = line.circlePoint;
    this.facX = line.facX;
    this.facY = line.facY;
    this.constantTerm = line.constantTerm;
    this.slope = line.slope;
  }

  clone2(line) {
    Object.assign(this, { ...line });
  }

  static getResized(line, length, side) {
    let aux = new Line(new Point(line.a.x, line.a.y), new Point(line.b.x, line.b.y));
    aux.resize(length, side);
    //console.log(aux);
    return aux;
  }

  static sum(l1, l2) {
    //console.log(Line.consecutive(l1,l2));
    if (l1.a.equals(l2.a)) {
      let newX = l1.b.x + (l2.b.x - l2.a.x);
      let newY = l1.b.y + (l2.b.y - l2.a.y);
      // console.log(l1, l2, "case1");
      if (debugSum) {
        drawDirectLine(new Point(l1.a.x, l1.a.y), new Point(newX, newY), 'green', ctx);
      }
      let l = new Line(new Point(l1.a.x, l1.a.y), new Point(newX, newY));
      l.circlePoint = l1.a;
      return l;

    }
    if (l1.b.equals(l2.a)) {
      let newX = l1.a.x + (l2.b.x - l2.a.x);
      let newY = l1.a.y + (l2.b.y - l2.a.y);
      // console.log(l1, l2, "case3");
      if (debugSum) {
        drawDirectLine(new Point(l1.b.x, l1.b.y), new Point(newX, newY), 'blue', ctx);
      }
      let l = new Line(new Point(l1.b.x, l1.b.y), new Point(newX, newY));
      l.circlePoint = l1.b;
      return l;

    }
    if (l1.b.equals(l2.b)) {
      let newX = l2.a.x - (l2.b.x - l2.a.x);
      let newY = l2.a.y + (l2.b.y - l2.a.y);
      // console.log(l1, l2, "case2");
      if (debugSum) {
        drawDirectLine(new Point(l1.b.x, l1.b.y), new Point(newX, newY), 'cyan', ctx);
      }
      let l = new Line(new Point(l1.b.x, l1.b.y), new Point(newX, newY));
      l.circlePoint = l1.b;
      return l;

    }
    if (l2.b.equals(l1.a)) {

      let newX = l2.a.x + (l1.b.x - l1.a.x);
      let newY = l2.a.y + (l1.b.y - l1.a.y);
      // console.log(l1, l2, "case4");
      if (debugSum) {
        drawDirectLine(new Point(l2.b.x, l2.b.y), new Point(newX, newY), 'orange', ctx);
      }
      let l = new Line(new Point(l2.b.x, l2.b.y), new Point(newX, newY));
      l.circlePoint = l2.b;
      return l;
    }
    //console.log(l1,l2);
    return null;
  }

  static consecutive(l1, l2) {
    //if two nodes match, then the lines are consecutive
    if (l1.a.equals(l2.a)) {
      return true;
    }
    if (l1.a.equals(l2.b)) {
      return true;
    }
    if (l1.b.equals(l2.b)) {
      return true;
    }
    if (l1.b.equals(l2.a)) {
      return true;
    }

    return false;
  }

  static checkDomain(l1, l2, inters) {
    let l1_x_min = Math.min(l1.a.x, l1.b.x);
    let l1_x_max = Math.max(l1.a.x, l1.b.x);
    let l1_y_min = Math.min(l1.a.y, l1.b.y);
    let l1_y_max = Math.max(l1.a.y, l1.b.y);

    let l2_x_min = Math.min(l2.a.x, l2.b.x);
    let l2_x_max = Math.max(l2.a.x, l2.b.x);
    let l2_y_min = Math.min(l2.a.y, l2.b.y);
    let l2_y_max = Math.max(l2.a.y, l2.b.y);

    if (between(l1_x_min, inters.x, l1_x_max) &&
      between(l1_y_min, inters.y, l1_y_max) &&
      between(l2_x_min, inters.x, l2_x_max) &&
      between(l2_y_min, inters.y, l2_y_max)) {
      return true;
    }
    return false;
  }

  static segmentIntersection(l1, l2) {
    if (Line.consecutive(l1, l2)) {
      return null;
    }
    // |a1 b1||x|=|c1|
    // |a2 b2||y|=|c2|
    let detA = l1.facX * l2.facY - l1.facY * l2.facX;
    if (detA == 0) {
      return null;
    }

    let x = (l1.constantTerm * l2.facY - l1.facY * l2.constantTerm) / detA;
    let y = (l1.facX * l2.constantTerm - l1.constantTerm * l2.facX) / detA;

    if (Line.checkDomain(l1, l2, new Point(x, y))) {
      return new Point(x, y);
    }

    return null;
  }
}

function findIntersections(lines,savedPoints) {
  let num = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      let inters = Line.segmentIntersection(lines[i], lines[j]);
      if (inters != null) {
        if (intersCheckbox.checked) {
          // drawCircle(inters.x, inters.y, size, fillIntersection, color, thickness);
        }
        if(savedPoints!=null){
          savedPoints.push(inters);
        }
        num++;
      }
    }
  }

  return num;
}

