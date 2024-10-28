//functions
window.onload = function () {
  //load elements
  drawCanvas = document.getElementById('draw-board');
  board = document.getElementById('main-screen');
  graphSize = document.getElementsByTagName("input")[0].value;
  zSlider = document.getElementById('zoomRange');
  tSlider = document.getElementById('twistRange');
  intersCheckbox = document.getElementById('draw-intersections');

  // bzrCheckbox = document.getElementById('use-bezier');

  formuleDiv = document.getElementById('formule-div');

  outputSpan = document.getElementById("output-span");
  selectedSpan = document.getElementById("selected-span");
  formuleSpan = document.getElementById("formule-span");
  //contexts
  ctx = drawCanvas.getContext('2d');

  //listeners
  document.addEventListener('keyup', function (event) {
    if (event.key === 'Escape') {
      mode_0_selected_intersections.length = 0;
      mode_1_selected_intersections.length = 0;
      mode_2_selected_intersections.length = 0;
      selectedInsideNodes.length = 0;
      selectedOutsideNodes.length = 0;
      selectedNodes.length = 0;
      selectedHNodes.length = 0;
      selectedVNodes.length = 0;
      currentlySelected = false;
      selectedSpan.textContent = "" + 0;
      createGraph();
    }
  });
  try {
    let clear = document.getElementById("clear-button");
    clear.addEventListener("click", clearCanvas);
  }
  catch { }
  let drawButtons = document.getElementsByClassName('draw-button');
  for (let i = 0; i < drawButtons.length; i++) {
    drawButtons[i].addEventListener("click", setMode);
  }

  drawCanvas.addEventListener('click', (event) => {
    const board = drawCanvas.getBoundingClientRect();
    const xPos = event.clientX - board.left;
    const yPos = event.clientY - board.top;

    // console.log(xPos,yPos);
    if (event.ctrlKey) {
      checkClickPosition(xPos, yPos);
    }
  });

  let redrawerListeners = [zSlider, tSlider]
  redrawerListeners.forEach(element => {
    element.addEventListener('mouseup', (event) => {
      calcInters = true;
      createGraph();
    });
  });
  redrawerListeners.forEach(element => {
    element.addEventListener('touchend', (event) => {
      calcInters = true;
      createGraph();
    });
  });
  intersCheckbox.addEventListener('click', createGraph);

  initialize();
}


function setMode(event) {
  mode_0_intersections.length = 0;
  mode_0_selected_intersections.length = 0;
  mode_1_intersections.length = 0;
  mode_1_selected_intersections.length = 0;
  mode_2_intersections.length = 0;
  mode_2_selected_intersections.length = 0;
  selectedInsideNodes.length = 0;
  selectedOutsideNodes.length = 0;
  selectedNodes.length = 0;
  selectedHNodes.length = 0;
  selectedVNodes.length = 0;
  calcInters = true;
  currentlySelected = false;
  let currButton = event.target;
  if (currButton.classList.contains('draw-harary-hill-graph')) {
    mode = 0;
    tSlider.disabled = false;
  }
  if (currButton.classList.contains('draw-blazek-koman-graph')) {
    mode = 1;
    tSlider.disabled = false;
  }
  if (currButton.classList.contains('draw-bipartite-graph')) {
    mode = 2;
    tSlider.disabled = true;
  }
  createGraph();
}



function initialize() {
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
}

function resizeCanvas() {
  w = 0.75 * board.clientWidth;
  h = board.clientHeight;
  drawCanvas.width = w;
  drawCanvas.height = h;
  calcInters = true;
  createGraph();
}

