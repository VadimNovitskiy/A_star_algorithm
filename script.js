const startBtn = document.querySelector('#start');
const restartBtn = document.querySelector('#restart');
const resetBtn = document.querySelector('#reset');

const swamp = document.querySelector('.rect-type__swamp');
const forest = document.querySelector('.rect-type__forest');
const wall = document.querySelector('.rect-type__wall');

swamp.addEventListener('click', () => state = 'swamp');
forest.addEventListener('click', () => state = 'forest');
wall.addEventListener('click', () => state = 'wall');

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
let wallOfRect = [];
let swampOfRect = [];
let forestOfRect = [];

let winner;
let current;

let state;

class Spot{
    constructor(i, j) {
        this.i = i;
        this.j = j;

        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.neighbors = [];
        this.previous = undefined;
        this.swamp = false;
        this.forest = false;
        this.wall = false;
        this.selected = false;
    }

    show(col, opc = 1) {
        let rect = new fabric.Rect({
            top: this.i * w, 
            left: this.j * h,
            width: w - 1,
            height: h - 1,
            hoverCursor: "pointer",
        });

        rect.set({
            fill: col,
            opacity: opc,
        });

        if(this.wall) {
            rect.set({fill: '#00000'});
        }
        if(this.swamp) {
            rect.set({fill: '#8c822e'});
        }
        if(this.forest) {
            rect.set({fill: '#99f34e'});
        }

        rect.on('mousedown', (elem) => {
            let item = elem.target;
            
            switch(state) {
                case 'swamp':
                    if(this.swamp) {
                        return;
                    } else {
                        swampOfRect.push([this.i, this.j]);
                        this.swamp = true;
                        this.wall = false;
                        this.forest = false;
                        item.set({fill: '#8c822e'});
                    }
                    break;
                case 'forest':
                    if(this.forest) {
                        return;
                    } else {
                        forestOfRect.push([this.i, this.j]);
                        this.forest = true;
                        this.swamp = false;
                        this.wall = false;
                        item.set({fill: '#99f34e'});
                    }
                    break;
                case 'wall':
                    if(this.wall) {
                        return;
                    } else {
                        wallOfRect.push([this.i, this.j]);
                        this.wall = true;
                        this.swamp = false;
                        this.forest = false;
                        item.set({fill: '#00000'});
                    }
                    break;
            }
        })

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
        if (i < cols - 1 && j < rows - 1) {
            this.neighbors.push(grid[i + 1][j + 1]);
        }
    }
}

function startAlg() {
    getRandom();
    setup();
    startBtn.addEventListener('click', draw);
    resetBtn.addEventListener('click', reset);
}
startAlg();

function reset() {
    console.log('reset');

    removeRect();
    clearArrays(openSet, closedSet, path, grid, wallOfRect, swampOfRect, forestOfRect);
    startAlg();
}

function restart() {
    startBtn.addEventListener('click', draw);
    console.log('restart');
    clearArrays(openSet, closedSet, path);

    removeRect();
    setup();
}

function removeRect() {
    canvas.clear()
}

function clearArrays(...array) {
    array.forEach((elem) => elem.length = 0)
}

function heuristic(a, b) {
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

function infoForStart() {
    start = grid[0][0];
    end = grid[cols - 1][rows -1];
    start.wall = false;
    end.wall = false;

    openSet.push(start);
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

    for(let i = 0; i < wallOfRect.length; i++) {
        let item = wallOfRect[i];
        let [a, b] = item;
        grid[a][b].wall = true;
    }

    for(let i = 0; i < forestOfRect.length; i++) {
        let item = forestOfRect[i];
        let [a, b] = item;
        grid[a][b].forest = true;
    }

    for(let i = 0; i < swampOfRect.length; i++) {
        let item = swampOfRect[i];
        let [a, b] = item;
        grid[a][b].swamp = true;
    }

    infoForStart();

    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            grid[i][j].show('#fff');
        }
    }
}

function getRandom() {
    for(let i = 0; i < 700; i++) {
        wallOfRect.push([Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)]);
    }
}


async function draw() {
    startBtn.removeEventListener('click', draw);

    for(let iteration of algo()){

        const {openSet, closedSet, path} = iteration;

        await new Promise(resolve => setTimeout(resolve, 1));

        if(openSet.length) {
            openSet.at(-1).show('#00ffed');  /// Green
        } else {
            alert('There is no way, Bro.')
            reset();
            return;
        }
        if(closedSet.length) {
            closedSet.at(-1).show('#ff6425'); /// Red
        } else {
            return;
        }
    }

    for(let i = 0; i < path.length; i++) {
        path[i].show('#4fbcf2'); /// Blue
    }
    
    for(let b = 0; b < path.length - 1; b++) {
        path.line = true;
        let x1 = path[b].j * h + 8;
        let y1 = path[b].i * w + 8;
        let x2 = path[b + 1].j * h + 8;
        let y2 = path[b + 1].i * w + 8;

        let line = new fabric.Line([x1, y1, x2, y2], {
        stroke: 'red',
        strokeWidth: 2,
        });
        canvas.add(line); 
    }
    
    restartBtn.addEventListener('click', restart);
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

                if(neighbor.i === current.i - 1 && neighbor.j === current.j - 1) {
                    current.g += 2;
                }
                if(neighbor.i === current.i + 1 && neighbor.j === current.j - 1) {
                    current.g += 2;
                }
                if(neighbor.i === current.i - 1 && neighbor.j === current.j + 1) {
                    current.g += 2;
                }
                if(neighbor.i === current.i + 1 && neighbor.j === current.j + 1) {
                    current.g += 2;
                }

                if(neighbor.swamp) {
                    current.g += 4;
                }

                if(neighbor.forest) {
                    current.g += 2;
                }

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