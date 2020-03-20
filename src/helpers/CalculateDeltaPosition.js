import {ThemeliodesProblima_1} from "./ThemeliodiProblimata";
import {posZ} from "./computeZ";

export const CalculateDeltaPosition = (Xa,Ya,Za,Gab,delta,dem) => {
	const Sab = delta; //distance in meters per second (50km/h)
	let posXY = ThemeliodesProblima_1(Xa,Ya,Sab,Gab);
	const newZ =posZ(posXY.Xb,posXY.Yb,dem);
 	// const DZ = posZ(posXY.Xb,posXY.Yb,dem)-Za;
	// const DZ = 0;
	// if(DZ<0 || DZ >0) {
	// 	const slope = DZ/Sab;
	// 	const slopeRadians = Math.atan(slope);
	// 	const SabNew = Math.abs(Sab*Math.cos(slopeRadians));
	// 	posXY = ThemeliodesProblima_1(Xa,Ya,SabNew,Gab);
	// }

	// const PxPosition = UserCoordinatesXY(posXY.Xb,posXY.Yb);
	
	return {x:posXY.Xb , y:posXY.Yb , z:newZ};
}

export const CalculateDeltaRotation = (Xa,Ya,Za,Xb,Yb,Zb,Gab,Sab,rotX,rotY) => {
	var DZ = Zb-Za;
	var XYkathetis = ThemeliodesProblima_1(Xb,Yb,Sab,Gab+100);
	var Xkathetis =XYkathetis.Xb;
	var Ykathetis =XYkathetis.Yb;
	var Zkathetis = posZ(Xkathetis,Ykathetis);
	var DZkathetis = Zb-Zkathetis;
	
	var RotationX = 0;
	var RotationY =0;
	
	if(DZ<0 || DZ >0){
		RotationX = Math.atan(DZ/Sab) ;
		RotationY = Math.atan(DZkathetis/Sab) ;
	}

	var DRotationX=rotX-RotationX;
	var DRotationY=rotY-RotationY;
	
	return {
		x:Number(DRotationX),
		y:Number(DRotationY)
	};
}
