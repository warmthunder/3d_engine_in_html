const canvas = document.getElementById('engine screen');
const ctx = canvas.getContext('2d');

// canvas.width = 1000
// canvas.height = 1000

let znear = 1
let zfar = 1000

let q = zfar/(zfar-znear)
let a = 1
let theta = 45
let f = 1/Math.tan(theta*Math.PI/180)

let camera_velocity = {
    x:0,
    y:0,
    z:0
}

// let object_pos = [x, y, z, 1]
let const_part = [
    [a*f,0,0,0],
    [0,f,0,0],
    [0,0,q, 1],
    [0, 0, -znear*q,0]
]

let lookdir = {
    x:0,
    y:0,
    z:1
}

let rotation_vec = {
    x:0,
    y:0,
    z:0
}

let vtarget = {
    x:0,
    y:0,
    z:1
}

let camera_pos = {x:0, y:0, z:4};
const camera_j = {x:0, y:1, z:0}


let cubes = []

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

window.addEventListener('keydown',(event)=>{

if (event.key == 'd'){

    camera_velocity.x = -5
}

else if (event.key == 'a'){

    camera_velocity.x = +5
}

else if (event.key == 's'){
  
    camera_velocity.z = +5
}
else if (event.key == 'w'){
    
    camera_velocity.z = -5
}
// rotation
else if (event.key == 'j'){
    rotation_vec.x = 3
}
else if (event.key == 'l'){
    rotation_vec.x = -3
}
else if (event.key == 'i'){
    rotation_vec.y = 3
}
else if (event.key == 'k'){
    rotation_vec.y = -3
}

});

window.addEventListener('keyup',(event)=>{

    if (event.key == 'd'){
   
    camera_velocity.x = 0
}

else if (event.key == 'a'){
  
    camera_velocity.x = 0
}

else if (event.key == 's'){
   
    camera_velocity.z = 0
}
else if (event.key == 'w'){
    
    camera_velocity.z = 0
}
// rotation (x = yaw)
else if (event.key == 'j'){
  rotation_vec.x = 0
}
else if (event.key == 'l'){
    rotation_vec.x = 0
}
else if (event.key == 'i'){
    rotation_vec.y = 0
}
else if (event.key == 'k'){
    rotation_vec.y = 0
}

});

// the actual projection
function resize(p){
    let pos = [[p.x, p.y, p.z, 1]]
    let result = matrix_multiplication(pos, const_part)

    return{
        x:result[0][0]/result[0][3],
        y:result[0][1]/result[0][3],
        z:result[0][2]/result[0][3]
    };
}

// changing coordinate systems
function convert_system(p){
    return {
        x: ((p.x + 1) / 2) * canvas.width,
        y: ((p.y + 1) / 2) * canvas.height,
        z: p.z
    };
}


// position vector - where object should be
// target vector forward vector for that object
//  up vector
function lookatmatrix(world_prev_frame, newloc, j){

    // k
    let k = vec_sub(world_prev_frame, newloc)
    k= normalize(k)

    
    // i
    let axischange = vec_mul(k,dot_product(k,j))
    let jnew = vec_sub(j, axischange)
    jnew = normalize(jnew)

    // j
    let i =  normalize(cross_product_vec(k,jnew))


    // converting LAM to inverse
    let converted_LAM = [
        [i.x, jnew.x, k.x, 0],
        [i.y, jnew.y, k.y, 0],
        [i.z, jnew.z, k.z, 0],
        [-1.0*dot_product(camera_pos,i), -1.0*dot_product(camera_pos,jnew), -1.0*dot_product(camera_pos,k), 1]
    ]
    return converted_LAM

}

const FPS = 60
dt = 1/FPS
function rectangle(sides, pts){
    this.update= function(){
        // painters algo
            const transformed = pts
            sides.sort((a,b) => {
            const za = (transformed[a[0]].z + transformed[a[1]].z + transformed[a[2]].z) / 3;
            const zb = (transformed[b[0]].z + transformed[b[1]].z + transformed[b[2]].z) / 3;

            return zb - za;
        });
        this.display();
    }
    this.display = function(){
        for(e of sides){
            matview = lookatmatrix(camera_pos,vtarget, camera_j) 
            let pre_transform_a = [[pts[e[0]].x, pts[e[0]].y, pts[e[0]].z, 1]]
            let pre_transform_b = [[pts[e[1]].x, pts[e[1]].y, pts[e[1]].z, 1]]
            let pre_transform_c = [[pts[e[2]].x, pts[e[2]].y, pts[e[2]].z, 1]]
            
            let a_old = matrix_multiplication(pre_transform_a,matview)
            let b_old = matrix_multiplication(pre_transform_b,matview)
            let c_old = matrix_multiplication(pre_transform_c,matview)
            let a = {
                x:a_old[0][0],
                y:a_old[0][1],
                z:a_old[0][2]
            }

             let b = {
                x:b_old[0][0],
                y:b_old[0][1],
                z:b_old[0][2]
            }

             let c = {
                x:c_old[0][0],
                y:c_old[0][1],
                z:c_old[0][2]
            }            
            let normal = cross_product(a,b,c)
            // solid
            normal = normalize(normal)
            let cameraray = a
            const dotp = dot_product(normalize(cameraray),normal)
            if(dotp >0){
                ctx.beginPath()
                ctx.moveTo(convert_system(resize(a)).x, convert_system(resize(a)).y)
                ctx.lineTo(convert_system(resize(b)).x, convert_system(resize(b)).y)
                ctx.lineTo(convert_system(resize(c)).x, convert_system(resize(c)).y)
                ctx.lineTo(convert_system(resize(a)).x, convert_system(resize(a)).y)
                let color = Math.abs(dotp)*255
                ctx.fillStyle = `rgb(${color},${color},${color})`;
                ctx.fill();
            }
    }
}
}
let matview;
for(let i = 0; i<1; i++){
    cubes.push(new rectangle(axis_f, axis_v))
}

function animate(time) {       
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    camera_pos = obj_addition(camera_pos, vec_mul(camera_velocity,dt))
    vtarget = obj_addition(lookdir, camera_pos)
    lookdir = obj_addition(lookdir,vec_mul(rotation_vec,dt))
    for(let a = 0; a<cubes.length;a++){
        cubes[a].update();
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);