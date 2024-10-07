function drawSpiral(p1, p2, center, arcID, color, thickness, array, selectedArray) {
  let line1 = new Line(p1, center);
  let line2 = new Line(p2, center);
  let r1 = Point.distance(p1, center);
  let r2 = Point.distance(p2, center);
  line1.circlePoint = Point.distance(center, line1.a) == r1 ? line1.a : line1.b;
  line2.circlePoint = Point.distance(center, line2.a) == r2 ? line2.a : line2.b;
  let angle1 = getAngle(line1, line1.circlePoint, center);
  let angle2 = getAngle(line2, line2.circlePoint, center);
  let currPoint = new Point(
    line1.circlePoint.x, 
    line1.circlePoint.y
  );
  let delta = Math.min(
    Math.abs(angle1 - angle2), 
    Math.abs(angle1 + 2 * 180 - angle2), 
    Math.abs(angle1 - 2 * 180 - angle2)
  );
  let angleIncrement = delta / SEGMENTS;
  let lengthIncrement = (r2 - r1) / SEGMENTS;
  let currLength = r1;
  let currAngle = angle1;
  if (angle1 - delta == angle2 || angle1 - delta == angle2 - 360) {
    angleIncrement = -angleIncrement;
  }
  for (let i = 0; i < SEGMENTS; i++) {
    currLength += lengthIncrement;
    currAngle += angleIncrement;
    let aux = Point.generatePoint(center.x, center.y, currLength, 1, currAngle, 0);
    drawDirectLine(currPoint, aux, color, thickness, ctx);
    array.push(new ArcLine(currPoint, aux, arcID, i));
    if (selectedArray != null) {
      selectedArray.push(new ArcLine(currPoint, aux, arcID, i));
    }
    currPoint = aux;
  }
}

function strokeBezier(v1, v2, color, canvas) {
  //dovrebbe essere giusto. se è brutto è colpa del modo con cui vengono creati
  //i vettori dato che punti opposti dovrebbero avere vettori di bzr più grande
  let cp1, cp2, start, end;

  if (v1.circlePoint.equals(v1.a)) {
    start = v1.a;
    cp1 = v1.b;
  }
  else {
    start = v1.b;
    cp1 = v1.a;
  }
  if (v2.circlePoint.equals(v2.a)) {
    end = v2.a;
    cp2 = v2.b;
  }
  else {
    end = v2.b;
    cp2 = v2.a;

  }
  canvas.strokeStyle = color;
  canvas.beginPath();
  canvas.moveTo(start.x, start.y);
  //Draws a cubic Bézier curve from the current pen position to the end point specified by x and y, 
  // using the control nodes specified by (cp1x, cp1y) and (cp2x, cp2y).
  //usage: bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)

  //console.log(cp1,cp2,start,end);
  //if (cp1.x <= 0 || cp1.y <= 0 || cp2.x <= 0 || cp2.y <= 0 || end.x <= 0 || end.y <= 0)
  //console.log("ding dong2");

  canvas.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y)

  canvas.stroke()
}

let debug = false;
let debugSum = false;
let debugGuides = false;