function checkClickPosition(x, y) {
  let p = new Point(x, y);
  switch (mode) {
    case 0:
      for (let i = 0; i < numberNodesInside; i++) {
        let aux = Point.generatePoint(w / 2, h / 2, 0.5 * 0.3 * zoom * Math.min(w, h), i, 360 / numberNodesInside, 0);
        // drawCircle(aux.x,aux.y,10,false,'green',1);
        if (Point.distance(p, aux) <= vertixSize) {
          // console.log("preso!");
          if (selectedInsideNodes.includes(i)) {
            selectedInsideNodes.splice(selectedInsideNodes.indexOf(i), 1);
            if (selectedInsideNodes.length == 0 && selectedOutsideNodes.length == 0) {
              currentlySelected = false;
              lineThickness = 1;
            }
          } else {
            currentlySelected = true;
            selectedInsideNodes.push(i);
            lineThickness = 0.5;
          }
          clearCanvas();
          generateHHGraph(selectedInsideNodes, selectedOutsideNodes, numberNodesInside, numberNodesOutside);
        }
      }
      for (let i = 0; i < numberNodesOutside; i++) {
        let aux = Point.generatePoint(w / 2, h / 2, 0.5 * zoom * Math.min(w, h), i, 360 / numberNodesOutside, twist * 360);
        // drawCircle(aux.x,aux.y,10,false,'green',1);
        if (Point.distance(p, aux) <= vertixSize) {
          if (selectedOutsideNodes.includes(i)) {
            selectedOutsideNodes.splice(selectedOutsideNodes.indexOf(i), 1);
            if (selectedInsideNodes.length == 0 && selectedOutsideNodes.length == 0) {
              lineThickness = 1;
              currentlySelected = false;
            }
          } else {
            currentlySelected = true;
            selectedOutsideNodes.push(i);
            lineThickness = 0.5;
          }
          clearCanvas();
          generateHHGraph(selectedInsideNodes, selectedOutsideNodes, numberNodesInside, numberNodesOutside);
        }
      }
      break
    case 1:
      for (let i = 0; i < graphSize; i++) {
        let aux = Point.generatePoint(w / 2, h / 2, 0.5 * zoom * Math.min(w, h), i, 360 / graphSize, twist * 360);
        // drawCircle(aux.x,aux.y,10,false,'green',1);
        if (Point.distance(p, aux) <= vertixSize) {
          // console.log("preso!");
          if (selectedNodes.includes(i)) {
            selectedNodes.splice(selectedNodes.indexOf(i), 1);
            if (selectedNodes.length == 0) {
              lineThickness = 1;
              currentlySelected = false;
            }
          } else {
            currentlySelected = true;
            selectedNodes.push(i);
            lineThickness = 0.5;
          }
          clearCanvas();
          generateBKGraph(selectedNodes, graphSize);
        }
      }

      break;
    case 2:
      let horizontalSize = zoom * w;
      let verticalSize = zoom * h;
      let horizontalDelta = horizontalSize / (horizontalNumber);
      let verticalDelta = verticalSize / (verticalNumber);
      let currX = (w - horizontalSize) / 2;
      let currY = (h - verticalSize) / 2;
      let centerY = (verticalNumber % 2 == 0) ? (h / 2) : (currY + verticalSize * Math.ceil(verticalNumber / 2) / verticalNumber);
      let centerX = (horizontalNumber % 2 == 0) ? (w / 2) : (currX + horizontalSize * Math.ceil(horizontalNumber / 2) / horizontalNumber);

      for (let i = 0; i < horizontalNumber; i++) {
        let aux = new Point(currX, centerY);
        currX += horizontalDelta;
        if (i + 1 == Math.ceil(horizontalNumber / 2)) {
          currX += horizontalDelta;
        }

        if (Point.distance(p, aux) <= vertixSize) {
          // console.log("preso!");
          if (selectedHNodes.includes(i)) {
            selectedHNodes.splice(selectedHNodes.indexOf(i), 1);
            if (selectedHNodes.length == 0 && selectedVNodes.length == 0) {
              lineThickness = 1;
              currentlySelected = false;
            }
          } else {
            currentlySelected = true;
            selectedHNodes.push(i);
            lineThickness = 0.5;
          }
          clearCanvas();
          generateBipartiteGraph(selectedHNodes, selectedVNodes, horizontalNumber, verticalNumber);
        }
      }

      for (let i = 0; i < verticalNumber; i++) {
        let aux = new Point(centerX, currY);
        currY += verticalDelta;
        if (i + 1 == Math.ceil(verticalNumber / 2)) {
          currY += verticalDelta;
        }

        if (Point.distance(p, aux) <= vertixSize) {
          // console.log("preso!");
          if (selectedVNodes.includes(i)) {
            selectedVNodes.splice(selectedVNodes.indexOf(i), 1);
            if (selectedHNodes.length == 0 && selectedVNodes.length == 0) {
              currentlySelected = false;
              lineThickness = 1;
            }
          } else {
            currentlySelected = true;
            selectedVNodes.push(i);
            lineThickness = 0.5;
          }
          clearCanvas();
          generateBipartiteGraph(selectedHNodes, selectedVNodes, horizontalNumber, verticalNumber);
        }
      }

      break;
  }
}

