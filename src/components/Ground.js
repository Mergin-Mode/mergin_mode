import React,{ useState,useEffect } from 'react';
import { connect } from "react-redux";
import * as THREE from 'three';

function ModelList(props) {
  const [vector, setVector] = useState(0);

  const onChange = vectorId => setVector(vectorId);

  return (
    <div className="ModelList container">
      <h3>{props.title}</h3>
      <select onChange={e=> {
        // onChange(setVector,e.target.value)
        const v = props.vectors.filter(vec => vec.id == e.target.value)[0].array[0];
        // const newArray = [];
        // v.map(a=>{newArray = newArray.concat(v)});
        // geometry.setAttribute( 'position', new THREE.BufferAttribute( newArray, 3 ) );
        // props.plane.geometry =
        // const generateTerrain = (g) => {
        //   const pos = g.getAttribute("position");
        //   const pa = pos.array;
        //   const hVerts = g.parameters.width;
        //   const wVerts = g.parameters.height;
        //   for (let j = 2,i=0; j < pa.length; j+=3,i++) {
        //       pa[j] = 0;
        //   }
        //   pos.needsUpdate = true;
        //   g.computeVertexNormals();
        // };
        var positions = props.plane.geometry.attributes.position.array;
        var x, y, z, index;
        x = y = z = index = 0;

        for ( var i = 0, l = 100*100; i < l; i ++ ) {

            index ++; 
            index ++; 
            positions[ index ++ ] = (((v[i] ||[])[2]) || 0)*0.01;

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
        
        // world
        // generateTerrain(props.plane.geometry);
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
    plane: state.api.plane
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelList);
