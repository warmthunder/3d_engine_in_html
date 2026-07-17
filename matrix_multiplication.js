function matrix_multiplication(matrixA, matrixB) {
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

function cross_product(a1,a2,a3){

  let v1 ={
    x: a2.x-a1.x,
    y: a2.y-a1.y,
    z: a2.z-a1.z,
  } 
  let v2 ={
    x: a3.x-a1.x,
    y: a3.y-a1.y,
    z: a3.z-a1.z,
  } 

  return{
    x:v1.y*v2.z - v1.z*v2.y,
    y:v1.z*v2.x-v1.x*v2.z,
    z:v1.x*v2.y-v1.y*v2.x
  }
}

let p1 = {
  x:3,
  y:0,
  z:1
}

let p2 = {
  x:4,
  y:-2,
  z:1
}

let p3 = {
  x:5,
  y:3,
  z:-1
}

console.log(cross_product(p1,p2,p3))