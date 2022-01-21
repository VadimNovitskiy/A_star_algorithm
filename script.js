const startBtn = document.querySelector('#start');
const resetBtn = document.querySelector('#reset');

let state;
let cols = 50;
let rows = 50;
let width = 800;
let height = 800;
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

class Spot{
    constructor(i, j) {
        this.i = i;
        this.j = j;

        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.neighbors = [];
        this.previous = undefined;
        this.wall = false;
    }

    show(col) {
        let rect = new fabric.Rect({
            // stroke: '#fff',
            top: this.i * w, 
            left: this.j * h,
            width: w - 1,
            height: h - 1,
            hoverCursor: "pointer",
        });

        rect.set({fill: col})

        if(this.wall) {
            rect.set({fill: '#00000'})
        }

        rect.hasBorders = false;
        rect.hasControls = false;
        rect.lockMovementX = true;
        rect.lockMovementY = true;
        rect.subTargetCheck =  true;
        canvas.add(rect);
    }

    static render() {
        canvas.renderAll();
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
        if (i > 0 && j > 0) {
            this.neighbors.push(grid[i - 1][j - 1]);
        }
        if (i < cols - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1]);
        }
        if (i > 0 && j < rows - 1) {
            this.neighbors.push(grid[i - 1][j + 1]);
        }
        // if (i < cols - 1 && j < rows - 1) {
        //     this.neighbors.push(grid[i + 1][j + 1]);
        // }
    }
}

function startAlg() {
    setup();
    startBtn.addEventListener('click', draw);
    resetBtn.addEventListener('click', reset);
}
startAlg();

function reset() {
    console.log('reset');
    removeRect();
    openSet.length = 0;
    closedSet.length = 0;
    path.length = 0;
    grid.length = 0;
    state = 'start';
    startAlg();
}

function removeRect() {
    canvas.clear()
}

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
    
    for(let i = 0; i < 700; i++) {
        let items = grid[Math.floor(Math.random() * cols)][Math.floor(Math.random() * rows)];
        items.wall = true;
    }

    start = grid[0][0];
    end = grid[cols - 1][rows -1];
    start.wall = false;
    end.wall = false;

    openSet.push(start);

    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            grid[i][j].show('#fff');
        }
    }
}

async function draw() {
    startBtn.removeEventListener('click', draw);

    for(let iteration of algo()){

        const {openSet, closedSet, path} = iteration;

        await new Promise(resolve => setTimeout(resolve, 1));

        openSet.at(-1).show('#72f738');  /// Green
        closedSet.at(-1).show('#ff6425'); /// Red
    }
    console.log(path.length);

    for(let i = 0; i < path.length; i++) {
        path[i].show('#4fbcf2'); /// Blue
    }
    return;
}

function* algo() {
    console.log('start algorithm');

    while(openSet.length > 0) {
        winner = 0;
        for(let i = 0; i < openSet.length; i++) {
            if(openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        current = openSet[winner];

        if(current === end) {
            console.log('Done');
            let temp = current;
            path.push(temp);
            while (temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }
            break;
        }

        removeFromArray(openSet, current)
        closedSet.push(current);
        

        let neighbors = current.neighbors;

        for(let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if(!closedSet.includes(neighbor) && !neighbor.wall) {

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

        yield {
            openSet,
            closedSet,
            path,
            current,
            winner,
        };
    }
    console.log('end algorithm');
}