function matrixToString(mat) {
    let string = " \\  ";
    for (let i = 0; i < mat[mat.length - 1].length; i++) {
      string += i + " ";
    }
    string += "\n  \\";
    for (let i = 0; i < mat[mat.length - 1].length; i++) {
      string += "--";
    }
    string += "\n";
  
    for (let i = 0; i < mat.length; i++) {
      let aux = i + " | ";
      for (let j = 0; j < mat[i].length; j++)
        aux += mat[i][j] + " ";
      string += aux + "\n";
    }
    return string;
  }
  
  function get360Angle(line, increment) {
    //using the slope, the circlePoint and the new angle
    //calculates the angle in the range 0-360 and returns it in radians i think
    //simply because you pass it directly to sin and cos
  
    let angle = Math.atan(line.slope);
    //console.log(toDegrees(angle));
    if (line.circlePoint.equals(line.b)) {
      //angle+= Math.PI;
    }
  
    angle -= toRadians(increment);
    //console.log(toDegrees(angle));
  
    while (angle > 2 * Math.PI) {
      angle -= 2 * Math.PI;
    }
  
    return angle;
  }
  
  function getRelativeAngle(center, point) {
    let aux = new Line(center, point);
  
    return getAngle(aux, point, center);
  }
  
  function getAngle(line, circleP, origin) {
    let IorIV_Quad = circleP.y <= origin.y ? true : false;
    let angle = Math.round(toDegrees(Math.atan(-line.slope)));
    if (IorIV_Quad && angle < 0) {
      return angle + 180;
    }
    if (!IorIV_Quad && angle > 0) {
      return angle + 180;
    }
    if (angle < 0) {
      return angle + 2 * 180;
    }
    if (angle == 0 && circleP.x < origin.x) {
      return 180;
    }
    return angle;
  }

  
function toRadians(degrees) {
    return Math.PI * degrees / 180.0;
  }
  
  function toDegrees(radians) {
    return 180 * radians / Math.PI;
  }

  /** sitting from start, if I turn left then I have to go counterclockwise */
function getSide(start, secondPoint, end) {
    let p1 = start.y > secondPoint.y ? start : secondPoint;
    let p2 = start.y > secondPoint.y ? secondPoint : start;
    // drawDirectLine(start,secondPoint,'green',ctx);
    // drawDirectLine(secondPoint,end,'green',ctx);
    let val = ((p2.y - p1.y) * (end.x - p2.x) -
      (p2.x - p1.x) * (end.y - p2.y));
  
    if (val == 0) return false;  // Colineari - non dovrebbe accadere
  
    // senso orario o antiorario
    return (val > 0) ? true : false;
  }
  
  
  function getAngleNewOrigin(newO, point) {
    let xO = newO.x;
    let yO = newO.y;
    let dX = point.x - xO;
    let dY = point.y - yO;
    let angle = Math.round(toDegrees(Math.atan(dY / dX)));
    if (dX >= 0 && dY >= 0) {
      angle = 360 - angle;
    } else if (dX < 0 && dY < 0) {
      angle += 180;
      angle -= 2 * (angle - 180);
    } else if (dX < 0 && dY >= 0) {
      angle += 180;
      angle += 2 * (180 - angle);
    } else if (dX >= 0 && dY < 0) {
      angle = -angle;
    }

    let l=new Line(newO,point);
    return getAngle(l,point,newO);
  
    return angle;
  }

  
  
function toPositive(num) {
    return num >= 0 ? num : -num;
  }
  
  function approx(n, digits) {
  
    return Math.round(n * Math.pow(10, digits)) / Math.pow(10, digits);
  }
  
  function between(ml, value, mr) {
    return ml <= value && value <= mr;
  }