function createGraph() {
  clearCanvas();
  lineThickness = ((selectedInsideNodes.length == 0 && selectedOutsideNodes.length == 0) && (selectedNodes.length == 0) && (selectedHNodes.length == 0 && selectedVNodes.length == 0)) ? 1 : 0.5;
  zoom = zSlider.value / 100;
  twist = -tSlider.value / 10;
  switch (mode) {
    case 0:
      graphSize = parseInt(document.getElementsByTagName("input")[0].value);
      formuleDiv.textContent = hhConjText;
      formuleSpan.textContent = "" + (0.25 * Math.floor(graphSize / 2) * Math.floor((graphSize - 1) / 2) * Math.floor((graphSize - 2) / 2) * Math.floor((graphSize - 3) / 2));
      zoom *= 0.8;
      numberNodesInside = Math.ceil(graphSize / 2);
      numberNodesOutside = Math.floor(graphSize / 2);
      generateHHGraph(selectedInsideNodes, selectedOutsideNodes, numberNodesInside, numberNodesOutside);
      break;
    case 1:
      graphSize = parseInt(document.getElementsByTagName("input")[1].value);
      formuleDiv.textContent = hhConjText;
      formuleSpan.textContent = "" + (0.25 * Math.floor(graphSize / 2) * Math.floor((graphSize - 1) / 2) * Math.floor((graphSize - 2) / 2) * Math.floor((graphSize - 3) / 2));
      zoom *= 0.8;
      generateBKGraph(selectedNodes, graphSize);
      break;
    case 2:
      formuleDiv.textContent = bConjText;
      horizontalNumber = parseInt(document.getElementsByTagName("input")[2].value);
      verticalNumber = parseInt(document.getElementsByTagName("input")[3].value);
      formuleSpan.textContent = "" + (Math.floor(horizontalNumber / 2) * Math.floor((horizontalNumber - 1) / 2) * Math.floor((verticalNumber) / 2) * Math.floor((verticalNumber - 1) / 2));
      generateBipartiteGraph(selectedHNodes, selectedVNodes, horizontalNumber, verticalNumber);
      break;
    default:
      test();
  }
}

