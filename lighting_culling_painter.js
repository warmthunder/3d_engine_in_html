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

let translated = {
    x:0,
    y:0,
    z:0
}

let camera_pos = {
    x: 0,
    y: 0,
    z: 0
}

let camera_v = {
    x: 0,
    y: 0,
    z: 0
}

// let object_pos = [x, y, z, 1]
let const_part = [
    [a*f,0,0,0],
    [0,f,0,0],
    [0,0,q, 1],
    [0, 0, -znear*q,0]
]

let cubes = []

let angle_x = Math.PI
let angle_z = 0
let angle_v = Math.PI*.3
// let angle_v = 0

// fs.sort((a,b)=>{
//     const za = (vs[a[0]].z + vs[a[1]].z + vs[a[2]].z)/3
//     const zb = (vs[b[0]].z + vs[b[1]].z + vs[b[2]].z)/3
//     return za-zb;
// })

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

window.addEventListener('keydown',(event)=>{

if (event.key == 'd'){

    camera_v.z = -5
}

else if (event.key == 'a'){

    camera_v.z = +5
}

else if (event.key == 's'){
  
    camera_v.x = +5
}
else if (event.key == 'w'){
    
    camera_v.x = -5
}
else if (event.key == 'j'){
  
    angle_acc = -angle_acc_max
}
else if (event.key == 'l'){
    
   angle_acc = +angle_acc_max
}

});

window.addEventListener('keyup',(event)=>{

    if (event.key == 'd'){
   
    camera_v.z = 0
}

else if (event.key == 'a'){
  
    camera_v.z = 0
}

else if (event.key == 's'){
   
    camera_v.x = 0
}
else if (event.key == 'w'){
    
    camera_v.x = 0
}
else if (event.key == 'j'){
  
    angle_acc = 0
}
else if (event.key == 'l'){
    
   angle_acc = 0
}

});

function rotate({x,y,z}, angleInRadians_z, angleInRadians_x){
const cx = Math.cos(angleInRadians_x);
const sx = Math.sin(angleInRadians_x);

const cz = Math.cos(angleInRadians_z);
const sz = Math.sin(angleInRadians_z);

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
    [cx,0,sx],
    [0,1,0],
    [-sx,0,cx]
]

let R = matrix_multiplication(ry, rz)

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

function resize(p){
    let pos = [[p.x, p.y, p.z, 1]]
    let result = matrix_multiplication(pos, const_part)

    return{
        x:result[0][0]/result[0][3],
        y:result[0][1]/result[0][3],
        z:result[0][2]/result[0][3]
    };
}

function convert_system(p){
    return {
        x: ((p.x + 1) / 2) * canvas.width,
        y: ((p.y + 1) / 2) * canvas.height,
        z: p.z
    };
}

function make_line(p1, p2){
    ctx.strokeStyle = "#ff4757"; 
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke();
}

function point(p){
    const s = 30;
    // ctx.fillStyle = '#ff4757';
    ctx.fillRect(p.x-s/2,p.y-s/2, s, s)
}

function translation(v1){
return{
    x:v1.x,
    y:v1.y,
    z:v1.z+3
}
}

let colors = [
    "#FF000080",
    "#00FF0080",
    "#0000FF80",
    "#FFFF0080",
    "#00FFFF80",
    "#FF00FF80"
]

const FPS = 60
dt = 1/FPS
let angle = 0;
let camera_p = {x:0, y:0, z:0}
function rectangle(edges, sides, pts){
    this.update= function(){
            const transformed = vs.map(v =>
            rotate(v, angle_x, angle_z)
            );
            fs.sort((a, b) => {
            const za = (transformed[a[0]].z + transformed[a[1]].z + transformed[a[2]].z) / 3;
            const zb = (transformed[b[0]].z + transformed[b[1]].z + transformed[b[2]].z) / 3;

            return zb - za;
        });
        this.display();
    }
    this.display = function(){
        // let i = 0
        // for(p of pts){
        //     ctx.fillStyle = colors[i]
        //     point(convert_system(resize(translation((p)))))
        //     i++;
        // }
        let i = 0
        // for(e of tri_sides){
        for(e of fs){
            let a = translation(rotate(pts[e[0]],angle_x, angle_z),translated)
            let b = translation(rotate(pts[e[1]],angle_x, angle_z),translated)
            let c = translation(rotate(pts[e[2]],angle_x, angle_z),translated)
            let normal = cross_product(a,b,c)

            // lines
            // if(normal.x*b.x + normal.y*b.y + normal.z*b.z <0){
            // make_line(convert_system(resize(a)),convert_system(resize(b)))
            // make_line(convert_system(resize(b)),convert_system(resize(c)))
            // make_line(convert_system(resize(c)),convert_system(resize(a)))
            // }

            // solid
            normal = normalize(normal)
            b = normalize(b)
            const dotp = normal.x*b.x + normal.y*b.y + normal.z*b.z
            if(dotp <0){
                ctx.beginPath()
                ctx.moveTo(convert_system(resize(a)).x, convert_system(resize(a)).y)
                ctx.lineTo(convert_system(resize(b)).x, convert_system(resize(b)).y)
                ctx.lineTo(convert_system(resize(c)).x, convert_system(resize(c)).y)
                ctx.lineTo(convert_system(resize(a)).x, convert_system(resize(a)).y)
                let color = Math.abs(dotp)*255
                ctx.fillStyle = `rgb(${color},${color},${color})`;
               
                ctx.fill();
            }
            i++ 
    }
}
}

// for(let i = 0; i<1; i++){
//     cubes.push(new rectangle(edges, sides, pointSets[i]))
// }

cubes.push(new rectangle(edges, sides, vs))
function animate(time) {        
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let a = 0; a<cubes.length;a++){
        cubes[a].update();
    }
    // angle_x+=angle_v*dt
    angle_z+=angle_v*dt

    camera_pos = obj_addition(camera_pos, camera_v)
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);