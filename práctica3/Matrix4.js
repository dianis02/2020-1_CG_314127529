

var CG = (function(CG) {


  class Matrix4 {
	 
    constructor(a00=1,a01=0, a02=0,a03=0, a10=0, a11=1, a12=0,a13=0, a20=0, a21=0, a22=1,a23=0,a30=0,a31=0,a32=0,a33=0) {  
			this.a00=a00;
			this.a01=a01;
			this.a02=a02;
			this.a03=a03;
			this.a10=a10;
			this.a11=a11;
			this.a12=a12;
			this.a13=a13;
			this.a20=a20;
			this.a21=a21;
			this.a22=a22;
			this.a23=a23;
			this.a30=a30;
			this.a31=a31;
			this.a32=a32;
			this.a33=a33;
		
    
    }
    
	/**
	* @param {Matrix4} m1
	* @param {Matrix4} m2
	* @return {Matrix4}
	*/
	static add (m1, m2){
		
	let matrixAdd= new Matrix4(m1.a00+m2.a00,m1.a01+m2.a01,m1.a02+m2.a02,m1.a03+m2.a03,
								m1.a10+m2.a10,m1.a11+m2.a11,m1.a12+m2.a12,m1.a13+m2.a13,
								m1.a20+m2.a20,m1.a21+m2.a21,m1.a22+m2.a22,m1.a23+m2.a23,
								m1.a03+m2.a03,m1.a13+m2.a13,m1.a23+m2.a23,m1.a33+m2.a33);
	
	return matrixAdd;
	}
	
	
	/**
	* @return {Number}
	*/
	determinant3(a00,a01,a02,a10,a11,a12,a20,a21,a22){
		var det= a00*a11*a22+
				 a10*a21*a02+
				 a20*a01*a12-
				 a02*a11*a20-
				 a12*a21*a00-
				 a22*a01*a10;
		return det;
		
	}
	
	
	/**
	* @return {Matrix4}
	*/
	adjoint(){
		var matrixAd= new Matrix4(this.determinant3(this.a11,this.a12,this.a13,this.a21,this.a22,this.a23,this.a31,this.a32,this.a33),
								-this.determinant3(this.a10,this.a12,this.a13,this.a20,this.a22,this.a23,this.a30,this.a32,this.a33),
								this.determinant3(this.a10,this.a11,this.a13,this.a20,this.a21,this.a23,this.a30,this.a31,this.a33),
								-this.determinant3(this.a10,this.a11,this.a12,this.a20,this.a21,this.a22,this.a30,this.a31,this.a32),
								
								-this.determinant3(this.a01,this.a02,this.a03,this.a21,this.a22,this.a23,this.a31,this.a32,this.a33),
								this.determinant3(this.a00,this.a02,this.a03,this.a20,this.a22,this.a23,this.a30,this.a32,this.a33),
								-this.determinant3(this.a00,this.a01,this.a03,this.a20,this.a21,this.a23,this.a30,this.a31,this.a33),
								this.determinant3(this.a00,this.a01,this.a02,this.a20,this.a21,this.a22,this.a30,this.a31,this.a32),
								
								this.determinant3(this.a01,this.a02,this.a03,this.a11,this.a12,this.a13,this.a31,this.a32,this.a33),
								-this.determinant3(this.a00,this.a02,this.a03,this.a10,this.a12,this.a13,this.a30,this.a32,this.a33),
								this.determinant3(this.a00,this.a01,this.a03,this.a10,this.a11,this.a13,this.a30,this.a31,this.a33),
								-this.determinant3(this.a00,this.a01,this.a02,this.a10,this.a11,this.a12,this.a30,this.a31,this.a32),
								
								-this.determinant3(this.a01,this.a02,this.a03,this.a11,this.a12,this.a13,this.a21,this.a22,this.a23),
								this.determinant3(this.a00,this.a02,this.a03,this.a10,this.a12,this.a13,this.a20,this.a22,this.a23),
								-this.determinant3(this.a00,this.a01,this.a03,this.a10,this.a11,this.a13,this.a20,this.a21,this.a23),
								this.determinant3(this.a00,this.a01,this.a02,this.a10,this.a11,this.a12,this.a20,this.a21,this.a22));
						
		
		return matrixAd.transpose();
	
	}
	
	/**
	* @return {Matrix4}
	*/
	clone(){
		return this;
	}
	
	
	
	
	
	
	/**
	* @return {Number}
	*/
	determinant(){
		var det= this.determinant3(this.a11,this.a12,this.a13,this.a21,this.a22,this.a23,this.a31,this.a32,this.a33)
								-this.determinant3(this.a10,this.a12,this.a13,this.a20,this.a22,this.a23,this.a30,this.a32,this.a33)
								this.determinant3(this.a10,this.a11,this.a13,this.a20,this.a21,this.a23,this.a30,this.a31,this.a33)
								-this.determinant3(this.a10,this.a11,this.a12,this.a20,this.a21,this.a22,this.a30,this.a31,this.a32)
								
								-this.determinant3(this.a01,this.a02,this.a03,this.a21,this.a22,this.a23,this.a31,this.a32,this.a33)
								this.determinant3(this.a00,this.a02,this.a03,this.a20,this.a22,this.a23,this.a30,this.a32,this.a33)
								-this.determinant3(this.a00,this.a01,this.a03,this.a20,this.a21,this.a23,this.a30,this.a31,this.a33)
								this.determinant3(this.a00,this.a01,this.a02,this.a20,this.a21,this.a22,this.a30,this.a31,this.a32)
								
								this.determinant3(this.a01,this.a02,this.a03,this.a11,this.a12,this.a13,this.a31,this.a32,this.a33)
								-this.determinant3(this.a00,this.a02,this.a03,this.a10,this.a12,this.a13,this.a30,this.a32,this.a33)
								this.determinant3(this.a00,this.a01,this.a03,this.a10,this.a11,this.a13,this.a30,this.a31,this.a33)
								-this.determinant3(this.a00,this.a01,this.a02,this.a10,this.a11,this.a12,this.a30,this.a31,this.a32)
								
								-this.determinant3(this.a01,this.a02,this.a03,this.a11,this.a12,this.a13,this.a21,this.a22,this.a23)
								this.determinant3(this.a00,this.a02,this.a03,this.a10,this.a12,this.a13,this.a20,this.a22,this.a23)
								-this.determinant3(this.a00,this.a01,this.a03,this.a10,this.a11,this.a13,this.a20,this.a21,this.a23)
								this.determinant3(this.a00,this.a01,this.a02,this.a10,this.a11,this.a12,this.a20,this.a21,this.a22);
						
		return det;
		
	}
	
	/**
	* @param {Matrix4} m1
	* @param {Matrix4} m2
	* @return {Boolean}
	*/
	static exactEquals(m1, m2){
		var eq=false;
		if(	m1.a00==m2.a00 &&
			m1.a01==m2.a01 &&
			m1.a02==m2.a02 &&
			m1.a03==m2.a03 &&
			m1.a10==m2.a10 &&
			m1.a11==m2.a11 &&
			m1.a12==m2.a12 &&
			m1.a13==m2.a13 &&
			m1.a20==m2.a20 &&
			m1.a21==m2.a21 &&
			m1.a22==m2.a22 &&
			m1.a23==m2.a23 &&
			m1.a30==m2.a30 &&
			m1.a31==m2.a31 &&
			m1.a32==m2.a32 &&
			m1.a33==m2.a33){
			eq=true;
			}
	
	
	return eq;
}
	/**
	* @param {Matrix4} m1
	* @param {Matrix4} m2
	* @return {Boolean}
	*/
	static equals(m1, m2){
		var eq=false;
		var dif=0.000001;
		if(	Math.abs(m1.a00-m2.a00)<dif &&
			Math.abs(m1.a01-m2.a01)<dif &&
			Math.abs(m1.a02-m2.a02)<dif &&
			Math.abs(m1.a03-m2.a03)<dif &&
			Math.abs(m1.a10-m2.a10)<dif &&
			Math.abs(m1.a11-m2.a11)<dif &&
			Math.abs(m1.a12-m2.a12)<dif &&
			Math.abs(m1.a02-m2.a02)<dif &&
			Math.abs(m1.a20-m2.a20)<dif &&
			Math.abs(m1.a21-m2.a21)<dif &&
			Math.abs(m1.a22-m2.a22)<dif &&
			Math.abs(m1.a23-m2.a23)<dif &&
			Math.abs(m1.a30-m2.a30)<dif &&
			Math.abs(m1.a31-m2.a31)<dif &&
			Math.abs(m1.a32-m2.a32)<dif &&
			Math.abs(m1.a33-m2.a33)<dif){
			eq=true;
			}
	
	
	return eq;
	}
	
	/**
	*/
	identity(){
		this.a00=1;
		this.a01=0;
		this.a02=0;
		this.a03=0;
		this.a10=0
		this.a11=1;
		this.a12=0;
		this.a13=0;
		this.a20=0;
		this.a21=0;
		this.a22=1;
		this.a23=0;
		this.a30=0;
		this.a31=0;
		this.a32=0;
		this.a33=1;	
	
	}
	
	/**
	* @return {Matrix4}
	*/
	invert(){
		var matrixI=CG.Matrix4.multiplyScalar(this.adjoint(),(1/this.determinant()));
		
		return matrixI;
		
		
	}
	
	/**
	* @param {Matrix4} m1
	* @param {Matrix4} m2
	* @return {Matrix4}
	*/
	static multiply(m1, m2){
		var matrixMult= new Matrix4(m1.a00*m2.a00+ m1.a01*m2.a10+m1.a02*m2.a20+m1.a03*m2.a30,
									m1.a00*m2.a01+ m1.a01*m2.a11+m1.a02*m2.a21+m1.a03*m2.a31,
									m1.a00*m2.a02+ m1.a01*m2.a12+m1.a02*m2.a22+m1.a03*m2.a32,
									m1.a00*m2.a03+ m1.a01*m2.a13+m1.a02*m2.a23+m1.a03*m2.a33,
									
									m1.a10*m2.a00+ m1.a11*m2.a10+m1.a12*m2.a20+m1.a13*m2.a30,
									m1.a10*m2.a01+ m1.a11*m2.a11+m1.a12*m2.a21+m1.a13*m2.a31,
									m1.a10*m2.a02+ m1.a11*m2.a12+m1.a12*m2.a22+m1.a13*m2.a32,
									m1.a10*m2.a03+ m1.a11*m2.a13+m1.a12*m2.a23+m1.a13*m2.a33,
									
									m1.a20*m2.a00+ m1.a21*m2.a10+m1.a22*m2.a20+m1.a23*m2.a30,
									m1.a20*m2.a01+ m1.a21*m2.a11+m1.a22*m2.a21+m1.a23*m2.a31,
									m1.a20*m2.a02+ m1.a21*m2.a12+m1.a22*m2.a22+m1.a23*m2.a32,
									m1.a20*m2.a03+ m1.a21*m2.a13+m1.a22*m2.a23+m1.a23*m2.a33,
									
									m1.a30*m2.a00+ m1.a31*m2.a10+m1.a32*m2.a20+m1.a33*m2.a30,
									m1.a30*m2.a01+ m1.a31*m2.a11+m1.a32*m2.a21+m1.a33*m2.a31,
									m1.a30*m2.a02+ m1.a31*m2.a12+m1.a32*m2.a22+m1.a33*m2.a32,
									m1.a30*m2.a03+ m1.a31*m2.a13+m1.a32*m2.a23+m1.a33*m2.a33);
		
		return matrixMult;
		
		
	}
	
	/**
	* @param {Matrix4} m1
	* @param {Number} c
	* @return {Matrix4}
	*/
	static multiplyScalar(m1, c){
		let matrixS= new Matrix4(m1.a00*c,m1.a01*c,m1.a02*c,m1.a03*c,
								 m1.a10*c,m1.a11*c,m1.a12*c,m1.a13*c,
								 m1.a20*c,m1.a21*c,m1.a22*c,m1.a23*c,
								 m1.a30*c,m1.a31*c,m1.a32*c,m1.a33*c);
		return matrixS;
	}
	
	/**
	* @param {Number} a00
	* @param {Number} a01
	* @param {Number} a02
	* @param {Number} a03
	* @param {Number} a10
	* @param {Number} a11
	* @param {Number} a12
	* @param {Number} a13
	* @param {Number} a20
	* @param {Number} a21
	* @param {Number} a22
	* @param {Number} a23
	* @param {Number} a30
	* @param {Number} a31
	* @param {Number} a32
	* @param {Number} a33
	*/
	set(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33){
		this.a00=a00;
		this.a01=a01;
		this.a02=a02;
		this.a03=a03;
		this.a10=a10;
		this.a11=a11;
		this.a12=a12;
		this.a13=a13;
		this.a20=a20;
		this.a21=a21;
		this.a22=a22;
		this.a23=a23;
		this.a30=a30;
		this.a31=a31;
		this.a32=a32;
		this.a33=a33;
	}

	/**
	* @param {Matrix4} m1
	* @param {Matrix4} m2
	* @return {Matrix4}
	*/
	static subtract(m1, m2){
		let matrixSub= new Matrix4(m1.a00-m2.a00,m1.a01-m2.a01,m1.a02-m2.a02,m1.a03-m2.a03,
								m1.a10-m2.a10,m1.a11-m2.a11,m1.a12-m2.a12,m1.a13-m2.a13,
								m1.a20-m2.a20,m1.a21-m2.a21,m1.a22-m2.a22, m1.a23-m2.a23,
								m1.a30-m2.a30,m1.a31-m2.a31,m1.a32-m2.a32, m1.a33-m2.a33);
		return matrixSub;
	}
	

	/**
	* @return {Matrix4}
	*/
	transpose(){
		let matrixT= new Matrix4(this.a00,this.a10,this.a20,this.a30,
									this.a01,this.a11,this.a21,this.a31,
									this.a02,this.a12,this.a22,this.a32,
									this.a03,this.a13,this.a23,this.a33);
		return matrixT;
		
	}
	
	
	
	/**
	* @param {Number} left
	* @param {Number} right
	* @param {Number} bottom
	* @param {Number} top
	* @param {Number} near
	* @param {Number} far
	* @return {Matrix4}
	*/
	static frustum(left, right, bottom, top, near, far){
		let matrixO= new Matrix4((2/(right-left)),0,0,0,
								 0,(2n/(top-bottom)),0,0,
								 ((right+left)/(right-left)),((top+bottom)/(top-bottom)),((-far+near)/(far-near)),-1,
								 0,0,(-2*near*far/(far-near)),0);
		return matrixO;
	}
	
	/**
	* @param {Vector3} eye
	* @param {Vector3} center
	* @param {Vector3} up
	* @return {Matrix4}
	*/
	static lookAt(eye, center, up){
	}
	
	
	/**
	* @param {Vector4} v
	* @return {Vector4}
	*/
	multiplyVector(v){
			let vector= new CG.Vector3(this.a00*v.x+this.a10*v.y+this.a20*v.z+this.a30*v.w,
								this.a01*v.x+this.a11*v.y+this.a21*v.z+this.a31*v.w,
								this.a02*v.x+this.a12*v.y+this.a22*v.z+this.a32*v.w,
								this.a03*v.x+this.a13*v.y+this.a23*v.z+this.a33*v.w);
		return vector;
	}
    
    
    /**
	* @param {Number} left
	* @param {Number} right
	* @param {Number} bottom
	* @param {Number} top
	* @param {Number} near
	* @param {Number} far
	* @return {Matrix4}
	*/
	static ortho(left, right, bottom, top, near, far){	
		let matrixO= new Matrix4((2/(right-left)),0,0,0,
								 0,(2/(top-bottom)),0,0,
								 0,0,(1/(far-near)),-1,
								 ((-right+left)/(right-left)),((-top+bottom)/(top-bottom)),(-near/(far-near)),1);
		return matrixO;
								 
		
	}
	
	/**
	* @param {Number} fovy
	* @param {Number} aspect
	* @param {Number} near
	* @param {Number} far
	* @return {Matrix4}
	*/
	static perspective(fovy, aspect, near, far){
		let matrixR= new Matrix4(,0,0,0,
								 0,,0,0,
								 0,0,((far+near)/(far-near)),-1,
								 0,0,((2*far*near)/(far-near)),0)
	}
	
	/**
	* @param {Number} rad
	* @return {Matrix4}
	*/
	static rotateX(rad){
		let matrixR= new Matrix4(1,0,0,0,	
								 0,Math.cos(rad), Math.sin(rad),0,
								 0,- Math.sin(rad),Math.cos(rad),0,
								 0,0,0,1);
		return matrixR;
	}
	
	/**
	* @param {Number} rad
	* @return {Matrix4}
	*/
	static rotateY(rad){
		let matrixR= new Matrix4(Math.cos(rad),0, Math.sin(rad),0,
								0,1,0,0,
								 - Math.sin(rad),0,Math.cos(rad),0,
								 0,0,0,1);
		return matrixR;
	}
	
	
	/**
	* @param {Number} rad
	* @return {Matrix4}
	*/
	static rotateZ(rad){
		let matrixR= new Matrix4(Math.cos(rad), Math.sin(rad),0,0,
								 - Math.sin(rad),Math.cos(rad),0,0,
								 0,0,1,0,
								 0,0,0,1);
		return matrixR;
	}
	
	
	/**
	* @param {Vector3} v
	* @return {Matrix4}
	*/
	static scale(s){
		let matrixS= new Matrix4(sx,0,0,0,
								 0,sy,0,0,
								 0,0,sz,0,
								 0,0,0,1);
		return matrixS;
	}
	
	
	/**
	* @param {Vector3} v
	* @return {Matrix4}
	*/
	static translate(v){
		let matrixT= new Matrix4(1,0,0,0,
								 0,1,0,0,
								 0,0,1,0,
								 tx,ty,tz,1);
		return matrixT;
		
	}
	
}


	
 

  CG.Matrix4 = Matrix4;
  return CG;
})(CG || {});
