import React,{ useState,useEffect } from 'react';
// import './Background.css';
import { connect } from "react-redux";

import {loadModel,changeSection,setModelLayer,setLayers} from "../actions";


function Background(props) {
 

  return (
    <div className="Background container">
      <div className="row">
      Background
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
    layers:state.api.layers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadModel:model =>dispatch(loadModel(model)),
    changeSection:section => dispatch(changeSection(section)),
    setModelLayer: layer => dispatch(setModelLayer(layer)),
    setLayers: layers => dispatch(setLayers(layers))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Background);