//mode=0
function generateHHGraph(inVerts, outVerts, maxSizeIn, maxSizeOut) {

  let deltaAngleInside = 360 / maxSizeIn;
  let deltaAngleOutside = 360 / maxSizeOut;
  let externalSquareSize = zoom * Math.min(w, h);
  let internalSquareSize = 0.3 * zoom * Math.min(w, h);
  let externalRadius = externalSquareSize / 2;
  let internalRadius = internalSquareSize / 2;
  let centerX = w / 2;
  let centerY = h / 2;
  let count = 0;
  let selectedCount = 0;
  let currAngle = 0;

  let insideNodes = [];
  let outsideNodes = [];
  let arcLines = [];
  let circles = [];
  let insideLines = [];

  let selectedLines = [];
  let selectedArcs = [];
  let selectedCircles = [];

  for (let i = 0; i < maxSizeIn; i++) {
    let currPoint = Point.generatePoint(centerX, centerY, internalRadius, i, deltaAngleInside, currAngle);
    // console.log(currPoint);
    if (inVerts.includes(i)) {
      drawCircle(currPoint.x, currPoint.y, vertixSize, selectedVertixColor, selectedVertixColor)
    } else {
      drawCircle(currPoint.x, currPoint.y, vertixSize, vertixColor, vertixColor)
    }
    insideNodes.push(currPoint);
  }

  for (let i = 0; i < insideNodes.length; i++) {
    for (let j = i + 1; j < insideNodes.length; j++) {

      if (inVerts.includes(i) && inVerts.includes(j)) {
        drawDirectLine(insideNodes[i], insideNodes[j], selectedLineColor, selectedThickness, ctx);
        selectedLines.push(new Line(insideNodes[i], insideNodes[j]));
      } else {
        drawDirectLine(insideNodes[i], insideNodes[j], lineColor, lineThickness, ctx);
      }
      insideLines.push(new Line(insideNodes[i], insideNodes[j]));
    }
  }

  currAngle = twist * 360;

  for (let i = 0; i < maxSizeOut; i++) {
    let currPoint = Point.generatePoint(centerX, centerY, externalRadius, i, deltaAngleOutside, currAngle);

    if (outVerts.includes(i)) {
      drawCircle(currPoint.x, currPoint.y, vertixSize, selectedVertixColor, selectedVertixColor)
    } else {
      drawCircle(currPoint.x, currPoint.y, vertixSize, vertixColor, vertixColor)
    }

    outsideNodes.push(currPoint);
  }

  //i punti consecutivi vanno collegati direttamente con cerchi centrati nell'origine
  //i punti non consecutivi con le circonferenze esterne
  for (let i = 0; i < maxSizeOut - 1; i++) {
    if (outVerts.includes(i) && outVerts.includes(i == maxSizeOut - 1 ? 0 : i + 1)) {
      drawCircleArc(centerX, centerY, deltaAngleOutside * i + twist * 360, deltaAngleOutside, externalRadius, selectedLineColor, selectedThickness, true);
    } else {
      drawCircleArc(centerX, centerY, deltaAngleOutside * i + twist * 360, deltaAngleOutside, externalRadius, lineColor, lineThickness, true);
    }
  }

  let center = new Point(centerX, centerY);
  //spirals
  for (let i = 0; i < insideNodes.length; i++) {
    for (let j = 0; j < outsideNodes.length; j++) {
      if (inVerts.includes(i) && outVerts.includes(j)) {
        drawSpiral(insideNodes[i], outsideNodes[j], center, i * insideNodes.length + j, selectedLineColor, selectedThickness, arcLines, selectedArcs);
      } else {
        drawSpiral(insideNodes[i], outsideNodes[j], center, i * insideNodes.length + j, lineColor, lineThickness, arcLines, null);
      }
    }
  }

  //draw circles
  let adjMat = [];
  for (let i = 0; i < maxSizeOut; i++) {
    adjMat[i] = new Array(maxSizeOut).fill(0);
  }

  for (let i = 0; i < maxSizeOut; i++) {
    for (let j = i + 2; j < maxSizeOut; j++) {
      if (outVerts[i] + 1 == outVerts[j]) {
        continue;
      }
      if (adjMat[i][j] == 0) {
        adjMat[i][j] = 1;
        adjMat[j][i] = 1;

        if (outVerts.includes(i) && outVerts.includes(j)) {
          createCircleArc(center, outsideNodes[i], outsideNodes[j], selectedLineColor, selectedThickness, circles, selectedCircles);

        } else {
          createCircleArc(center, outsideNodes[i], outsideNodes[j], lineColor, lineThickness, circles, null);
        }

      }
    }
  }

  if (currentlySelected) {
    mode_0_selected_intersections.length = 0;
    selectedCount += findIntersections(selectedLines, mode_0_selected_intersections);
    selectedCount += findArcIntersections(selectedArcs, externalRadius, internalRadius, mode_0_selected_intersections);
    selectedCount += findCircleIntersections(selectedCircles, externalRadius, center, mode_0_selected_intersections);
    selectedSpan.textContent = "" + selectedCount;
  }

  if (calcInters) {
    mode_0_intersections.length = 0;
    count += findIntersections(insideLines, mode_0_intersections);
    count += findArcIntersections(arcLines, externalRadius, internalRadius, mode_0_intersections);
    count += findCircleIntersections(circles, externalRadius, center, mode_0_intersections);
    calcInters = false;
    selectedSpan.textContent = "" + 0;
    outputSpan.textContent = "" + count;
  }

  if (intersCheckbox.checked) {
    drawCircles(mode_0_intersections, intersectionSize, false, intersectionColor, currentlySelected ? lineThickness / 2 : lineThickness);
    drawCircles(mode_0_selected_intersections, selectedIntersectionSize, false, selectedIntersectionColor, selectedThickness);
  }
}

