import React,{ useState,useEffect } from 'react';
// import './Color.css';

import { connect } from "react-redux";
import * as THREE from 'three';
import { ChromePicker } from 'react-color';

import {loadModel,changeSection,setModelLayer,setLayers,setBackgroundColor} from "../actions";


function Color(props) {
  const [color,setColor] = useState(props.backgroundColor);
  const handleComplete = color => {
    setColor(color.hex);
    props.setBackgroundColor(color.hex);
    props.scene.background = new THREE.Color( color.hex );
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
    vectors:state.api.vectors.data,
    layers:state.api.layers,
    backgroundColor:state.api.background.color
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadModel:model =>dispatch(loadModel(model)),
    changeSection:section => dispatch(changeSection(section)),
    setModelLayer: layer => dispatch(setModelLayer(layer)),
    setLayers: layers => dispatch(setLayers(layers)),
    setBackgroundColor: color => dispatch(setBackgroundColor(color)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Color);

