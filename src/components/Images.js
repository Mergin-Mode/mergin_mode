import React,{ useState,useEffect } from 'react';
// import './Images.css';

import { connect } from "react-redux";
import * as THREE from 'three';
import Slider from './layout/Slider';

import {loadModel,changeSection,setModelLayer,setLayers} from "../actions";


function Images(props) {
  return (
    <div className="Images container">
      <div className="row">
        <Slider 
          onClick={src=>{

            if(src === "../assets/banned.png") {
              props.scene.remove(props.sky);
              return true;
            }
            var loader = new THREE.TextureLoader();
            loader.crossOrigin = "";
            loader.load(src,
                  function( texture ) {
                    props.sky.material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
                    props.sky.material.needsUpdate = true;
                    props.scene.add(props.sky)  
                  },
                  function () {},  // onProgress function
                  function ( error ) { console.log( error ) } // onError function
              );
          }}
          slides={[
            {src:"../assets/banned.png",legend:"No Image"},
            {src:"../assets/sky.jpg",legend:"Sky"},
            {src:"../assets/night-sky.jpg",legend:"Night Sky"},
            {src:"../assets/fantasy.jpg",legend:"Fantasy Sky"},
            ]}
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
    sky:state.api.sky.mesh,
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
)(Images);

