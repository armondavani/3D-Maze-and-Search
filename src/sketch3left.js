import store, { progressState, updateGrid, updateMaze } from './store'
import _ from 'lodash'

export default function (s) {

  s.props = { grid: [] }


  let cubeSize = 50/3;
  let totalSize = 9;
  let cubeOffset = 0;
  let initialOffset = Math.floor(totalSize / 2) * (cubeSize + cubeOffset);
  let cam;



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
      this.g = Infinity;
    }

    show() {

      s.translate(this.xIndex * (cubeSize + cubeOffset), this.yIndex * (cubeSize + cubeOffset), this.zIndex * (cubeSize + cubeOffset));

      s.box(cubeSize, cubeSize, cubeSize);
      s.translate(-1 * this.xIndex * (cubeSize + cubeOffset), -1 * this.yIndex * (cubeSize + cubeOffset), -1 * this.zIndex * (cubeSize + cubeOffset));
    }

  }



  function createGrid(propsGrid) {
    let newGrid = [];
    for (let i = 0; i < propsGrid.length; i++) {
      newGrid[i] = [];
      for (let j = 0; j < propsGrid.length; j++) {
        newGrid[i][j] = [];
        for (let k = 0; k < propsGrid.length; k++) {
          newGrid[i][j][k] = new Cube(i, j, k)
        }
      }
    }

    return newGrid;
  }

  function createMaze(propsMaze, myGrid) {
    let newMaze = [];
    propsMaze.forEach((mazeElt) => {
      let toAddToMaze = myGrid[mazeElt.xIndex][mazeElt.yIndex][mazeElt.zIndex]
      newMaze.push(toAddToMaze);
    })

    return newMaze;
  }

  function getWalls(myGrid, myMaze) {
    let spreadGrid = _.flattenDeep(myGrid);
    let getWalls = spreadGrid.filter((elt) => {
      return !myMaze.includes(elt)
    })
    return getWalls;
  }

  function getGoal(myGrid, myMaze) {
    let centers = []
    let potentialGoals = []
    
    if (myGrid.length%2===0) {
      // is even
      let centerIndex = myGrid.length/2;
      centers.push(myGrid[centerIndex-1][centerIndex-1][centerIndex-1])
      centers.push(myGrid[centerIndex-1][centerIndex-1][centerIndex])
      centers.push(myGrid[centerIndex-1][centerIndex][centerIndex-1])
      centers.push(myGrid[centerIndex-1][centerIndex][centerIndex])
      centers.push(myGrid[centerIndex][centerIndex-1][centerIndex-1])
      centers.push(myGrid[centerIndex][centerIndex-1][centerIndex])
      centers.push(myGrid[centerIndex][centerIndex][centerIndex-1])
      centers.push(myGrid[centerIndex][centerIndex][centerIndex])
      
    } else {
      // is odd
      let centerIndex = Math.floor(myGrid.length/2);
      
      for (let i = centerIndex-1; i <= centerIndex + 1; i++) {
        for (let j = centerIndex-1; j <= centerIndex + 1; j++) {
          for (let k = centerIndex-1; k <= centerIndex + 1; k++) {
            centers.push(myGrid[i][j][k])
          }
        }
      }
    }
    
    potentialGoals = centers.filter((elt) => {
      return myMaze.includes(elt);
    })
    
    let myGoal = potentialGoals[0]
    return myGoal;
  }
  
  
  function getDistance(currentNode, goalNode) {
    return Math.hypot((currentNode.xIndex-goalNode.xIndex), (currentNode.yIndex-goalNode.yIndex), (currentNode.zIndex-goalNode.zIndex))
    
  }
  
  
  function removeFromArray(arr, elt) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === elt) {
        arr.splice(i, 1);
      }
    }
  };
  
  

  function getNeighbors(node) {
    let myNeighbors = [];
    let x = node.xIndex;
    let y = node.yIndex;
    let z = node.zIndex;
    
    if (x < totalSize - 1) {
      myNeighbors.push(grid[x + 1][y][z])
    }
    if (x > 0) {
      myNeighbors.push(grid[x - 1][y][z])
    }
    if (y < totalSize - 1) {
      myNeighbors.push(grid[x][y + 1][z])
    }
    if (y > 0) {
      myNeighbors.push(grid[x][y - 1][z])
    }
    if (z < totalSize - 1) {
      myNeighbors.push(grid[x][y][z + 1])
    }
    if (z > 0) {
      myNeighbors.push(grid[x][y][z - 1])
    }

    return myNeighbors
  }
  
  function getMazeNeighbors(potentialNeighbors, myMaze) {
    
    let myMazeNeighbors = potentialNeighbors.filter((node) => {
      return myMaze.includes(node);
    })
    
    return myMazeNeighbors;
    
  }
  
  
  function isBlockInside(current, elt, depth) {
    if (!current) {
      return true;
    }
    if (elt.xIndex < depth || elt.yIndex < depth || elt.zIndex < depth) {
      return false
    }
    let inverseDepth = grid.length - depth;
    if (elt.xIndex > inverseDepth || elt.yIndex > inverseDepth || elt.zIndex > inverseDepth) {
      return false;
    }
    return true;
    
    
  }


  let grid = [[[]]];
  let maze = [];
  let mazeWalls = [];
  let inMaze = [];
  let wallsToCheck = [];
  let continueDrawing = true;
  let hasStateProgressed = false;
  let hasGridBeenMade;
