import React,{ useState,useEffect } from 'react';
import { connect } from "react-redux";
import * as THREE from 'three';
import {setPlane} from "../actions/index";
function ModelList(props) {
  const [vector, setVector] = useState(0);

  const onChange = vectorId => setVector(vectorId);

  return (
    <div className="ModelList container">
      <h3>{props.title}</h3>
      <select onChange={e=> {
        let v = props.vectors.filter(vec => vec.id == e.target.value)[0]
        if(!v) {return false;}
        v = v.array[0];
        var positions = props.plane.geometry.attributes.position.array;
        var x, y, z, index;
        x = y = z = index = 0;
        let l = v.length - 2;
        let min = {x:v[0][0],y:v[0][1],z:v[0][2]};
        let max = {x:v[l][0],y:v[l][1],z:v[l][2]};

        for ( var i = 0; i <= l; i ++ ) {
            index ++; 
            index ++;
            positions[ index ++ ] = (((v[i] ||[])[2]) || 0) - 50;
            if (min.z>v[i][2]){
              min.z = v[i][2];
            }
            if(max.z < v[i][2]){
              max.z = v[i][2]
            }
        }
        props.plane.geometry.attributes.position.needsUpdate = true;
        var loader = new THREE.TextureLoader();
          loader.crossOrigin = "";
          loader.load('../assets/cropped.png',
              function( texture ) {
                const material = new THREE.MeshBasicMaterial({map: texture});
                props.plane.material = material;
                props.plane.material.needsUpdate = true;
              },
              function () {},  // onProgress function
              function ( error ) { console.log( error ) } // onError function
          );
        
        var material = new THREE.MeshPhongMaterial( {
            color: "#000",
            polygonOffset: true,
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1
        } );
        props.plane.material = material;
        props.plane.material.needsUpdate = true;

        // var geo = new THREE.EdgesGeometry( props.plane.geometry ); // or WireframeGeometry
        // var mat = new THREE.LineBasicMaterial( { color: 0x999999, linewidth: 2 } );
        // var wireframe = new THREE.LineSegments( geo, mat );
        // props.plane.add( wireframe );
        props.setPlane(v,{min,max})

      }}>
        <option value={0} selected={vector == 0}>Select</option>
        {props.vectors.map(v=><option value={v.id} selected={vector == v.id}>{v.name}</option>)}
      </select>
    </div>
  );
}


const mapStateToProps = state => {
  return {
    models:state.api.models,
    title:state.api.section.title,
    scene:state.api.scene,
    vectors:state.api.vectors.data,
    plane: state.api.plane.mesh,
    coords:state.api.plane.coords
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPlane: (array,coords) => dispatch(setPlane({dem:array,coords})),

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelList);
