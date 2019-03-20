import { Room, Block, Segment, Point } from './types';
import { drawScene } from './drawScene';
import { loadMap } from './loadMap';
import { calculateVisibility } from './visibility';

const spreadMap =
  (cb) => (array2d) =>
    array2d.map(array1d => cb(...array1d));

const makeSegments = spreadMap(Segment)
const makeBlocks = spreadMap(Block);

// Prepare canvas
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const xOffset = 0.5;
const yOffset = 0.5;
ctx.translate(xOffset, yOffset);

// Setup scene
const room = Room(0, 0, 1200, 1500);

const obstacles = [
  [[500, 0], [550, 100], [550, 150], [450, 150], [450, 200], [444, 200], [444, 250], [450, 250], [450, 550], [750, 550], [750, 500], [756, 500], [756, 450], [750, 450], [750, 150], [650, 150], [650, 100], [700, 0], [500, 0]],
  [[450, 200], [350, 200], [350, 50], [250, 50], [250, 100], [150, 100], [150, 50], [50, 50], [50, 350], [100, 350], [100, 400]],
  [[150, 400], [150, 350], [250, 350], [250, 400]],
  [[300, 400], [300, 350], [350, 350], [350, 250], [450, 250]],
  [[250, 400], [250, 800], [344, 800], [344, 750], [300, 750], [300, 550], [400, 550], [400, 400], [300, 400], [300, 394], [250, 394], [250, 400]],
  [[344, 750], [350, 750], [350, 700], [400, 600], [525.0, 575.0], [650, 600], [700, 700], [700, 750], [706, 750], [706, 800], [700, 800], [700, 850], [650, 950], [550, 950], [550, 956], [500, 956], [500, 950], [400, 950], [350, 850], [350, 800], [344, 800]]
]

let walls = []
for (let points of obstacles) {
  for (let i = 0; i < points.length; i++) {
    let point     = points[i]
    let nextPoint = points[i + 1]
    if (nextPoint) {
      walls.push([point[0], point[1], nextPoint[0], nextPoint[1]])
    }
  }
}

walls = makeSegments(walls)

// const walls = makeSegments([
//   [20, 20, 20, 120],
//   [20, 20, 100, 20],
//   [100, 20, 150, 100],
//   [150, 100, 50, 100],
// ]);

const blocks = []
// const blocks = makeBlocks([
//   [ 50, 150, 20, 20],
//   [150, 150, 40, 80],
//   [400, 400, 40, 40]
// ]);

const run = (lightSource) => {
  const endpoints = loadMap(room, blocks, walls, lightSource);  
  const visibility = calculateVisibility(lightSource, endpoints);

  requestAnimationFrame(() =>
    drawScene(ctx, room, lightSource, blocks, walls, visibility));
};

canvas.addEventListener('mousemove', ({pageX, pageY}) => {
  let lightSource = Point(pageX, pageY);
  run(lightSource)
});

let lightSource = Point(100, 100);
run(lightSource);
