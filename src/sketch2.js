import store, {progressState, updateGrid, updateMaze} from './store'
export default function (s) {
  
  
let cubeSize = 50;
let totalSize = 9;
let cubeOffset = 0;
let initialOffset = Math.floor(totalSize / 2) * (cubeSize + cubeOffset);
let cam;


function getNeighbors(node) {
  let neighbors = [];
  let x = node.xIndex;
  let y = node.yIndex;
  let z = node.zIndex;
  
  if (x < totalSize - 1) {
    neighbors.push(grid[x+1][y][z])
  }
  if (x > 0) {
    neighbors.push(grid[x-1][y][z])
  }
  if (y < totalSize - 1) {
    neighbors.push(grid[x][y+1][z])
  }
  if (y > 0) {
    neighbors.push(grid[x][y-1][z])
  }
  if (z < totalSize - 1) {
    neighbors.push(grid[x][y][z+1])
  }
  if (z > 0) {
    neighbors.push(grid[x][y][z-1])
  }
  
  return neighbors
}

function getOpposingCube(node) {
  
  let opposingCubeX = (2 * node.xIndex - node.previousCube.xIndex);
  let opposingCubeY = (2 * node.yIndex - node.previousCube.yIndex);
  let opposingCubeZ = (2 * node.zIndex - node.previousCube.zIndex);
  
  
  if (opposingCubeX < totalSize && opposingCubeY < totalSize && opposingCubeZ < totalSize && opposingCubeX >= 0 && opposingCubeY >= 0 && opposingCubeZ >= 0) {
    let opposingCube = grid[opposingCubeX][opposingCubeY][opposingCubeZ]
    return opposingCube;
  }
  return null;
}


let Cube = class {
  constructor(xIndex, yIndex, zIndex) {
    this.value = false;
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.zIndex = zIndex;
    this.x = xIndex * cubeSize;
    this.y = yIndex * cubeSize;
    this.z = zIndex * cubeSize;
    this.previousCube = null;
  }
  
  show() {

    s.translate(this.xIndex * (cubeSize + cubeOffset), this.yIndex * (cubeSize + cubeOffset), this.zIndex * (cubeSize + cubeOffset));
        
    s.box(cubeSize, cubeSize, cubeSize);
    s.translate(-1 * this.xIndex * (cubeSize + cubeOffset), -1 * this.yIndex * (cubeSize + cubeOffset), -1 * this.zIndex * (cubeSize + cubeOffset));
  }
  
}

let grid = [];

for (let i = 0; i < totalSize; i++) {
  grid[i] = [];
  for (let j = 0; j < totalSize; j++) {
    grid[i][j] = []
    for (let k = 0; k < totalSize; k++) {
      grid[i][j][k] = new Cube(i, j, k);
    }
  }
}

let inMaze = [];
let wallsToCheck = [];
let continueDrawing = true;
let hasStateProgressed = false;

s.setup = function() {
  s.createCanvas(500, 500, s.WEBGL);
  cam = s.createCamera();
  cam.setPosition(0, 0, initialOffset * 5)
  // frameRate(5);
  
  // initial maze setup
  let startingPoint = grid[0][0][0];
  startingPoint.value = true;
  inMaze.push(startingPoint);
  
  // add neighbors to wallstocheck
  grid[0][0][1].previousCube = startingPoint;
  grid[0][1][0].previousCube = startingPoint;
  grid[1][0][0].previousCube = startingPoint;
  wallsToCheck.push(grid[1][0][0]);
  wallsToCheck.push(grid[0][1][0]);
  wallsToCheck.push(grid[0][0][1]);
}


s.draw = function() {

  // default controls
  cam.lookAt(0, 0, 0)
  s.background(225);
  s.orbitControl();
  
  // bix cube that encompasses all cubes
  // fill(0, 0, 0, 20)
  // box(cubeSize * totalSize + totalSize * cubeOffset);
  
  if (continueDrawing) {
  
  let randIndex = Math.floor(Math.random() * wallsToCheck.length);
  
  let currentWall = wallsToCheck[randIndex]
  let currentCube = getOpposingCube(currentWall);
  
  if (!inMaze.includes(currentCube) && currentCube !== null) {
    currentWall.value = true;
    currentCube.value = true;
    inMaze.push(currentWall);
    inMaze.push(currentCube);
    
    

    let newNeighbors = getNeighbors(currentCube);
    
    newNeighbors.forEach((newCube) => {
      if (!inMaze.includes(newCube)) {
        if (!wallsToCheck.includes(newCube)) {
          newCube.previousCube = currentCube;
          wallsToCheck.push(newCube);
        }
      }
    })
    
    
  }
  wallsToCheck.splice(randIndex, 1);
  
  }
  
  // draw stuff
  
  s.translate(-initialOffset, -initialOffset, -initialOffset);
  s.stroke(0);
  s.noStroke();
  
  grid.forEach((arr1) => {
    arr1.forEach((arr2) => {
      arr2.forEach((el) => {
        s.fill(0, 0, 0, 150);
        el.show();
        
      })
    })
  })

  
  inMaze.forEach((cell) => {
    s.fill(255, 255, 0, 80);
    cell.show();
    
  })
  
  wallsToCheck.forEach((cell) => {
    s.stroke(0)
    s.fill(0, 0, 255, 20) 
    cell.show();
    s.noStroke()
  })
  
  if (!wallsToCheck.length) {
    continueDrawing = false;
    // update grid on state
    // update app state so button is clickable
    
    if (!hasStateProgressed) {
      hasStateProgressed = true;
      store.dispatch(progressState())
      store.dispatch(updateGrid(grid))
      store.dispatch(updateMaze(inMaze))
    }
    
  }
  
  
  // makes random boxes highlight for testing
  // fill(255, 0, 0);
  // let rand1 = Math.floor(Math.random()*totalSize);
  // let rand2 = Math.floor(Math.random()*totalSize);
  // let rand3 = Math.floor(Math.random()*totalSize);
  
  // translate(rand1 * (cubeSize + cubeOffset) , rand2 * (cubeSize + cubeOffset), rand3 * (cubeSize + cubeOffset))
  // box(cubeSize, cubeSize, cubeSize);
  // translate(-rand1 * (cubeSize + cubeOffset), -rand2 * (cubeSize + cubeOffset), -rand3 * (cubeSize + cubeOffset));
  
  
}

}