//mode=1
function generateBKGraph(verts, maxSize) {

  let deltaAngle = 360 / maxSize;
  let squareSize = zoom * Math.min(w, h);
  let radius = squareSize / 2;
  let centerX = w / 2;
  let centerY = h / 2;
  let count = 0;
  let selectedCount = 0;
  let center = new Point(centerX, centerY);

  let startAngle = 360 * twist;
  let nodes = [];
  let insideLines = [];
  let circles = [];

  let selectedLines = [];
  let selectedCircles = [];

  let adjMat = [];
  for (let i = 0; i < maxSize; i++) {
    adjMat[i] = new Array(i + 1).fill(0);
  }

  for (let i = 0; i < maxSize; i++) {
    let p = Point.generatePoint(centerX, centerY, radius, i, deltaAngle, startAngle);
    nodes.push(p);
    // console.log(p);
    adjMat[i][i] = 1;
    if (verts.includes(i)) {
      drawCircle(nodes[i].x, nodes[i].y, vertixSize, selectedVertixColor, selectedVertixColor)
    } else {
      drawCircle(nodes[i].x, nodes[i].y, vertixSize, vertixColor, vertixColor)
    }
  }

  for (let i = 0; i < maxSize - 1; i++) {
    for (let j = i + 1; j < maxSize; j++) {
      let line = new Line(nodes[i], nodes[j]);
      //se consecutivi
      if (j == i + 1 || (j == maxSize - 1 && i == 0)) {
        if (verts.includes(i) && verts.includes(j)) {
          drawLine(line, selectedLineColor, selectedThickness, ctx);
        } else {
          drawLine(line, lineColor, lineThickness, ctx);
        }

      } else {
        //se non consecutivi
        if (line.slope <= 0 && isFinite(line.slope)) {
          insideLines.push(line);
          if (verts.includes(i) && verts.includes(j)) {
            selectedLines.push(line);
            drawLine(line, selectedLineColor, selectedThickness, ctx);
          } else {
            drawLine(line, lineColor, lineThickness, ctx);
          }
        } else { //cerchi esterni
          if (verts.includes(i) && verts.includes(j)) {
            createCircleArc(center, nodes[i], nodes[j], selectedLineColor, selectedThickness, circles, selectedCircles);
          } else {
            createCircleArc(center, nodes[i], nodes[j], lineColor, lineThickness, circles, null);
          }
        }
      }
    }
  }

  if (currentlySelected) {
    mode_1_selected_intersections.length = 0;
    selectedCount += findIntersections(selectedLines, mode_1_selected_intersections);
    selectedCount += findCircleIntersections(selectedCircles, radius, center, mode_1_selected_intersections);
    selectedSpan.textContent = "" + selectedCount;
  }

  if (calcInters) {
    mode_1_intersections.length = 0;
    count += findIntersections(insideLines, mode_1_intersections);
    count += findCircleIntersections(circles, radius, center, mode_1_intersections);
    calcInters = false;
    selectedSpan.textContent = "" + 0;
    outputSpan.textContent = "" + count;
  }

  if (intersCheckbox.checked) {
    drawCircles(mode_1_intersections, intersectionSize, false, intersectionColor, currentlySelected ? lineThickness / 2 : lineThickness);
    drawCircles(mode_1_selected_intersections, selectedIntersectionSize, false, selectedIntersectionColor, selectedThickness);
  }
}

