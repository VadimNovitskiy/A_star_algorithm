const aStar = function (graph, heuristic, start, goal) {

    const distances = [];

    for (let i = 0; i < graph.length; i++) distances[i] = Number.MAX_VALUE;
    distances[start] = 0;

    const priorities = [];
    for (let i = 0; i < graph.length; i++) priorities[i] = Number.MAX_VALUE;
    priorities[start] = heuristic[start][goal];
    console.log(priorities[start]);
    console.log(priorities);

    let visited = [];

    while (true) {

        let lowestPriority = Number.MAX_VALUE;
        let lowestPriorityIndex = -1;
        for (let i = 0; i < priorities.length; i++) {

            if (priorities[i] < lowestPriority && !visited[i]) {
                lowestPriority = priorities[i];
                lowestPriorityIndex = i;
            }
        }

        if (lowestPriorityIndex === -1) {
            return -1;
        } else if (lowestPriorityIndex === goal) {
            return distances[lowestPriorityIndex];
        }

        for (let i = 0; i < graph[lowestPriorityIndex].length; i++) {
            if (graph[lowestPriorityIndex][i] !== 0 && !visited[i]) {

                if (distances[lowestPriorityIndex] + graph[lowestPriorityIndex][i] < distances[i]) {
                    distances[i] = distances[lowestPriorityIndex] + graph[lowestPriorityIndex][i];
                    priorities[i] = distances[i] + heuristic[i][goal];
                }
            }
        }

        visited[lowestPriorityIndex] = true;
        // console.log("Visited nodes: " + visited);
        // console.log("Currently lowest distances: " + distances);

    }
};

const small_graph_distances = [
    [0, 3, 4, 0, 0, 0],
    [0, 0, 0, 6, 10, 0],
    [0, 5, 0, 8, 0, 0],
    [0, 0, 0, 0, 7, 3],
    [0, 0, 0, 0, 0, 9],
    [0, 0, 0, 0, 0, 0],
];

const small_graph_coordinates = [
    [0, 2],
    [2, 0],
    [2, 4],
    [6, 0],
    [6, 4],
    [8, 2]
];

const heuristic = [];
for (let i = 0; i < small_graph_distances.length; i++) {
    heuristic[i] = []
    for (let j = 0; j < small_graph_distances[i].length; j++) {
        let x1 = small_graph_coordinates[i][0];
        let y1 = small_graph_coordinates[i][1];
        let x2 = small_graph_coordinates[j][0];
        let y2 = small_graph_coordinates[j][1];
        heuristic[i][j] = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
        // console.log(heuristic[i][j]);
    }
}

console.log(heuristic);
console.log(aStar(small_graph_distances, heuristic, 0, 5));


function draw() {
    // Am I still searching?
    if (openSet.length > 0) {
        // Best next option
        var winner = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        var current = openSet[winner];

        // Did I finish?
        if (current === end) {
            noLoop();
            console.log('DONE!');
        }
        
        // Best option moves from openSet to closedSet
        removeFromArray(openSet, current);
        closedSet.push(current);
        
        // Check all the neighbors
        var neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
    
            // Valid next spot?
            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                var tempG = current.g + heuristic(neighbor, current);
    
                // Is this a better path than before?
                var newPath = false;
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                    neighbor.g = tempG;
                    newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }
    
            // Yes, it's a better path
                if (newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        }
      // Uh oh, no solution
    } else {
        console.log('no solution');
        noLoop();
        return;
    }
    
    // Draw current state of everything
    background(255);
    
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }
    
    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0, 50));
    }
    
    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0, 50));
    }
    
    // Find the path by working backwards
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }
    
    // for (var i = 0; i < path.length; i++) {
    // path[i].show(color(0, 0, 255));
    //}
    
    // Drawing path as continuous line
    noFill();
    stroke(255, 0, 200);
    strokeWeight(w / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
      vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
    }
    endShape();
}