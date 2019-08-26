let m13 = new CG.Matrix3(1,2,3,4,5,6,7,8,9);
let m6 = new CG.Matrix3();
//let m2 = new CG.Matrix3(1,2,3,3,2,1,1,0,1);
let m2 = new CG.Matrix4(1,1,0,0,0,-1,-2,0,0,0,1,-1,0,0,0,1);
let m1 = new CG.Matrix4(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
console.log(m2);
console.log(m1);
console.log(CG.Matrix4.add(m1,m2));;
console.log(m1);
console.log(CG.Matrix4.multiply(m1,m2));
console.log(m2.transpose());
console.log("determinante");
console.log(m2.determinant());
console.log(m2.adjoint());
console.log("inversa");
console.log(m2.invert());

