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