function drawBezierLine(cX, cY, r, n1, n2, size, a0, intensity, color) { //n1 is always bigger than n2
  //potrei pensare di impostarla direttamente qua invece di fare il resize dopo!!!!

  let len = generateLength(n1, n2, size);
  let guide1 = Line.generateBeziereGuide(cX, cY, r, len, n1, 360 / size, a0);
  let guide2 = Line.generateBeziereGuide(cX, cY, r, len, n2, 360 / size, a0);

  // first=>built with n1=>bigger numeration
  let firstBezier = new Line(Point.generatePoint(cX, cY, r, n1, 360 / size, a0), Point.generatePoint(cX, cY, len, n1, 360 / size, a0));
  firstBezier.circlePoint = Point.generatePoint(cX, cY, r, n1, 360 / size, a0);
  firstBezier.fixCoords(cY); //corrects the angle/slope
  //drawCircle(Point.generatePoint(cX, cY, r, n1, 360 / size, a0).x,Point.generatePoint(cX, cY, r, n1, 360 / size, a0).y,5,'blue',0);
  let secondBezier = new Line(Point.generatePoint(cX, cY, r, n2, 360 / size, a0), Point.generatePoint(cX, cY, len, n2, 360 / size, a0));
  secondBezier.circlePoint = Point.generatePoint(cX, cY, r, n2, 360 / size, a0);
  secondBezier.fixCoords(cY);


  let maxDistance = Math.max(n1 - n2, size - n1 + n2); //it is the max distance between the 2 points
  let minDistance = size - maxDistance; //never above size/2
  //console.log(n1,n2,distance);

  let rotation = 90 * maxDistance / size; //this might be good enough
  let factor = 1;

  let newBzrSize = firstBezier.length * factor;

  // if (!isFinite(guide1.slope)) {
  //   console.log(n1);
  //   // drawLine(guide1, 'red', ctx);
  //   console.log(guide1.slope == Infinity ? "+inf " : "-inf ", guide1.circlePoint.equals(guide1.b) ? "b" : "a");
  // }
  // if (!isFinite(guide2.slope)) {
  //   console.log(n2);
  //   // drawLine(guide2,'blue', ctx);
  //   console.log(guide2.slope == Infinity ? "+inf " : "-inf ", guide2.circlePoint.equals(guide2.b) ? "b" : "a");
  // }


  if (true) {
    if (Math.min(n1 - n2, size - n1 + n2) == n1 - n2) {
      firstBezier.rotateOnCirclePoint(-rotation);
      secondBezier.rotateOnCirclePoint(rotation);
      guide1.rotateOnCirclePoint(-rotation)
      guide2.rotateOnCirclePoint(rotation)
    }
    else {
      firstBezier.rotateOnCirclePoint(rotation);
      secondBezier.rotateOnCirclePoint(-rotation);
      guide1.rotateOnCirclePoint(rotation);
      guide2.rotateOnCirclePoint(-rotation);
    }
  } else {
    guide1.rotateOnCirclePoint(-20);
    guide2.rotateOnCirclePoint(-20);
    // guide1.rotateOnCirclePoint(-20);
    // guide2.rotateOnCirclePoint(-20);

    //console.log(""+n1)
    firstBezier.rotateOnCirclePoint(20);
    //console.log(""+n2)
    secondBezier.rotateOnCirclePoint(20);

  }



  strokeBezier(guide1, guide2, color, ctx);

  //return new BezierCurve(bzr1, bzr2);
  //console.log(firstRadialLine.length+" "+secondRadialLine.length);
}


function drawCircleArc(cx, cy, startAngle, width, radius, color, thickness, mode) {
  if (drawCanvas.getContext) {
    let start=toRadians(-startAngle);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.beginPath()
    ctx.arc(cx, cy, radius, start, start - toRadians(width), mode);
    ctx.stroke();
  }
}

function drawCircles(circles, radius, fill, color, thickness) {
  for (let i = 0; i < circles.length; i++) {
    drawCircle(circles[i].x, circles[i].y, radius, fill, color, thickness)
  }
}

function drawCircle(x, y, radius, fill, stroke, thickness) {
  if (drawCanvas.getContext) {

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }
    if (stroke) {
      ctx.lineWidth = thickness
      ctx.strokeStyle = stroke
      ctx.stroke()
    }
  }
}

function drawLine(line, color, thickness, canvas) {
  drawDirectLine(line.a, line.b, color, thickness, canvas);
}

function drawLineBold(line, color, canvas) {
  canvas.lineWidth = 5;
  canvas.strokeStyle = color;
  canvas.beginPath();
  canvas.moveTo(line.a.x, line.a.y);
  canvas.lineTo(line.b.x, line.b.y);
  canvas.stroke();

}

function drawDirectLine(a, b, color, thickness, canvas) {
  canvas.lineWidth = thickness;
  canvas.strokeStyle = color;
  canvas.beginPath();
  canvas.moveTo(a.x, a.y);
  canvas.lineTo(b.x, b.y);
  canvas.stroke();
}

