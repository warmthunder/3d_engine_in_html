const canvas = document.getElementById('engine screen');
const ctx = canvas.getContext('2d');

let right = false;
let left = false;


let acc = 2
// let angle_acc = 0.1*Math.PI
let angle_acc = 0

let player_speed = 5

let camera_x = 0
let camera_v = 0

function resizeCanvas() {
  // Update internal drawing buffer to match window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

function point(p){
 const s = 30;
 ctx.fillStyle = '#ff4757';
 ctx.fillRect(p.x-s/2,p.y-s/2, s, s)

}

window.addEventListener('keydown',(event)=>{

if (event.key == 'd'){
    left = true;
    camera_v = 5
}

else if (event.key == 'a'){
    right = true;
    camera_v = -5
}

});

window.addEventListener('keyup',(event)=>{

    left = false
    right = false
    camera_v = 0
});

function convert_system(p){

    return {
        x: ((p.x + 1) / 2) * canvas.width,
        y: ((p.y + 1) / 2) * canvas.height,
        z: p.z
    };
}

function resize({x,y,z}){
    return{
        
        x:x/z,
        y: y/z,
        z:z
    };

}

// function make_line(points, pts){
// ctx.strokeStyle = "#ff4757"; 
// ctx.lineWidth = 20;
// for(let j = 0; j<points.length; j++){
//     for(let i = 0; i<j.length; i++){
//         ctx.beginPath();
//         ctx.moveTo(pts[points[i]].x, pts[points[i]].y);
//         ctx.lineTo(pts[points[(i+1)%points.length]].x, pts[points[(i+1)%points.length]].y)
//         ctx.stroke();
//     }
// }
// }

function make_line(p1, p2){
ctx.strokeStyle = "#ff4757"; 
ctx.lineWidth = 10;
ctx.beginPath();
ctx.moveTo(p1.x, p1.y);
ctx.lineTo(p2.x, p2.y)
ctx.stroke();

}

function make_plane(p1, p2){
ctx.fillStyle = "#39FF14"; 

ctx.moveTo(p1.x, p1.y);
ctx.lineTo(p2.x, p2.y)


}

function rotate({x,y,z}, angleInRadians){
const cosTheta = Math.cos(angleInRadians);
const sinTheta = Math.sin(angleInRadians);
    
return {
        x: x * cosTheta - z * sinTheta,
        z: x * sinTheta + z * cosTheta,
        y: y
    };
}

function translation(p, dt, cp){
return{
    x: p.x+cp,
    y: p.y, 
    z: p.z + dt 
}
}

function translation_r(p, dt, cp){
return{
    x: p.x+cp,
    y: p.y, 
    z: p.z +dt
}
}


function translation_l(p, dt, cp){
return{
    x: p.x+cp,
    y: p.y, 
    z: p.z+dt
}
}


const pts = [
    {x: 0.5, y: 0.5, z:0.5},
    {x: -0.5, y: 0.5, z:0.5},
    {x: -0.5, y: -0.5, z:0.5},
    {x: 0.5, y: -0.5, z:0.5},
    {x: 0.5, y: 0.5, z:-0.5},
    {x: -0.5, y: 0.5, z:-0.5},
    {x: -0.5, y: -0.5, z:-0.5},
    {x: 0.5, y: -0.5, z:-0.5}


]

const edges = [
    [0,1,2,3],
    [4,5,6,7]
    // [0,4],
    // [1,5],
    // [2,6],
    // [3,7]
]

const sides = [
    [0,1,2,3],
    [4,5,6,7],
    [0,4,7,3],
    [1,5,6,2],
    [0,4,5,1],
    [2,6,7,3]
]

const FPS = 60
dt = 1/FPS
let angle = 0;

function animate(time) {
        
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(left)
        angle += angle_acc*dt
    else if(right)
        angle -= angle_acc*dt

    // acc += dt*0.5

    // for(p of pts){
    //     point(convert_system(resize(translation(p, acc))));
    // }
    camera_x+= camera_v*dt
    for(e of sides){
        ctx.beginPath()
        
        for(let i = 0; i<e.length;i++){
            
            let a = convert_system(resize(translation(rotate(pts[e[i]], angle), acc, camera_x)))
            let b = convert_system(resize(translation(rotate(pts[e[(i+1)%e.length]],angle), acc, camera_x)))
            // point(convert_system(resize(translation(rotate(pts[e[i]], angle), acc, camera_x))))
            ctx.fillStyle = "#39FF14"; 
            if(i==0)
                ctx.moveTo(a.x, a.y)
            else
                ctx.lineTo(a.x, a.y)
            // make_plane(a,b);
           
        }
        ctx.fill();
    }


    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);