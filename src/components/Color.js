import React,{ useState,useEffect } from 'react';
// import './Color.css';

import { connect } from "react-redux";
import * as THREE from 'three';
import { ChromePicker } from 'react-color';

import {loadModel,changeSection,setModelLayer,setLayers,setBackgroundColor,setGroundColor} from "../actions";


function Color(props) {
  const [color,setColor] = useState(props.type === "background" ? props.backgroundColor : props.groundColor);
  useEffect(()=>setColor(props.type === "background" ? props.backgroundColor : props.groundColor),[props.type]);

  const handleComplete = color => {
    setColor(color.hex);
    if(props.type === "background") {
      props.setBackgroundColor(color.hex);
      props.scene.background = new THREE.Color( color.hex );  
    } else {
      props.setGroundColor(color.hex);
      props.plane.material.color = new THREE.Color( color.hex );  
    }
    
  };

  return (
    <div className="Color container">
      <div className="row">
        <ChromePicker 
        color={color}
        onChange={handleComplete}
        />
      </div>
    </div>
  );
}


const mapStateToProps = state => {
  return {
    models:state.api.models,
    title:state.api.section.title,
    scene:state.api.scene,
    plane:state.api.plane.mesh,
    vectors:state.api.vectors.data,
    layers:state.api.layers,
    backgroundColor:state.api.background.color,
    groundColor:state.api.plane.color,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadModel:model =>dispatch(loadModel(model)),
    changeSection:section => dispatch(changeSection(section)),
    setModelLayer: layer => dispatch(setModelLayer(layer)),
    setLayers: layers => dispatch(setLayers(layers)),
    setBackgroundColor: color => dispatch(setBackgroundColor(color)),
    setGroundColor: color => dispatch(setGroundColor(color)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Color);

