const canvas = document.getElementById('engine screen');
const ctx = canvas.getContext('2d');

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

function rotate({x,y,z}, angleInRadians){
const cosTheta = Math.cos(angleInRadians);
const sinTheta = Math.sin(angleInRadians);
    
return {
        x: x * cosTheta - z * sinTheta,
        z: x * sinTheta + z * cosTheta,
        y: y
    };
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
    [4,5,6,7],
    [0,4],
    [1,5],
    [2,6],
    [3,7]
]

function translation(p, dt){
return{
    x: p.x,
    y: p.y, 
    z: p.z + dt
}
}

let acc = 2

const FPS = 60
dt = 1/FPS
let angle = 0;

function animate(time) {
        
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    angle += 0.5*Math.PI*dt

    // acc = acc+ dt*0.5

    // for(p of pts){
    //     point(convert_system(resize(translation(p, acc))));
    // }

    for(e of edges){
        for(let i = 0; i<e.length;i++){
            let a = convert_system(resize(translation(rotate(pts[e[i]], angle), acc)))
            let b = convert_system(resize(translation(rotate(pts[e[(i+1)%e.length]],angle), acc)))
            point(convert_system(resize(translation(rotate(pts[e[i]], angle), acc))))
            make_line(a,b);
        }
    }



    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);