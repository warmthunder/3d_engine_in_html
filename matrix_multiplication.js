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

function cross_product_vec(v1,v2){
return{
    x:v1.y*v2.z - v1.z*v2.y,
    y:v1.z*v2.x-v1.x*v2.z,
    z:v1.x*v2.y-v1.y*v2.x
  }
}

function obj_addition(o1,o2){

  return{
    x:o1.x+o2.x,
    y:o1.y+o2.y,
    z:o1.z+o2.z
  }
}

function normalize(v1){
if (v1.x**2 + v1.y**2 +v1.z**2 == 0){
  return {
    x: 0,
    y: 0,
    z: 0
  }
}
return{
  x:v1.x/(Math.sqrt(v1.x**2 + v1.y**2 +v1.z**2 )),
  y:v1.y/(Math.sqrt(v1.x**2 + v1.y**2 +v1.z**2 )),
  z:v1.z/(Math.sqrt(v1.x**2 + v1.y**2 +v1.z**2 ))
}
}

function dot_product(v1, v2){
return v1.x*v2.x + v2.y*v1.y + v1.z*v2.z;
}

function vec_sub(v1,v2){

  return{
    x:v1.x-v2.x,
    y:v1.y-v2.y,
    z:v1.z-v2.z,
  };
}

function vec_mul(v1, k){
return{
  x:v1.x*k,
  y:v1.y*k,
  z:v1.z*k
};
}

let v1 = {
  x: 1,
  y: 0,
  z: 0
}

console.log(vec_mul(v1,dot_product(v1,{x:1,y:2,z:3})))