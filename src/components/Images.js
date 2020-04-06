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
            console.log(src)
            var loader = new THREE.TextureLoader();
            loader.crossOrigin = "";
            loader.load(src,
                  function( texture ) {
                    var geometry = new THREE.SphereGeometry( 150, 32, 32 );
                    var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
                    var sky = new THREE.Mesh( geometry, material );
                    sky.rotation.set(Math.PI/2,0,0)
                    props.scene.add(sky)

                  },
                  function () {},  // onProgress function
                  function ( error ) { console.log( error ) } // onError function
              );
          }}
          slides={[
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

