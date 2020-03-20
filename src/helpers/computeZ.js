export const posZ=(positionX,positionY) =>{
	
	var axeX=(positionX-Xmin)/XZStep;
	var axeY=(Ymax-positionY)/YZStep;
	var intX=Math.floor(axeX);
	var intY=Math.floor(axeY);
	var restX=axeX-intX;
	var restY=axeY-intY;
	var positionAtpoligon = (restX+restY)/2;
	
	if (restX<=1-restY){
	//check X axis
		var axeZ=((intY)*DemWidth)+intX;//calculate height
		var dXZ=(lyr[0].dem[0].data[axeZ] - lyr[0].dem[0].data[axeZ+1]);
		var ipotinousaX= Math.sqrt(Math.pow((dXZ/world.zScale - world.zShift),2)+Math.pow(XZStep,2));
		
		//////
				
		var restX_new=restX+restY;
		var IpotinousaDiagwniou2=Math.sqrt(Math.pow(restY*YZStep,2)+Math.pow(restY*XZStep,2));
		
		
		
		
		//////
		
		var minIpotinousaX = ipotinousaX*restX_new;
		
		var slopeX = Math.atan( Math.abs((dXZ/world.zScale - world.zShift)/XZStep) );
		//var slopeX = Math.atan( (Math.abs(dXZ)/world.zScale - world.zShift)/XZStep) ;
		var multX = Math.sin(slopeX);
		
		
		
		var finalDXZ= minIpotinousaX*multX;
		if (dXZ<0){
		var heightX = (lyr[0].dem[0].data[axeZ]/world.zScale - world.zShift)+finalDXZ;
		}
		else{
		var heightX = (lyr[0].dem[0].data[axeZ]/world.zScale - world.zShift)-finalDXZ;
		}
		
		
		//check Y axis
		
		var dYZ=(lyr[0].dem[0].data[axeZ] - lyr[0].dem[0].data[axeZ+DemWidth]);
		var ipotinousaY= Math.sqrt(Math.pow((dYZ/world.zScale - world.zShift),2)+Math.pow(YZStep,2));
		//////
		var restY_new=restY+restX;
		var IpotinousaDiagwniou1=Math.sqrt(Math.pow(restX*XZStep,2)+Math.pow(restX*YZStep,2));
		//////
		var minIpotinousaY = ipotinousaY*restY_new;
		
		var slopeY = Math.atan( Math.abs((dYZ/world.zScale - world.zShift)/YZStep) );
		//var slopeY = Math.atan( Math.abs((dYZ/world.zScale - world.zShift)/YZStep) );
		var multY = Math.sin(slopeY);
		
		var finalDYZ = minIpotinousaY*multY;
		if (dYZ<0){
		var heightY = (lyr[0].dem[0].data[axeZ]/world.zScale - world.zShift)+finalDYZ;
		}
		else{
		var heightY = (lyr[0].dem[0].data[axeZ]/world.zScale - world.zShift)-finalDYZ;
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
		var dXZ=(lyr[0].dem[0].data[axeZ] - lyr[0].dem[0].data[axeZ-1]);
		var ipotinousaX= Math.sqrt(Math.pow((dXZ/world.zScale - world.zShift),2)+Math.pow(XZStep,2));
		
		//////
			
		var restX_new=(1-restX)+(1-restY);
		var IpotinousaDiagwniou2=Math.sqrt(Math.pow((1-restY)*YZStep,2)+Math.pow((1-restY)*XZStep,2));
		
		
		
		
		//////
		
		var minIpotinousaX = ipotinousaX*(restX_new);
		
		var slopeX = Math.atan( Math.abs((dXZ/world.zScale - world.zShift)/XZStep) );
		//var slopeX = Math.atan( (Math.abs(dXZ)/world.zScale - world.zShift)/XZStep) ;
		var multX = Math.sin(slopeX);
		
		
		
		var finalDXZ= minIpotinousaX*multX;
		if (dXZ<0){
		var heightX = (lyr[0].dem[0].data[axeZ]/world.zScale - world.zShift)+finalDXZ;
		}
		else{
		var heightX = (lyr[0].dem[0].data[axeZ]/world.zScale - world.zShift)-finalDXZ;
		}
		
		
		//check Y axis
		
		var dYZ=(lyr[0].dem[0].data[axeZ] - lyr[0].dem[0].data[axeZ-DemWidth]);
		var ipotinousaY= Math.sqrt(Math.pow((dYZ/world.zScale - world.zShift),2)+Math.pow(YZStep,2));
		//////
		var restY_new=(1-restY)+(1-restX);
		var IpotinousaDiagwniou1=Math.sqrt(Math.pow((1-restX)*XZStep,2)+Math.pow((1-restX)*YZStep,2));
		//////
		var minIpotinousaY = ipotinousaY*(restY_new);
		
		var slopeY = Math.atan( Math.abs((dYZ/world.zScale - world.zShift)/YZStep) );
		//var slopeY = Math.atan( Math.abs((dYZ/world.zScale - world.zShift)/YZStep) );
		var multY = Math.sin(slopeY);
		
		var finalDYZ= minIpotinousaY*multY;
		if (dYZ<0){
		var heightY = (lyr[0].dem[0].data[axeZ]/world.zScale - world.zShift)+finalDYZ;
		}
		else{
		var heightY = (lyr[0].dem[0].data[axeZ]/world.zScale - world.zShift)-finalDYZ;
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
return FHeight2.toFixed(4);
}