let temp;
  
  s.setup = function () {
    s.createCanvas(500/3, 500/3, s.WEBGL);
    cam = s.createCamera();
    cam.setPosition(0, initialOffset * 4, 1)
    // frameRate(5);

    hasGridBeenMade = false;
    intervalId = setInterval(() => {
      stepForward = !stepForward;
    }, 500)


    // // initial maze setup
    // let startingPoint = grid[0][0][0];
    // startingPoint.value = true;
    // inMaze.push(startingPoint);

    // // add neighbors to wallstocheck
    // grid[0][0][1].previousCube = startingPoint;
    // grid[0][1][0].previousCube = startingPoint;
    // grid[1][0][0].previousCube = startingPoint;
    // wallsToCheck.push(grid[1][0][0]);
    // wallsToCheck.push(grid[0][1][0]);
    // wallsToCheck.push(grid[0][0][1]);
  }


  let openSet = []
  let closedSet = []
  let continueSearching = true;
  let current;
  let goal;
  let mazeNeighbors;
  let neighbors;
  let tempG;
  let pathMade = false;
  let finalPath = [];
  let stepForward = true;
  let intervalId;
  let cubeDepth = 0;
  
  s.draw = function () {


    
    if (!hasGridBeenMade && s.props.grid.length) {
      // necessary sets are created once props come in
      // and starting box is set/placed into open set.
      // ending box is also determined and placed as the goal node
      grid = createGrid(s.props.grid);
      maze = createMaze(s.props.maze, grid);
      mazeWalls = getWalls(grid, maze);
      
      goal = getGoal(grid, maze);
      
      let startingPoint = grid[0][0][0]
      startingPoint.g = 0;
      startingPoint.f = getDistance(startingPoint, goal);
      openSet.push(startingPoint)
      hasGridBeenMade = true;
    } else {
      
      if (stepForward) {
        stepForward = !stepForward;
      
      
      
      if (continueSearching && openSet.length) {
        // search algorighm logic here
        
        current = openSet.reduce((a, b) => {
          return (a.f < b.f ? a : b)
        });
        
        if (current === goal) {
          continueSearching = false;
          clearInterval(intervalId);
        }
        
        removeFromArray(openSet, current);
        closedSet.push(current);
        
        // these next 2 functions obtain all of the neighbors of the current
        // block, and then filters it so it is only the neighbors that are
        // indeed part of the maze, and are not walls of the maze
        neighbors = getNeighbors(current);
        mazeNeighbors = getMazeNeighbors(neighbors, maze);
        for (let i = 0; i < mazeNeighbors.length; i++) {
          let neighborNode = mazeNeighbors[i]
          
          if (closedSet.includes(neighborNode)) {
            continue;
          }
          
          tempG = current.g + getDistance(current, neighborNode);
          
          if (!openSet.includes(neighborNode)) {
            openSet.push(neighborNode);
          } else if (tempG >= neighborNode.g) {
            continue
          }
          
          neighborNode.previousCube = current;
          neighborNode.g = tempG;
          neighborNode.f = neighborNode.g + getDistance(neighborNode, goal);
          
          
        }
      }
      
      
      
      
      // if (openSet.length === 0) {
      //   continueSearching = false;
        // clearInterval(intervalId);
      // }
      
    }

      cam.lookAt(0, 0, 0)
      s.background(225);

      // big cube that encompasses all cubes
      // fill(0, 0, 0, 20)
      // box(cubeSize * totalSize + totalSize * cubeOffset);



      // draw stuff
      s.translate(-initialOffset, -initialOffset, -initialOffset);
      s.noStroke();
      
      
      
      if (current) {
        cubeDepth = Math.min(current.xIndex, current.yIndex, current.zIndex);
      }
      
      
      grid.forEach((arr1) => {
        arr1.forEach((arr2) => {
          arr2.forEach((el) => {

            if (!isBlockInside(current, el, cubeDepth) && continueSearching) {
              s.fill(0, 0, 0, 15)
              el.show()
            } else {
              s.fill(0, 0, 0, 150);
              el.show();
              // s.fill(0, 0, 245);
              // el.show();
            }
            
          })
        })
      })
      
      
      
      maze.forEach((cell) => {
        if (!isBlockInside(current, cell, cubeDepth) && continueSearching) {
          s.fill(255, 255, 0, 15)
          cell.show()
        } else {
          s.fill(255, 255, 0, 80);
          cell.show();
          // s.stroke(0);
          // s.fill(255, 255, 0, 245);
          // cell.show();
          // s.noStroke();
        }
        
        
        // s.fill(255, 255, 0, 80);
        // cell.show();
      })

      wallsToCheck.forEach((cell) => {
        s.fill(0, 0, 255, 20)
        cell.show();
      })
      
      
      
      openSet.forEach((cell) => {
        s.fill(0, 255, 0, 20);
        cell.show();
      })
      
      closedSet.forEach((cell) => {
        s.fill(255, 0, 0, 20);
        cell.show();
      })
      
      if (goal) {
        s.fill(255, 0, 255, 255);
        goal.show();
      }
      
      //
      // display external blocks shallowly
      // as head of search goes further into cube
      
      
      
      
      s.stroke(0);
      s.fill(0, 0, 255, 255);
      if (current) {
        current.show();
      }
      
      
      
      
      
      if (!continueSearching) {
        temp = current;
        finalPath.push(temp);
        while (temp.previousCube && !pathMade) {
          finalPath.push(temp.previousCube);
          temp = temp.previousCube;
        }
        pathMade = true;
        finalPath.forEach((item) => {
          s.noStroke();
          s.fill(0, 0, 255, 100);
          item.show()
        })
        
      } else {
          if (current) {
          temp = current;
          let currentPath = [];
          currentPath.push(temp)
          while (temp.previousCube) {
          currentPath.push(temp.previousCube);
            temp = temp.previousCube
          }
          s.fill(0, 0, 255, 255);
          currentPath.forEach((item) => {
            item.show();
          })
        }
        
      }
      
      
    }
  }

}


