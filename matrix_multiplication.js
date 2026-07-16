let m1 = [
    [1,0],
    [0,1]
]

let m2 = [
    [3,4],
    [2,5]
]

function matrix_manipulation(matrixA, matrixB) {
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const rowsB = matrixB.length;
  const colsB = matrixB[0].length;

    if (colsA !== rowsB) {
    throw new Error("Incompatible matrices: Columns of A must match rows of B.");
  }

  const result = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
            result[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }

  return result;
}

console.log(matrix_manipulation(m1,m2))