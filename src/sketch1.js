export default function (s) {

let size = 50;
let cubeSize = 9;
let cubeOffset = 0;
let initialOffset = Math.floor(cubeSize / 2) * (size + cubeOffset);
let cam;

s.setup = function() {
  s.createCanvas(500, 500, s.WEBGL);
  cam = s.createCamera();
  cam.setPosition(0, 0, initialOffset * 5)
}



s.draw = function() {

  // default controls
  cam.lookAt(0, 0, 0)
  s.background(225);
  s.orbitControl();
  
  // draws sets initial position and settings
  // fill(0, 0, 0, 20)
  // box(size * cubeSize + cubeSize * cubeOffset);
  

  
  s.translate(-initialOffset, -initialOffset, -initialOffset);
  s.stroke(0, 0, 0, 100);
  // s.noStroke();

  
  
  s.fill(0, 0, 0, 100);
  
  // draws all the boxes
  for (let i = 0; i < cubeSize; i++) {
    for (let j = 0; j < cubeSize; j++) {
      for (let k = 0; k < cubeSize; k++) {
        
        s.translate(i * (size + cubeOffset), j * (size + cubeOffset), k * (size + cubeOffset));
        
        s.box(size, size, size);
        
        s.translate(-1 * i * (size + cubeOffset), -1 * j * (size + cubeOffset), -1 * k * (size + cubeOffset));
      }
    }
  }
  
  
  // makes random boxes highlight for testing
  // s.fill(255, 0, 0);
  // let rand1 = Math.floor(Math.random()*cubeSize);
  // let rand2 = Math.floor(Math.random()*cubeSize);
  // let rand3 = Math.floor(Math.random()*cubeSize);
  
  // s.translate(rand1 * (size + cubeOffset) , rand2 * (size + cubeOffset), rand3 * (size + cubeOffset))
  // s.box(size, size, size);
  // s.translate(-rand1 * (size + cubeOffset), -rand2 * (size + cubeOffset), -rand3 * (size + cubeOffset));

  
}

}
