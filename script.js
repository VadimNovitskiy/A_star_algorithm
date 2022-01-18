let cols = 5;
let rows = 5;
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

let winner;
let current;

function heuristic(a, b) {
    // let d = Math.hypot(a.i, a.j, b.i, b.j);
    let d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j)
    return d;
}

function removeFromArray(arr, elem) {
    for(let i = arr.length - 1; i >= 0; i--) {
        if(arr[i] == elem) {
            arr.splice(i, 1)
        }
    }
}

class Spot{
    constructor(i, j) {
        this.i = i;
        this.j = j;

        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.neighbors = [];
        this.previous = undefined;
    }

    show(col) {
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

    addNeighbors(grid) {
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
    draw();
}

function rendering() {

    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }
    
    for(let i = 0; i < openSet.length; i++) {
        openSet[i].show('#72f738');  /// Green
    }

    for(let i = 0; i < closedSet.length; i++) {
        closedSet[i].show('#ff6425'); /// Red
    }

    let temp = current;
    path.push(temp);
    while(temp.previous) {
        path.push(temp.previous)
        temp = temp.previous;
        console.log(path);
    }
    
    for(let i = 0; i < path.length; i++) {
        path[i].show('#4fbcf2');  /// Blue
    }
    canvas.renderAll();
}


function draw() {
    // console.log(openSet);
    let intervalId = setInterval(() => {
        if(openSet.length > 0) {

            winner = 0;
            for(let i = 0; i < openSet.length; i++) {
                if(openSet[i].f < openSet[winner].f) {
                    winner = i;
                }
            }
            current = openSet[winner];
            // console.log(current);
    
            if(current === end) {
                console.log('Done');
                clearInterval(intervalId);
                return;
            }
    
            removeFromArray(openSet, current)
            closedSet.push(current);
            // console.log(openSet);
            // console.log(closedSet);
    
            let neighbors = current.neighbors;
    
            for(let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
    
                if(!closedSet.includes(neighbor)) {
                    let tempG = current.g + 1;
    
                    let newPath = false;
                    if(openSet.includes(neighbor)){
                        if(tempG < neighbor.g) {
                            neighbor.g = tempG;
                            newPath = true;
                        } 
                    } else {
                        neighbor.g = tempG;
                        newPath = true;
                        openSet.push(neighbor);
                    }
    
                    if(newPath) {
                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }
            }
            rendering();
        }
    }, 1000) 
        // console.log('no solution');
        // return;
}
setup()
// onChange: canvas.renderAll.bind(canvas)
// https://habr.com/ru/post/167119/



































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