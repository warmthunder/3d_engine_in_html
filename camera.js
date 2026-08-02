const canvas = document.getElementById('engine screen');
const ctx = canvas.getContext('2d');

// canvas.width = 1000
// canvas.height = 1000

let znear = 1
let zfar = 1000

const FPS = 60
dt = 1/FPS

let q = zfar/(zfar-znear)
let a = 1
let theta = 45
let f = 1/Math.tan(theta*Math.PI/180)

let camera_velocity = {
    x:0,
    y:0,
    z:0
}

let forwards = 0
let sideways = 0
let rot_x = 0

// y axis rotation
let yaw = 0
// x axis rotation
let pitch = 0

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

let mousex = 0
let mousey = 0

let camera_pos = {x:0, y:0, z:20};
const camera_j = {x:0, y:1, z:0}


let cubes = []

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});



window.addEventListener('mousemove',(event)=>{
    if(document.pointerLockElement === canvas)
	{
  yaw -= event.movementX/canvas.width
  pitch -= event.movementY/canvas.height
    }
})

window.addEventListener('keydown',(event)=>{

if (event.key == 'd'){
    sideways=-1
}

else if (event.key == 'a'){

    sideways=+1
}

else if (event.key == 's'){
    forwards = +1
    
}
else if (event.key == 'w'){
    forwards = -1
}

else if (event.key == 'Escape'){
    document.exitPointerLock()
    
}
});


window.addEventListener('keyup',(event)=>{

    if (event.key == 'd'){
   
    sideways=0
}

else if (event.key == 'a'){
  
    sideways=0
}

else if (event.key == 's'){
   
    forwards = 0
}
else if (event.key == 'w'){
    
    forwards = 0
}})

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

// rotation
function rotate({x,y,z},angleInRadians_x, angleInRadians_y,angleInRadians_z,){
    const cx = Math.cos(angleInRadians_x);
    const sx = Math.sin(angleInRadians_x);

    const cz = Math.cos(angleInRadians_z);
    const sz = Math.sin(angleInRadians_z);

    const cy = Math.cos(angleInRadians_y);
    const sy = Math.sin(angleInRadians_y);

        let rx = [
        [1, 0, 0],
        [0, cx, -sx],
        [0, sx, cx]
    ]
        
    let rz = [
        [cz, -sz, 0],
        [sz,  cz, 0],
        [0,   0,  1]
    ]

    let ry = [
        [cy,0,sy],
        [0,1,0],
        [-sy,0,cy]
    ]

    let R = matrix_multiplication(ry, rx)
    R = matrix_multiplication(R,rz)
    let points = [
        [x],
        [y],
        [z]
    ]

    let ans = matrix_multiplication(R,points)

return {
        x: ans[0][0],
        y: ans[1][0],
        z: ans[2][0]
    };
}

// changing coordinate systems
function convert_system(p){
    return {
        x: ((p.x + 1) / 2) * canvas.width,
        y: ((p.y + 1) / 2) * canvas.height,
    
    };
}

function point(p){
    const s = 30;
    // ctx.fillStyle = '#ff4757';
    ctx.fillRect(p.x-s/2,p.y-s/2, s, s)
}

// position vector - where object should be
// target vector forward vector for that object
//  up vector
function lookatmatrix(positionvec, targetvec, j){

    // k
    let k = vec_sub(targetvec,positionvec)
    k= normalize(k)
    
    
    // j
    let axischange = vec_mul(k,dot_product(k,j))
    let jnew = vec_sub(j, axischange)
    jnew = normalize(jnew)

    // i
    let i =  normalize(cross_product_vec(k,jnew))

    // converting LAM to inverse
    let converted_LAM = [
        [i.x, jnew.x, k.x, 0],
        [i.y, jnew.y, k.y, 0],
        [i.z, jnew.z, k.z, 0],
        [-1.0*dot_product(camera_pos,i), -1.0*dot_product(camera_pos,jnew), -1.0*dot_product(camera_pos,k), 1]
    ]
    // camera_pos is just the translation vector
    return converted_LAM

}

// function line(x,y,m){

// }

function lines_intersection(p1,p2,p3,p4){

    let m1 = (p2.y-p1.y)/(p2.x-p1.x)

    // let m2 = (p4.y-p3.y)/(p4.x-p3.x)


    if(m1 == 0 || m1 == Infinity)
        return {x:-1,y:-1}

    // let ix = (m1*p1.x - m2*p3.x + p3.y - p1.y) / (m1-m2)
    let ix = canvas.width

    let iy = m1*ix - m1*p1.x + p1.y


    return {x:ix,y:iy}
}


function inside(p1,c1,c2){
    if(p1.x<c1.x && p1.x <c2.x)
        return true
    return false
}

