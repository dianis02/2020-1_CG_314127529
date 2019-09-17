

var CG = (function(CG) {


  class Matrix3 {
	 
    constructor(a00=1,a01=0, a02=0, a10=0, a11=1, a12=0, a20=0, a21=0, a22=1) {  
			this.a00=a00;
			this.a01=a01;
			this.a02=a02;
			this.a10=a10;
			this.a11=a11;
			this.a12=a12;
			this.a20=a20;
			this.a21=a21;
			this.a22=a22;
		
    
    }
    
	/**
	* @param {Matrix3} m1
	* @param {Matrix3} m2
	* @return {Matrix3}
	*/
	static add (m1, m2){
		
	let matrixAdd= new Matrix3(m1.a00+m2.a00,m1.a01+m2.a01,m1.a02+m2.a02,
								m1.a10+m2.a10,m1.a11+m2.a11,m1.a12+m2.a12,
								m1.a20+m2.a20,m1.a21+m2.a21,m1.a22+m2.a22);
	
	return matrixAdd;
	}
	
	
	/**
	* @return {Matrix3}
	*/
	adjoint(){
		var matrixAd= new Matrix3 (this.a11*this.a22-this.a12*this.a21,
									this.a12*this.a20-this.a10*this.a22,
									this.a10*this.a21-this.a11*this.a20,
									this.a21*this.a02-this.a22*this.a01,
									this.a22*this.a00-this.a20*this.a02,
									this.a20*this.a01-this.a21*this.a00,
									this.a01*this.a12-this.a02*this.a11,
									this.a02*this.a10-this.a00*this.a12,
									this.a00*this.a11-this.a01*this.a10);
		
		return matrixAd.transpose();
	
	}
	
	/**
	* @return {Matrix3}
	*/
	clone(){
		return this;
	}
	
	
	/**
	* @return {Number}
	*/
	determinant(){
		var det= this.a00*this.a11*this.a22+
				 this.a10*this.a21*this.a02+
				 this.a20*this.a01*this.a12-
				 this.a02*this.a11*this.a20-
				 this.a12*this.a21*this.a00-
				 this.a22*this.a01*this.a10;
		return det;
		
	}
	
	/**
	* @param {Matrix3} m1
	* @param {Matrix3} m2
	* @return {Boolean}
	*/
	static exactEquals(m1, m2){
		var eq=false;
		if(	m1.a00==m2.a00 &&
			m1.a01==m2.a01 &&
			m1.a02==m2.a02 &&
			m1.a10==m2.a10 &&
			m1.a11==m2.a11 &&
			m1.a12==m2.a12 &&
			m1.a20==m2.a20 &&
			m1.a21==m2.a21 &&
			m1.a22==m2.a22){
			eq=true;
			}
	
	
	return eq;
}
	/**
	* @param {Matrix3} m1
	* @param {Matrix3} m2
	* @return {Boolean}
	*/
	static equals(m1, m2){
		var eq=false;
		var dif=0.000001;
		if(	Math.abs(m1.a00-m2.a00)<dif &&
			Math.abs(m1.a01-m2.a01)<dif &&
			Math.abs(m1.a02-m2.a02)<dif &&
			Math.abs(m1.a10-m2.a10)<dif &&
			Math.abs(m1.a11-m2.a11)<dif &&
			Math.abs(m1.a12-m2.a12)<dif &&
			Math.abs(m1.a20-m2.a20)<dif &&
			Math.abs(m1.a21-m2.a21)<dif &&
			Math.abs(m1.a22-m2.a22)<dif){
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
		this.a10=0
		this.a11=1;
		this.a12=0;
		this.a20=0;
		this.a21=0;
		this.a22=1;	
	
	}
	
	/**
	* @return {Matrix3}
	*/
	invert(){
		var matrixI=CG.Matrix3.multiplyScalar(this.adjoint(),(1/this.determinant()));
		
		return matrixI;
		
	}
	
	/**
	* @param {Matrix3} m1
	* @param {Matrix3} m2
	* @return {Matrix3}
	*/
	static multiply(m1, m2){
		let matrixMult= new Matrix3(m1.a00*m2.a00+ m1.a01*m2.a10+m1.a02*m2.a20,
									m1.a00*m2.a01+ m1.a01*m2.a11+m1.a02*m2.a21,
									m1.a00*m2.a02+ m1.a01*m2.a12+m1.a02*m2.a22,
									m1.a10*m2.a00+ m1.a11*m2.a10+m1.a12*m2.a20,
									m1.a10*m2.a01+ m1.a11*m2.a11+m1.a12*m2.a21,
									m1.a10*m2.a02+ m1.a11*m2.a12+m1.a12*m2.a22,
									m1.a20*m2.a00+ m1.a21*m2.a10+m1.a22*m2.a20,
									m1.a20*m2.a01+ m1.a21*m2.a11+m1.a22*m2.a21,
									m1.a20*m2.a02+ m1.a21*m2.a12+m1.a22*m2.a22);
		
		return matrixMult;
		
		
	}
	
	/**
	* @param {Matrix3} m1
	* @param {Number} c
	* @return {Matrix3}
	*/
	static multiplyScalar(m1, c){
		let matrixS= new Matrix3(m1.a00*c,m1.a01*c,m1.a02*c,
								 m1.a10*c,m1.a11*c,m1.a12*c,
								 m1.a20*c,m1.a21*c,m1.a22*c);
		return matrixS;
	}
	
	/**
	* @param {Number} a00
	* @param {Number} a01
	* @param {Number} a02
	* @param {Number} a10
	* @param {Number} a11
	* @param {Number} a12
	* @param {Number} a20
	* @param {Number} a21
	* @param {Number} a22
	*/
	set(a00, a01, a02, a10, a11, a12, a20, a21, a22){
		this.a00=a00;
		this.a01=a01;
		this.a02=a02;
		this.a10=a10;
		this.a11=a11;
		this.a12=a12;
		this.a20=a20;
		this.a21=a21;
		this.a22=a22;
	}
	
	/**
	* @param {Matrix3} m1
	* @param {Matrix3} m2
	* @return {Matrix3}
	*/
	static subtract(m1, m2){
		let matrixSub= new Matrix3(m1.a00-m2.a00,m1.a01-m2.a01,m1.a02-m2.a02,
								m1.a10-m2.a10,m1.a11-m2.a11,m1.a12-m2.a12,
								m1.a20-m2.a20,m1.a21-m2.a21,m1.a22-m2.a22);
		return matrixSub;
	}
	
	/**
	* @return {Matrix3}
	*/
	transpose(){
		let matrixT= new Matrix3(this.a00,this.a10,this.a20,
									this.a01,this.a11,this.a21,
									this.a02,this.a12,this.a22);
		return matrixT;
		
	}
	
	
	
	/**
	* @param {Vector3} v
	* @return {Vector3}
	*/
	multiplyVector(v){
		let vector= new CG.Vector3(this.a00*v.x+this.a10*v.y+this.a20*v.z,
								this.a01*v.x+this.a11*v.y+this.a21*v.z,
								this.a02*v.x+this.a12*v.y+this.a22*v.z);
		return vector;
		
		
	}
	
	/**
	* @param {Number} rad
	* @return {Matrix3}
	* rotacion en contra de las manecillas
	*/
	static rotate(rad){
		let matrixR= new Matrix3(Math.cos(rad), Math.sin(rad),0,
								 - Math.sin(rad),Math.cos(rad),0,
								 0,0,1);
		return matrixR;
		
	
		
	}
	
	
	/**
	* @param {Number} sx
	* @param {Number} sy
	* @return {Matrix3}
	*/
	static scale(sx, sy){
		let matrixS= new Matrix3(sx,0,0,
								 0,sy,0,
								 0,0,1);
		return matrixS;
	}
	
	
	/**
	* @param {Number} tx
	* @param {Number} ty
	* @return {Matrix3}
	*/
	static translate(tx, ty){
		let matrixT= new Matrix3(1,0,0,
								 0,1,0,
								 tx,ty,1);
		return matrixT;
	}
	
	
    
}


	
 

  CG.Matrix3 = Matrix3;
  return CG;
})(CG || {});
