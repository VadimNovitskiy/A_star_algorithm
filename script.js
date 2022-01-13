const MAX_INTEGER = Infinity;
const MIN_INTEGER = 0; 

const matrix= [
    [MIN_INTEGER, 9, 2, MAX_INTEGER, 6],
    [9, MIN_INTEGER, 3, MAX_INTEGER, MAX_INTEGER],
    [2, 3, MIN_INTEGER, 5, MAX_INTEGER],
    [MAX_INTEGER, MAX_INTEGER, 5, MIN_INTEGER, 1],
    [6, MAX_INTEGER, MAX_INTEGER, 1, MIN_INTEGER]
];


// console.log(matrix.length);
// console.log(matrix[0].length);

// function matrixArray(rows, column) {
//     let arr = [];
//     for(let i = 0; i < rows; i++) {
//         arr[i] = [];
//         for(let j = 0; j < column; j++) {
//             arr[i][j] = i + j;
//         }
//     }
//     return arr;
// }

// console.log(matrix);

function Dijkstra(matrix, start = 0) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    if(rows !== cols || start >= rows) {
        console.log('eror');
        return;
    }

    const distance = new Array(rows).fill(Infinity);
    distance[start] = 0;
    console.log(distance);

    for(let i = 0; i < rows; i++) {

        if(distance[i] < Infinity) {
            for(let j = 0; j < cols; j++) {
                console.log(`${matrix[i][j]} + ${distance[i]} < ${distance[j]}`);
                if(matrix[i][j] + distance[i] < distance[j]) {
                    distance[j] = matrix[i][j] + distance[i];
                    console.log(`if ${matrix[i][j]} + ${distance[i]} < ${distance[j]} { ${distance[j]} = ${matrix[i][j]} + ${distance[i]} }`);
                }
            }
            console.log(distance);
        }
    }
    return distance;
}

