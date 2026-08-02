import sympy as sp

ax,ay,az,bx,by,bz,cx,cy,cz,tx,ty,tz = sp.symbols('ax ay az bx by bz cx cy cz tx ty tz ')

M = sp.Matrix([
    [ax,ay,az,0],
    [bx, by, bz, 0],
    [cx, cy, cz, 0],
    [tx, ty, tz, 1]
])

M_inv = M.inv()

sp.pprint(M_inv)