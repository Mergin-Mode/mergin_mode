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
        const v = props.vectors.filter(vec => vec.id == e.target.value)[0].array[0];
        var positions = props.plane.geometry.attributes.position.array;
        var x, y, z, index;
        x = y = z = index = 0;

        for ( var i = 0, l = 100*100; i < l; i ++ ) {

            index ++; 
            index ++;
            if(i==0){
            positions[ index ++ ] = 200;

            }else {

            positions[ index ++ ] = (((v[i] ||[])[2]) || 0)*0.01;
            }

        }
        props.plane.geometry.attributes.position.needsUpdate = true;
        var loader = new THREE.TextureLoader();
          loader.crossOrigin = "";
          loader.load('../assets/ground-texture.png',
              function( texture ) {
                const material = new THREE.MeshBasicMaterial({map: texture});
                props.plane.material = material;
                props.plane.material.needsUpdate = true;
              },
              function () {},  // onProgress function
              function ( error ) { console.log( error ) } // onError function
          );
        props.setPlane(v)
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
    plane: state.api.plane.mesh
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPlane: array => dispatch(setPlane({dem:array}))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelList);
