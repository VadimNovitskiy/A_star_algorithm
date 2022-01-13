const aStar = function (graph, heuristic, start, goal) {

    //This contains the distances from the start node to all other nodes
    var distances = [];
    //Initializing with a distance of "Infinity"
    for (var i = 0; i < graph.length; i++) distances[i] = Number.MAX_VALUE;
    //The distance from the start node to itself is of course 0
    distances[start] = 0;

    //This contains the priorities with which to visit the nodes, calculated using the heuristic.
    var priorities = [];
    //Initializing with a priority of "Infinity"
    for (var i = 0; i < graph.length; i++) priorities[i] = Number.MAX_VALUE;
    //start node has a priority equal to straight line distance to goal. It will be the first to be expanded.
    priorities[start] = heuristic[start][goal];

    //This contains whether a node was already visited
    var visited = [];

    //While there are nodes left to visit...
    while (true) {

        // ... find the node with the currently lowest priority...
        var lowestPriority = Number.MAX_VALUE;
        var lowestPriorityIndex = -1;
        for (var i = 0; i < priorities.length; i++) {
            //... by going through all nodes that haven't been visited yet
            if (priorities[i] < lowestPriority && !visited[i]) {
                lowestPriority = priorities[i];
                lowestPriorityIndex = i;
            }
        }

        if (lowestPriorityIndex === -1) {
            // There was no node not yet visited --> Node not found
            return -1;
        } else if (lowestPriorityIndex === goal) {
            // Goal node found
            // console.log("Goal node found!");
            return distances[lowestPriorityIndex];
        }

        // console.log("Visiting node " + lowestPriorityIndex + " with currently lowest priority of " + lowestPriority);

        //...then, for all neighboring nodes that haven't been visited yet....
        for (var i = 0; i < graph[lowestPriorityIndex].length; i++) {
            if (graph[lowestPriorityIndex][i] !== 0 && !visited[i]) {
                //...if the path over this edge is shorter...
                if (distances[lowestPriorityIndex] + graph[lowestPriorityIndex][i] < distances[i]) {
                    //...save this path as new shortest path
                    distances[i] = distances[lowestPriorityIndex] + graph[lowestPriorityIndex][i];
                    //...and set the priority with which we should continue with this node
                    priorities[i] = distances[i] + heuristic[i][goal];
                    // console.log("Updating distance of node " + i + " to " + distances[i] + " and priority to " + priorities[i]);
                }
            }
        }

        // Lastly, note that we are finished with this node.
        visited[lowestPriorityIndex] = true;
        //console.log("Visited nodes: " + visited);
        //console.log("Currently lowest distances: " + distances);

    }
};


var small_graph_distances = [
    [0, 3, 4, 0, 0, 0],
    [0, 0, 0, 6, 10, 0],
    [0, 5, 0, 8, 0, 0],
    [0, 0, 0, 0, 7, 3],
    [0, 0, 0, 0, 0, 9],
    [0, 0, 0, 0, 0, 0],
];
var small_graph_coordinates = [
    [0, 2],
    [2, 0],
    [2, 4],
    [6, 0],
    [6, 4],
    [8, 2]
];
// As a heuristic we use straight line distance
var heuristic = [];
for (var i = 0; i < small_graph_distances.length; i++) {
    heuristic[i] = []
    for (var j = 0; j < small_graph_distances[i].length; j++) {
        var x1 = small_graph_coordinates[i][0];
        var y1 = small_graph_coordinates[i][1];
        var x2 = small_graph_coordinates[j][0];
        var y2 = small_graph_coordinates[j][1];
        heuristic[i][j] = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
    }
}

// console.log(heuristic);
console.log(aStar(small_graph_distances, heuristic, 0, 5));