function drawLines(lines, color, canvas) {
  canvas.strokeStyle = color;
  for (let i = 0; i < lines.length; i++) {
    canvas.beginPath();
    canvas.moveTo(lines[i].a.x, lines[i].a.y);
    canvas.lineTo(lines[i].b.x, lines[i].b.y);
    canvas.stroke();

  }
  canvas.strokeStyle = 'black';
}
function drawLinesAlternate(lines, color1, color2, canvas) {
  for (let i = 0; i < lines.length; i++) {
    canvas.strokeStyle = i % 2 == 0 ? color1 : color2;
    canvas.beginPath();
    canvas.moveTo(lines[i].a.x, lines[i].a.y);
    canvas.lineTo(lines[i].b.x, lines[i].b.y);
    canvas.stroke();

  }
  canvas.strokeStyle = 'black';
}

function drawSquare(canvas, x0, y0, x1, y1) {
  canvas.beginPath();
  canvas.moveTo(x0, y0);
  canvas.lineTo(x0, y0 + y1);
  canvas.lineTo(x0 + x1, y0 + y1);
  canvas.lineTo(x0 + x1, y0);
  canvas.lineTo(x0, y0);
  canvas.stroke();
}

function drawPoint(c, a, m) {
  drawCircle(c.x + Math.cos(a) * m, c.y - Math.sin(a) * m, 3, false, 'green', 1)
}
function drawPoint(c, a, m, s) {
  drawCircle(c.x + Math.cos(a) * m, c.y - Math.sin(a) * m, s, false, 'green', 1)
}

function StrokeCircleArc(center, a1, a2, len, long, oldCenter, color, size) {
  let start;
  let end;
  let min = Math.min(a1, a2);
  let max = Math.max(a1, a2);

  //aggiustare
  let troughZero = max - min < 360 + min - max ? false : true;
  let is180 = max - min == 360 + min - max ? true : false;

  if (is180) {
    let side = getSide(Point.generatePoint(center.x, center.y, len, 0, 0, a1), Point.generatePoint(center.x, center.y, len, 0, 0, a2), oldCenter);

    if (side) {
      end = max;
      start = min;

      drawCircleArc(center.x, center.y, start, end - start, len, color, size, false);

    } else {
      end = min;
      start = max;
      drawCircleArc(center.x, center.y, start, end - start, len, color, size, false);

    }

  } else if (long) {
    if (troughZero) {
      end = max;
      start = min;
      drawCircleArc(center.x, center.y, start, end - start, len, color, size, !troughZero);
    } else {
      end = min;
      start = max;
      drawCircleArc(center.x, center.y, start, end - start, len, color, size, troughZero);
    }
  } else {
    if (troughZero) {
      end = max;
      start = min;
      drawCircleArc(center.x, center.y, start, end - start, len, color, size, troughZero);
    } else {
      end = min;
      start = max;
      drawCircleArc(center.x, center.y, start, end - start, len, color, size, !troughZero);
    }

  }

}


function createCircleArc(center, p1, p2, color, size, array, selectedArray) {
  let midpoint = Point.middle(p1, p2);
  let newCenter;
  if (midpoint.equals(center)) {

    let angle1 = getAngleNewOrigin(center, p1);
    let angle2 = getAngleNewOrigin(center, p2);
    let newAngle = angle1 / 2 + angle2 / 2;

    newCenter = Point.generatePoint(center.x, center.y, Point.distance(center, p1), 0, 0, newAngle);
    angle1 = getAngleNewOrigin(newCenter, p1);
    angle2 = getAngleNewOrigin(newCenter, p2);

    StrokeCircleArc(newCenter, angle1, angle2, Point.distance(newCenter, p1), false, null, color, size);
  } else {
    let oldLen = Point.distance(center, midpoint);
    let newLen = Point.distance(center, p1) - oldLen;
    let l = new Line(center, midpoint);
    l.circlePoint = new Point(center.x, center.y);
    l.resizeOnCirclePoint(newLen);

    newCenter = new Point(l.a.equals(l.circlePoint) ? l.b.x : l.a.x, l.a.equals(l.circlePoint) ? l.b.y : l.a.y);

    let angle1 = getAngleNewOrigin(newCenter, p1);
    let angle2 = getAngleNewOrigin(newCenter, p2);
    let radius = Point.distance(newCenter, p1);

    let longerArc = newLen > oldLen ? true : false;

    StrokeCircleArc(newCenter, angle1, angle2, radius, !longerArc, center, color, size);
  }
  array.push(new Circle(newCenter, p1, p2));
  if (selectedArray != null) {
    selectedArray.push(new Circle(newCenter, p1, p2));
  }
}


