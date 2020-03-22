import React,{ useState,useEffect } from 'react';
import './ModelList.css';
import { connect } from "react-redux";
import * as THREE from 'three';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils.js';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
import createWorld from "../helpers/createWorld";
import SplitPane from 'react-split-pane';
import Modal from "react-modal";
import LayerPanel from "./LayerPanel"
import {loadModel,changeSection,setModelLayer} from "../actions";


function ModelList(props) {
  const [mode, setMode] = useState({});
  const [position, setPosition] = useState(JSON.stringify({}));
  const [scale, setScale] = useState(JSON.stringify({}));
  const [rotation, setRotation] = useState(JSON.stringify({}));
  const [vector, setVector] = useState({});

  useEffect(()=>{
    const newPosition = {}
    const newRotation = {}
    const newScale = {}
    const newMode = {}
    const newVector = {}
    props.models.data.map(d=>{
      newPosition[d.id] = position[d.id] || JSON.stringify({x:0,y:0,z:0});
      newRotation[d.id] = rotation[d.id] || JSON.stringify({x:0,y:0,z:0});
      newScale[d.id] = scale[d.id] || JSON.stringify({x:1,y:1,z:1});
      newMode[d.id] = mode[d.id] || "info";
      newVector[d.id] = vector[d.id] || 0;
    })
    setPosition(newPosition);
    setRotation(newRotation);
    setScale(newScale);
    setMode(newMode);
    setVector(newVector);
  },[props.models.data])
  const onChange = (func,id,oldState,value) => func({...oldState,[id]:value});

  return (
    <div className="ModelList container">
      <h3>{props.title}</h3>
      <div className="row">
      {props.models.data.map(d=>(
        <div className="col-md-6 col-sm-6 col-xs-12">
          <div className="model-item">
            {mode[d.id] === "info" ? (<span className="settings" onClick={()=>onChange(setMode,d.id,mode,"settings")}> 
                          <i className="fas fa-cog"></i>
                        </span> ) : (<span className="settings" onClick={()=>onChange(setMode,d.id,mode,"info")}> 
                          <i className="fas fa-arrow-right"></i>
                        </span>)}
            
            <div className="model-item-inner">
              {mode[d.id] === "info" ? (
                <React.Fragment>
                <div>id: {d.id}</div>
              <div>name: {d.name}</div>
              <div>size: {(d.size/1000/1000).toFixed(2)} Mb</div>
              <button style ={{width:"100%"}}className="btn btn-light" onClick={()=>{
                const theVector = props.vectors.filter(v=>{
                  return v.id == vector[d.id]
                }
                )[0];

                if (theVector.name.includes("anime")){
                  let mesh;
                  if(d.name.includes("glb") || d.name.includes("gltf")){
                    mesh = SkeletonUtils.clone( d.mesh.scene );
                    var mixer = startAnimation( mesh, d.mesh.animations, "Walk" );
                    window.mergin_mode.mixers.push(mixer)
                  } else {
                    mesh = d.mesh.clone();

                  }
                  const rot = JSON.parse(rotation[d.id]);
                  rot.x = Number(rot.x);
                  rot.y = Number(rot.y);
                  rot.z = Number(rot.z);
                  const sca = JSON.parse(scale[d.id]);
                  sca.x = Number(sca.x);
                  sca.y = Number(sca.y);
                  sca.z = Number(sca.z);
                  // mesh.rotation.set(rot.x,rot.y,rot.z);
                  const axisX = new THREE.Vector3(1, 0, 0);
                  const axisY = new THREE.Vector3(0, 1, 0);
                  const axisZ = new THREE.Vector3(0, 0, 1);
                  mesh.rotateOnWorldAxis(axisX, rot.x);
                  mesh.rotateOnWorldAxis(axisY, rot.y);
                  // mesh.rotateOnWorldAxis(axisZ, rot.z);
                  mesh.rotateOnWorldAxis(axisZ, (-theVector.array[0][0][3] )/63.6619772367581);
                  // mesh.rotation.z = ((theVector.array[0][0][3])/63.6619772367581);

                  mesh.scale.set(sca.x,sca.y,sca.z);
                  mesh.position.set(...theVector.array[0][0]);
                  mesh.castShadow = true;
                  mesh.receiveShadow = true;
                  props.scene.add(mesh);
                  props.setModelLayer({
                    id:Date.now(),
                    vectorId:theVector.id,
                    runtimeInfo:{animating:true,activeRow:0},
                    mesh
                  });
                  return false;
                }

                theVector.array[0].map(r=>{
                  let mesh;
                  if(d.name.includes("glb") || d.name.includes("gltf")){
                  mesh = SkeletonUtils.clone( d.mesh.scene );

                  } else {
                    mesh = d.mesh.clone();
                  }
                  // const pos = JSON.parse(position[d.id]);
                  // pos.x = Number(pos.x);
                  // pos.y = Number(pos.y);
                  // pos.z = Number(pos.z);
                  const rot = JSON.parse(rotation[d.id]);
                  rot.x = Number(rot.x);
                  rot.y = Number(rot.y);
                  rot.z = Number(rot.z);
                  const axisX = new THREE.Vector3(1, 0, 0);
                  const axisY = new THREE.Vector3(0, 1, 0);
                  const axisZ = new THREE.Vector3(0, 0, 1);
                  mesh.rotateOnWorldAxis(axisX, rot.x);
                  mesh.rotateOnWorldAxis(axisY, rot.y);
                  mesh.rotateOnWorldAxis(axisZ, rot.z);
                  // mesh.rotateOnWorldAxis(axisZ, ( )/63.6619772367581);

                  const sca = JSON.parse(scale[d.id]);
                  sca.x = Number(sca.x);
                  sca.y = Number(sca.y);
                  sca.z = Number(sca.z);
                  // mesh.rotation.set(rot.x,rot.y,rot.z);

                  mesh.scale.set(sca.x,sca.y,sca.z);
                  mesh.position.set(...r);
                  mesh.castShadow = true;
                  mesh.receiveShadow = true;
                  props.scene.add(mesh)
                })
                
              }} >Add To Scene</button>
                </React.Fragment>
                ):(
                <React.Fragment>
                  <label>Rotation</label>
                  <input onChange={e=>onChange(setRotation,d.id,rotation,e.target.value)} value={rotation[d.id]}/>
                  <label>Scale</label>
                  <input onChange={e=>onChange(setScale,d.id,scale,e.target.value)} value={scale[d.id]}/>
                  <label>Position</label>
                  {/*<input onChange={e=>onChange(setPosition,d.id,position,e.target.value)} value={position[d.id]}/>*/}
                  <select onChange={e=> {
                    onChange(setVector,d.id,vector,e.target.value)
                  }}>
                    <option value={0} selected={vector[d.id] == 0}>Select</option>
                    {props.vectors.map(v=><option value={v.id} selected={vector[d.id] == v.id}>{v.name}</option>)}
                  </select>
                </React.Fragment>
                )}
              
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}


const mapStateToProps = state => {
  return {
    models:state.api.models,
    title:state.api.section.title,
    scene:state.api.scene,
    vectors:state.api.vectors.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadModel:model =>dispatch(loadModel(model)),
    changeSection:section => dispatch(changeSection(section)),
    setModelLayer: layer => dispatch(setModelLayer(layer))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelList);

function startAnimation( skinnedMesh, animations, animationName ) {

        var mixer = new THREE.AnimationMixer( skinnedMesh );
        var clip = THREE.AnimationClip.findByName( animations, animationName );

        if ( clip ) {

          var action = mixer.clipAction( clip );
          action.play();

        }

        return mixer;

      }