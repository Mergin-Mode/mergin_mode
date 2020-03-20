import {calculateSab} from "./ThemeliodiProblimata";
const Xmin = -50;
const Ymin = -50;
const Xmax = 50;
const Ymax = 50;
const XZStep=100/99;
const YZStep=100/99;
const zScale = 100;
const zShift = 0;
const DemWidth = 100;

export const posZ=(positionX,positionY,dem) =>{
	if (dem.length == 0) {
		return 0;
	}
	var axeX=(calculateSab(0,positionX,0,Xmin)/XZStep).toFixed(4) - 0;
	var axeY=(calculateSab(0,positionY,0,Ymax)/YZStep).toFixed(4) - 0;
	var intX=Math.floor(axeX);
	var intY=Math.floor(axeY);
	var restX=axeX-intX;
	var restY=axeY-intY;
	// var positionAtpoligon = (restX+restY)/2;
	if(restX == 0 && restY == 0){
		var axeZ=((intY)*DemWidth)+intX;//calculate height
		return Number(dem[axeZ][2].toFixed(4))
	}
	if (restX<=1-restY){
	//check X axis

		var axeZ=((intY)*DemWidth)+intX;//calculate height
		console.log(axeZ);
		if (!dem[axeZ] || !dem[axeZ + 1]) return 0;
		var dXZ=dem[axeZ][2] - dem[axeZ+1][2];
		var ipotinousaX= Math.sqrt(Math.pow((dXZ/zScale - zShift),2)+Math.pow(XZStep,2));
		//////
		var restX_new=restX+restY;
		var IpotinousaDiagwniou2=Math.sqrt(Math.pow(restY*YZStep,2)+Math.pow(restY*XZStep,2));
		//////
		var minIpotinousaX = ipotinousaX*restX_new;
		var slopeX = Math.atan( Math.abs((dXZ/zScale - zShift)/XZStep) );
		//var slopeX = Math.atan( (Math.abs(dXZ)/zScale - zShift)/XZStep) ;
		var multX = Math.sin(slopeX);
		
		var finalDXZ= minIpotinousaX*multX;
		if (dXZ<0){
			var heightX = (dem[axeZ][2]/zScale - zShift)+finalDXZ;
		}
		else{
			var heightX = (dem[axeZ][2]/zScale - zShift)-finalDXZ;
		}
	//check Y axis
		
		if (!dem[axeZ] || !dem[axeZ + DemWidth]) return 0;
		var dYZ=(dem[axeZ][2] - dem[axeZ+DemWidth][2]);
		var ipotinousaY= Math.sqrt(Math.pow((dYZ/zScale - zShift),2)+Math.pow(YZStep,2));
		//////
		var restY_new=restY+restX;
		var IpotinousaDiagwniou1=Math.sqrt(Math.pow(restX*XZStep,2)+Math.pow(restX*YZStep,2));
		//////
		var minIpotinousaY = ipotinousaY*restY_new;
		
		var slopeY = Math.atan( Math.abs((dYZ/zScale - zShift)/YZStep) );
		//var slopeY = Math.atan( Math.abs((dYZ/zScale - zShift)/YZStep) );
		var multY = Math.sin(slopeY);
		
		var finalDYZ = minIpotinousaY*multY;
		if (dYZ<0){
			var heightY = (dem[axeZ][2]/zScale - zShift)+finalDYZ;
		}
		else{
			var heightY = (dem[axeZ][2]/zScale - zShift)-finalDYZ;
		}
		
		var percent=IpotinousaDiagwniou2/(IpotinousaDiagwniou1+IpotinousaDiagwniou2);
		var FHeight1=Math.abs(heightX-heightY)*percent;
		if ((heightX-heightY)<0){
			var FHeight2=heightX+FHeight1;
		}
		else{
			var FHeight2=heightX-FHeight1;
		}
	}
	else{
	//check X axis
		var axeZ=((intY+1)*DemWidth)+intX+1;//calculate height
		console.log(axeZ)
		if (!dem[axeZ] || !dem[axeZ-1]) return 0;
		var dXZ=(dem[axeZ][2] - dem[axeZ-1][2]);
		var ipotinousaX= Math.sqrt(Math.pow((dXZ/zScale - zShift),2)+Math.pow(XZStep,2));
		//////
		var restX_new=(1-restX)+(1-restY);
		var IpotinousaDiagwniou2=Math.sqrt(Math.pow((1-restY)*YZStep,2)+Math.pow((1-restY)*XZStep,2));
		//////
		var minIpotinousaX = ipotinousaX*(restX_new);
		var slopeX = Math.atan( Math.abs((dXZ/zScale - zShift)/XZStep) );
		//var slopeX = Math.atan( (Math.abs(dXZ)/zScale - zShift)/XZStep) ;
		var multX = Math.sin(slopeX);
		var finalDXZ= minIpotinousaX*multX;
		if (dXZ<0){
			var heightX = (dem[axeZ][2]/zScale - zShift)+finalDXZ;
		}
		else{
			var heightX = (dem[axeZ][2]/zScale - zShift)-finalDXZ;
		}
		//check Y axis
		if (!dem[axeZ] || !dem[axeZ-DemWidth]) return 0;
		var dYZ=(dem[axeZ][2] - dem[axeZ-DemWidth][2]);
		var ipotinousaY= Math.sqrt(Math.pow((dYZ/zScale - zShift),2)+Math.pow(YZStep,2));
		//////
		var restY_new=(1-restY)+(1-restX);
		var IpotinousaDiagwniou1=Math.sqrt(Math.pow((1-restX)*XZStep,2)+Math.pow((1-restX)*YZStep,2));
		//////
		var minIpotinousaY = ipotinousaY*(restY_new);
		
		var slopeY = Math.atan( Math.abs((dYZ/zScale - zShift)/YZStep) );
		//var slopeY = Math.atan( Math.abs((dYZ/zScale - zShift)/YZStep) );
		var multY = Math.sin(slopeY);
		
		var finalDYZ= minIpotinousaY*multY;
		if (dYZ<0){
			var heightY = (dem[axeZ][2]/zScale - zShift)+finalDYZ;
		}
		else{
			var heightY = (dem[axeZ][2]/zScale - zShift)-finalDYZ;
		}
		var percent=IpotinousaDiagwniou2/(IpotinousaDiagwniou1+IpotinousaDiagwniou2);
		var FHeight1=Math.abs(heightX-heightY)*percent;
		if ((heightX-heightY)<0){
			var FHeight2=heightX+FHeight1;
		}
		else{
			var FHeight2=heightX-FHeight1;
		}

	}
	console.log(FHeight2)
	return Number(FHeight2.toFixed(4));
}
