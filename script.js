let cols = 25;
let rows = 25;
let width = 400;
let height = 400;
const grid = new Array(cols);
let canvas = new fabric.Canvas('canvas', {
    width: width,
    height: height,
    backgroundColor: '#181a1b',
});

const openSet = [];
const closedSet = [];
let start;
let end;
let w, h;
let path = [];

function heuristic(a, b) {
    // let d = dist(a.i, a.j, b.i, b.j);
    let d = abs(a.i - b.i) + abs(a.j - b.j)
    return d;
}

function removeFromArray(arr, elem) {
    for(let i = arr.length - 1; i >= 0; i--) {
        if(arr[i] == elem) {
            arr.splice(i, 1)
        }
    }
}

function Spot(i, j) {
    this.i = i;
    this.j = j;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighbors = [];
    this.previous = undefined;

    this.show = function(col) {
        let rect = new fabric.Rect({
            stroke: '#fff',
            top: this.i * w, 
            left: this.j * h,
            width: w - 1,
            height: h - 1,
        })
        canvas.add(rect);
        rect.set({fill: col});

        rect.hasBorders = false;
        rect.hasControls = false;
        rect.lockMovementX = true;
        rect.lockMovementY = true;
    }

    this.addNeighbors = function(grid) {
        let i = this.i;
        let j = this.j;
        if(i < cols - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if(i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if(j < rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if(j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
    }
}


function setup() {

    w = width / cols;
    h = height / rows;

    for(let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    openSet.push(start);
}


function draw() {
    if(openSet.length > 0) {

        let winner = 0;
        for(let i = 0; i < openSet.length; i++) {
            if(openSet[i].f < openSet[winner].f) {
                winner = i;
            }
            
            let current = openSet[winner];

            if(current === end) {
                noLoop();
                console.log('Done');
            }

            removeFromArray(openSet, current)
            closedSet.push(current);

            let neighbors = current.neighbors;
            for(let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];

                if(!closedSet.includes(neighbor)) {
                    tempG = current.g + 1;

                    if(openSet.includes(neighbor)){
                        if(tempG < neighbor.g) {
                            neighbor.g = tempG;
                        } else {
                            neighbor.g = tempG;
                            openSet.push(neighbor);
                        }

                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }
            }
        }
    } else {

    }

    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }

    for(let i = 0; i < openSet.length; i++) {
        openSet[i].show('#72f738');
    }

    for(let i = 0; i < closedSet.length; i++) {
        closedSet[i].show('#ff6425');
    }

    let temp = current;
    path.push(temp);
    while(temp.previous) {
        path.push(temp.previous)
        temp = temp.previous;
    }

    for(let i = 0; i < path.length; i++) {
        path[i].show('#4fbcf2');
    }
}
setup();
draw();



































// function createCanvas() {
//     const canvas = new fabric.Canvas('canvas', {
//         width: 501,
//         height: 501,
//         backgroundColor: '#181a1b',
//     });
    
//     for(let i = 0; i < 25; i++) {
//         for(let j = 0; j < 25; j++) {
//             let rect = new fabric.Rect({
//                 left: j*20,
//                 top: i*20,
//                 width: 20, 
//                 height: 20, 
//                 stroke: 'rgba(255,255,255,0.5)',
//             });
//             canvas.add(rect);
//             rect.hasBorders = false;
//             rect.hasControls = false;
//             rect.lockMovementX = true;
//             rect.lockMovementY = true;
//             addColor(rect);
//         }
//     }
// }

// function addColor(rect) {
//     let group = new fabric.Group([rect], {
//         subTargetCheck: true
//     });
    
//     rect.on('mousedown', (event) => {
//         let targetRect = event.target;
//         targetRect.set({fill: 'red'})
//     })
// } 


// function start() {
//     switch(state) {
//         case 'init':
//             createCanvas();
//             break;
//     }
// }
// start();