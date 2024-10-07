class ArcLine extends Line {
    constructor(a, b, arcID, index) {
      super(a, b);
      this.arcID = arcID;
      this.index = index
    }
  
    static segmentIntersection(l1, l2) {
  
      if (l1.index == 0 || l1.index == SEGMENTS - 1 || l2.index == 0 || l2.index == SEGMENTS - 1) {
        return null;
      }
      if(l1.arcID==l2.arcID){
        return null;
      }

      let detA = l1.facX * l2.facY - l1.facY * l2.facX;
      if (detA == 0) {
        return null
      }
  
      let x = (l1.constantTerm * l2.facY - l1.facY * l2.constantTerm) / detA;
      let y = (l1.facX * l2.constantTerm - l1.constantTerm * l2.facX) / detA;
  
      if (Line.checkDomain(l1, l2, new Point(x, y))) {
        return new Point(x, y);
      }
  
      return null;
    }
  }
  
  
//non trova bene quelle selezionate
function findArcIntersections(lines, extR, intR,savedPoints) {
  if(lines.length==0){
    return 0;
  }
  let num = 0
  let numArcs = lines[lines.length - 1].arcID + 1;//the id of the last arc(+1) is equal to the max number of arcs
  // let numArcs = lines.length/50;//the id of the last arc(+1) is equal to the max number of arcs
  // console.log(lines.length/50);
  // console.log(numArcs);
  let intersections = [];
  for (let i = 0; i < numArcs; i++) {
    intersections[i] = new Array(numArcs).fill(0);
  }

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      let inters = ArcLine.segmentIntersection(lines[i], lines[j], extR, intR);
      if (inters != null && intersections[lines[i].arcID][lines[j].arcID] == 0) {
        intersections[lines[i].arcID][lines[j].arcID] = 1;
        intersections[lines[j].arcID][lines[i].arcID] = 1;
        if (intersCheckbox.checked){
          // drawCircle(inters.x, inters.y, circleSize, fillIntersection, circleColor, thickness);
        }
        if(savedPoints!=null){
          savedPoints.push(inters);
        }
        num++
      }
    }
  }
  // console.log(matrixToString(intersections));
  return num;
}