function printConj() {
  let aux = [];
  for (let i = 4; i <= 9; i++) {
    aux[i] = new Array(6).fill(0)
  }
  for (let i = 4; i < 10; i++) {
    for (let j = 4; j < 10; j++) {
      aux[i][j] = Math.floor(i / 2) * Math.floor((i - 1) / 2) * Math.floor((j) / 2) * Math.floor((j - 1) / 2)
    }
  }
  let string = " \\  ";
  for (let i = 4; i < 10; i++) {
    string += i + " ";
  }
  string += "\n  \\";
  for (let i = 4; i < 10; i++) {
    string += "--";
  }
  string += "\n";

  for (let i = 4; i < 10; i++) {
    let auxS = i + " | ";
    for (let j = 4; j < 10; j++)
      auxS += aux[i][j] + " ";
    string += auxS + "\n";
  }
  console.log(string);
}

//mode=2
function generateBipartiteGraph(hVerts, vVerts, maxHorizontal, maxVertical) {
  let horizontalSize = zoom * w;
  let verticalSize = zoom * h;
  let horizontalDelta = horizontalSize / (maxHorizontal);
  let verticalDelta = verticalSize / (maxVertical);

  // printConj();

  //currX is for horizontal nodes
  let currX = (w - horizontalSize) / 2;
  let currY = (h - verticalSize) / 2;

  //horizontal nodes y-coord
  let centerY = (maxVertical % 2 == 0) ? (h / 2) : (currY + verticalSize * Math.ceil(maxVertical / 2) / maxVertical);

  //vertical nodes x-coord
  let centerX = (maxHorizontal % 2 == 0) ? (w / 2) : (currX + horizontalSize * Math.ceil(maxHorizontal / 2) / maxHorizontal);

  //debug square
  // drawSquare(ctx,currX,currY,horizontalSize,verticalSize);

  let horizontalCoords = [];
  let verticalCoords = [];
  let q1lines = [];
  let q2lines = [];
  let q3lines = [];
  let q4lines = [];
  let selected_q1lines = [];
  let selected_q2lines = [];
  let selected_q3lines = [];
  let selected_q4lines = [];

  let indexLastFirstHGroup;
  let indexLastFirstVGroup;

  for (let i = 0; i < maxHorizontal; i++) {
    horizontalCoords.push(new Point(currX, centerY));
    if (hVerts.includes(i)) {
      drawCircle(currX, centerY, vertixSize, selectedVertixColor, selectedVertixColor);
    } else {
      drawCircle(currX, centerY, vertixSize, vertixColor, vertixColor);
    }

    currX += horizontalDelta
    if (i + 1 == Math.ceil(maxHorizontal / 2)) {
      indexLastFirstHGroup = i;
      currX += horizontalDelta;
    }
  }

  for (let i = 0; i < maxVertical; i++) {
    verticalCoords.push(new Point(centerX, currY));
    if (vVerts.includes(i)) {
      drawCircle(centerX, currY, vertixSize, selectedVertixColor, selectedVertixColor);
    } else {
      drawCircle(centerX, currY, vertixSize, vertixColor, vertixColor);
    }

    currY += verticalDelta;
    if (i + 1 == Math.ceil(maxVertical / 2)) {
      indexLastFirstVGroup = i;
      currY += verticalDelta;
    }
  }

  for (let i = 0; i < horizontalCoords.length; i++) {
    for (let j = 0; j < verticalCoords.length; j++) {

      if (hVerts.includes(i) && vVerts.includes(j)) {
        drawDirectLine(horizontalCoords[i], verticalCoords[j], selectedLineColor, selectedThickness, ctx)
      } else {
        drawDirectLine(horizontalCoords[i], verticalCoords[j], lineColor, lineThickness, ctx)
      }

      //saves the line in 4 groups, think of it as quadrants of the plane
      if (i > indexLastFirstHGroup && j <= indexLastFirstVGroup) { //1st
        if (!(i == maxHorizontal - 1 && j == 0) && !(i == indexLastFirstHGroup + 1 && j == indexLastFirstVGroup))
          q1lines.push(new Line(horizontalCoords[i], verticalCoords[j]));
        if (hVerts.includes(i) && vVerts.includes(j)) {
          selected_q1lines.push(new Line(horizontalCoords[i], verticalCoords[j]));
        }

      }

      if (i <= indexLastFirstHGroup && j <= indexLastFirstVGroup) { //2nd
        if (!(i == 0 && j == 0) && !(i == indexLastFirstHGroup && j == indexLastFirstVGroup))
          q2lines.push(new Line(horizontalCoords[i], verticalCoords[j]));
        if (hVerts.includes(i) && vVerts.includes(j)) {
          selected_q2lines.push(new Line(horizontalCoords[i], verticalCoords[j]));
        }
      }

      if (i <= indexLastFirstHGroup && j > indexLastFirstVGroup) { //3rd
        if (!(i == 0 && j == maxVertical - 1) && !(i == indexLastFirstHGroup && j == indexLastFirstVGroup + 1))
          q3lines.push(new Line(horizontalCoords[i], verticalCoords[j]));
        if (hVerts.includes(i) && vVerts.includes(j)) {
          selected_q3lines.push(new Line(horizontalCoords[i], verticalCoords[j]));
        }
      }

      if (i > indexLastFirstHGroup && j > indexLastFirstVGroup) { //4th
        if (!(i == maxHorizontal - 1 && j == maxVertical - 1) && !(i == indexLastFirstHGroup + 1 && j == indexLastFirstVGroup + 1))
          q4lines.push(new Line(horizontalCoords[i], verticalCoords[j]));
        if (hVerts.includes(i) && vVerts.includes(j)) {
          selected_q4lines.push(new Line(horizontalCoords[i], verticalCoords[j]));
        }
      }
    }
  }

  let count = 0;
  let selectedCount = 0;

  if (currentlySelected) {
    mode_2_selected_intersections.length = 0;
    selectedCount += findIntersections(selected_q1lines, mode_2_selected_intersections);
    selectedCount += findIntersections(selected_q2lines, mode_2_selected_intersections);
    selectedCount += findIntersections(selected_q3lines, mode_2_selected_intersections);
    selectedCount += findIntersections(selected_q4lines, mode_2_selected_intersections);
    selectedSpan.textContent = "" + selectedCount;
  }

  if (calcInters) {
    mode_2_intersections.length = 0;
    count += findIntersections(q1lines, mode_2_intersections);
    count += findIntersections(q2lines, mode_2_intersections);
    count += findIntersections(q3lines, mode_2_intersections);
    count += findIntersections(q4lines, mode_2_intersections);
    calcInters = false;
    selectedSpan.textContent = "" + 0;
    outputSpan.textContent = "" + count;
  }

  if (intersCheckbox.checked) {
    drawCircles(mode_2_intersections, intersectionSize, false, intersectionColor, currentlySelected ? lineThickness / 2 : lineThickness);
    drawCircles(mode_2_selected_intersections, selectedIntersectionSize, false, selectedIntersectionColor, selectedThickness);
  }
}