// clipping points form the xy plane
function clipping_xy(p1,p2,p3){
    // let zvalue = 1 //lookdir.z + 1
    // let m = {
    //     x:p2.x-p1.x,
    //     y:p2.y-p1.y,
    //     z:p2.z-p1.z
    // }
    // if((m.z == 0)){
    //     return;
    // }
    // let t = (zvalue-p1.z)/(p2.z-p1.z)
    // return [p1.z>zvalue?p1:p2,{x:m.x *t +p1.x,y:m.y*t+p1.y,z:m.z*t+p1.z }]
     if(p1&&p2&&p3){
    let zvalue = -1//lookdir.z + 1
    if(p1.z <=zvalue&& p2.z <=zvalue&& p3.z <=zvalue){
        return[p1,p2,p3];
    }
    return [];   
}
  return [];   
}

// slope is {1,0,1}
// distance of point from plane = slope dot_prod point
function clipping_xzL(p1,p2,p3){
    if(p1&&p2&&p3){
   let value1 = dot_product(p1,{x:1,y:0,z:1})
   let value2 = dot_product(p2,{x:1,y:0,z:1})
   let value3 = dot_product(p3,{x:1,y:0,z:1})
    if(value1 <=0&& value2 <=0&& value3 <=0){
        return[p1,p2,p3];
    }
    return [];   
}
return[];
}
function clipping_xzR(p1,p2,p3){
     if(p1&&p2&&p3){
   let value1 = dot_product(p1,{x:-1,y:0,z:1})
   let value2 = dot_product(p2,{x:-1,y:0,z:1})
   let value3 = dot_product(p3,{x:-1,y:0,z:1})
    if(value1 <=0&& value2 <=0&& value3 <=0){
        return[p1,p2,p3];
    }
    return [];   
}
return[];
}
function clipping_yzR(p1,p2,p3){
    if(p1&&p2&&p3){
   let value1 = dot_product(p1,{x:0,y:1,z:1})
   let value2 = dot_product(p2,{x:0,y:1,z:1})
   let value3 = dot_product(p3,{x:0,y:1,z:1})
    if(value1 <=0&& value2 <=0&& value3 <=0){
        return[p1,p2,p3];
    }
    return [];   
}
return[];
}
function clipping_yzL(p1,p2,p3){
      if(p1&&p2&&p3){
   let value1 = dot_product(p1,{x:0,y:-1,z:1})
   let value2 = dot_product(p2,{x:0,y:-1,z:1})
   let value3 = dot_product(p3,{x:0,y:-1,z:1})
    if(value1 <=0&& value2 <=0&& value3 <=0){
        return[p1,p2,p3];
    }
    return [];   
    }
return[];
}

function rectangle(sides, pts){
    this.update= function(){
        // painters algo
        // add transformed points here
            const transformed = pts
            sides.sort((a,b) => {
            const za = (transformed[a[0]].z + transformed[a[1]].z + transformed[a[2]].z) / 3;
            const zb = (transformed[b[0]].z + transformed[b[1]].z + transformed[b[2]].z) / 3;

            return za-zb;
        });
        if(forwards>0)
            camera_pos = obj_addition(camera_pos, vec_mul(lookdir, 5*dt))
        else if (forwards<0)
            camera_pos = vec_sub(camera_pos, vec_mul(lookdir, 5*dt))

       let right = normalize(cross_product_vec(lookdir, camera_j))
        if(sideways<0)
        camera_pos = obj_addition(camera_pos, vec_mul(right, -5*dt))
        else if(sideways>0)
        camera_pos = obj_addition(camera_pos, vec_mul(right, 5*dt))

        yaw   += rotation_vec.y*dt
        pitch += rotation_vec.x*dt
        lookdir = rotate({x:0,y:0,z:1},pitch, yaw,0)

        // camera_pos is just the translation vector
        camera_pos = obj_addition(camera_pos, vec_mul(camera_velocity,dt))
        
        // vtarget is where the world is looking
        vtarget = obj_addition(lookdir, camera_pos)
        this.display();
    }
    let clipped = []
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
            // console.log(a)
            clipped = clipping_xy(a,b,c)
            clipped = clipping_xzL(clipped[0],clipped[1],clipped[2])
            clipped = clipping_xzR(clipped[0],clipped[1],clipped[2])
            clipped = clipping_yzR(clipped[0],clipped[1],clipped[2])
            clipped = clipping_yzR(clipped[0],clipped[1],clipped[2])
            // consolse.log(clipped)
            // debugger
            if(clipped.length == 0)
                continue;
            a = clipped[0]
            b = clipped[1]
            c = clipped[2]

            let normal = cross_product(a,b,c)
            // solid
            normal = normalize(normal)
            const dotp = dot_product(normalize(b),normal)
            if(dotp >0){
                a = convert_system(resize(a))
                b = convert_system(resize(b))
                c = convert_system(resize(c))

                ac = a
                bc = b
                cc = c
                ctx.beginPath()
                ctx.moveTo(ac.x, ac.y)
                ctx.lineTo(bc.x, bc.y)
                ctx.lineTo(cc.x, cc.y)
                ctx.lineTo(ac.x, ac.y)
                let color = Math.abs(dotp)*255
                ctx.fillStyle = `rgba(${color},${color},${color},${1.0})`;
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
    for(let a = 0; a<cubes.length;a++){
        cubes[a].update();
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);