function clearCanvas() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();
}

function test() {
  let center = new Point(100, h / 2);
  drawCircle(center.x, center.y, 5, 'green', 'green');
  let r1 = 60;
  let r2 = 250;
  drawCircle(center.x, center.y, r1, false, 'gray');
  drawCircle(center.x, center.y, r2, false, 'gray');


  let alpha = 72 * 3;
  let beta = 72 * 1 + twist * 360;
  let p1 = Point.generatePoint(center.x, center.y, r1, 0, 0, alpha)
  let p2 = Point.generatePoint(center.x, center.y, r2, 0, 0, beta)
  drawCircle(p1.x, p1.y, 5, 'blue', 'blue');
  drawCircle(p2.x, p2.y, 5, 'red', 'red');

  let alpha2 = 72 * 2;
  let beta2 = 72 * 2 + 360 * twist;
  let p12 = Point.generatePoint(center.x, center.y, r1, 0, 0, alpha2)
  let p22 = Point.generatePoint(center.x, center.y, r2, 0, 0, beta2)
  drawCircle(p12.x, p12.y, 5, 'blue', 'blue');
  drawCircle(p22.x, p22.y, 5, 'red', 'red');

  // drawSpiral(p1, p2, center, 0);
  // drawSpiral(p12, p22, center, 1);

  // console.log(arcLines);
  // drawLinesAlternate(arcLines, 'black', 'green', ctx);
  // findArcIntersections(arcLines, 3, 'blue', 0, r2, r1);

  let midpoint = new Point((p22.x + p2.x) / 2, (p22.y + p2.y) / 2);

  // let a1 = convertAngle(center, midpoint, beta);
  // let a2 = convertAngle(center, midpoint, beta2);

  let ll = new Line(midpoint, p2);
  ll.circlePoint = midpoint;
  let start = getAngle(ll, ll, drawCanvas, center);

  drawCircleArc(midpoint.x, midpoint.y, start, start, Point.distance(midpoint, p2), 'black', 1)
  drawCircleArc(150, 150, 315, 90, 100, 'red', 1, true);
  drawPoint(new Point(150, 150), 0, 0)

}

//main




//elements
let drawCanvas;
let formuleDiv;
let board;
let outputSpan;
let selectedSpan;
let formuleSpan;
let ctx;
let zSlider;
let tSlider;
let intersCheckbox;
// let bzrCheckbox;

//selected nodes
let currentlySelected = false;
let calcInters = true;
//0
let mode_0_intersections = []
let mode_0_selected_intersections = []
let numberNodesInside;
let numberNodesOutside;
let selectedInsideNodes = [];
let selectedOutsideNodes = [];

//1
let mode_1_intersections = []
let mode_1_selected_intersections = []
let selectedNodes = [];

//2
let mode_2_intersections = []
let mode_2_selected_intersections = []
let horizontalNumber;
let verticalNumber;
let selectedHNodes = [];
let selectedVNodes = [];

//values
let intersectionSize = 4;
let intersectionColor = 'blue';
let selectedIntersectionSize = 5;
let selectedIntersectionColor = 'purple';
let fillIntersection = false;
let vertixSize = 7;
let vertixColor = 'red';
let selectedVertixColor = 'darkgreen';
let lineColor = 'black';
let selectedLineColor = 'green';
let lineThickness = 1;
let selectedThickness = 2;
const SEGMENTS = 50;
let graphSize;
let w, h;
let mode = 0; //0 = Harary-Hill, 1 = Blazek-Koman, 2 = bipartite
let zoom;
let twist; //twist for the outer circle
let precision = 6;
let pixelPrecision = 0;
let hhConjText = "Optimal number of intersection according to Harary-Hill conjecture: ";
let bConjText = "Optimal number of intersection according to Zarankiewicz: ";
//commenti
/**
 * 
 * intersezioni tra archi forse
 *  non vanno
 * 
 */