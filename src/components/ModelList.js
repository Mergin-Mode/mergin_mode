import React,{ useState,useEffect } from 'react';
import './ModelList.css';
import { connect } from "react-redux";
import * as THREE from 'three';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils.js';
import InstancedGroupMesh from "three-instanced-group-mesh";
// import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier.js';
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
import {loadModel,changeSection,setModelLayer,setLayers} from "../actions";


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
      <div className="row">
      {props.models.data.map(d=>(
        <div className="col-md-6 col-sm-6 col-xs-12">
          <div className="model-item">
            {mode[d.id] === "info" ? (<span className="settings" onClick={()=>onChange(setMode,d.id,mode,"settings")}> 
                          <i className="fas fa-cog"></i>
                        </span> ) : (<span className="settings" onClick={()=>onChange(setMode,d.id,mode,"info")}> 
                          <i className="fas fa-arrow-right"></i>
                        </span>)}
            
              {mode[d.id] === "info" ? (
                <React.Fragment>
                <div className="mm-form-block">
                  <div>id: {d.id}</div>
                  <div>name: {d.name}</div>
                  <div>size: {(d.size/1000/1000).toFixed(2)} Mb</div>
                </div>
                
                <button className="mm-btn" onClick={()=>{
                  const theVector = props.vectors.filter(v=>{
                    return v.id == vector[d.id]
                  }
                  )[0];
                  if(!theVector) {
                    return false;
                  }
                  if (theVector.name.toLowerCase().includes("anime")){
                    let mesh;
                    if(d.name.toLowerCase().includes("glb") || d.name.toLowerCase().includes("gltf")){
                      mesh = SkeletonUtils.clone( d.mesh.scene );
                      var mixer = startAnimation( mesh, d.mesh.animations, "Take 001" );
                      window.mergin_mode.mixers.push(mixer)
                    } else {
                      mesh = d.mesh.clone();
                      var mixer = startAnimation( mesh.children[0], d.mesh.animations, "Take 001" );
                      window.mergin_mode.mixers.push(mixer)

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
                } else {

                   let mesh;
                    if(d.name.toLowerCase().includes("glb") || d.name.toLowerCase().includes("gltf")){
                    mesh = SkeletonUtils.clone( d.mesh.scene );

                    } else {
                      mesh = d.mesh.clone();
                    }

                    if(theVector.array[0].length > 2) {
                      
                            let new_mesh = new InstancedGroupMesh( mesh, theVector.array[0].length);
                            console.log(theVector.array[0].length)
                            for ( var i = 0; i < theVector.array[0].length - 1; i ++ ) {
                              var transform = new THREE.Object3D();
                              transform.frustumCulled = false;
                              const rot = JSON.parse(rotation[d.id]);
                              rot.x = Number(rot.x);
                              rot.y = Number(rot.y);
                              rot.z = Number(rot.z);
                              const axisX = new THREE.Vector3(1, 0, 0);
                              const axisY = new THREE.Vector3(0, 1, 0);
                              const axisZ = new THREE.Vector3(0, 0, 1);
                              transform.rotateOnWorldAxis(axisX, rot.x);
                              transform.rotateOnWorldAxis(axisY, rot.y);
                              transform.rotateOnWorldAxis(axisZ, rot.z);

                              const randomXY = Math.random() * 0.1;
                              const randomZ = Math.random() * 0.1 + 0.05;
                              const sca = JSON.parse(scale[d.id]);
                              sca.x = Number(sca.x) + randomXY;
                              sca.y = Number(sca.y) + randomXY;
                              sca.z = Number(sca.z) + randomZ;
                              transform.scale.set(sca.x,sca.y,sca.z);
                              transform.position.set( ...theVector.array[0][i] );
                              transform.updateMatrix();

                              new_mesh.setMatrixAt( i, transform.matrix );

                          }

                          props.scene.add( new_mesh )

                      // var geometry,material;
                      // mesh.traverse(function (node){
                      //   if (node.isMesh) {
                      //     geometry = node.geometry;
                      //     material = node.material;
                    
                      //      mesh = new THREE.InstancedMesh( geometry, material, theVector.array[0].length,
                      //       false, //is it dynamic 
                      //       false,  //does it have color 
                      //       true,  //uniform scale
                      //     );
                           
                      //      mesh.frustumCulled = false;
                      //     var i = 0;
                      //     for ( var i = 0; i < theVector.array[0].length; i ++ ) {
                      //       var transform = new THREE.Object3D();
                      //       const rot = JSON.parse(rotation[d.id]);
                      //       rot.x = Number(rot.x);
                      //       rot.y = Number(rot.y);
                      //       rot.z = Number(rot.z);
                      //       const axisX = new THREE.Vector3(1, 0, 0);
                      //       const axisY = new THREE.Vector3(0, 1, 0);
                      //       const axisZ = new THREE.Vector3(0, 0, 1);
                      //       transform.rotateOnWorldAxis(axisX, rot.x);
                      //       transform.rotateOnWorldAxis(axisY, rot.y);
                      //       transform.rotateOnWorldAxis(axisZ, rot.z);

                      //       const sca = JSON.parse(scale[d.id]);
                      //       sca.x = Number(sca.x);
                      //       sca.y = Number(sca.y);
                      //       sca.z = Number(sca.z);
                      //       transform.scale.set(sca.x,sca.y,sca.z);
                      //       transform.position.set( ...theVector.array[0][i] );
                      //       transform.updateMatrix();

                      //       mesh.setMatrixAt( i ++, transform.matrix );

                      //     }

                      //     props.scene.add( mesh )
                      //   }
                      // })
                    } else {

                      theVector.array[0].map(r=>{
                       if(r.length == 0) {return false;}
                       if(theVector.name.includes("new")) {
                          mesh.traverse(function (node){
                          if (node.isMesh) {
                            node.material.transparent = true;
                            node.material.opacity = 0.5;
                            node.material.needsUpdate = true;
                          }})
                       } else {
                         // var modifier = new SimplifyModifier();
                          mesh.traverse(function (node){
                          if (node.isMesh) {
                            node.material.transparent = true;
                            node.material.opacity = 0.5;
                            // node.material.flatShading = true;
                            node.material.needsUpdate = true;
                            // var count = Math.floor( node.geometry.attributes.position.count * 0.875 ); // number of vertices to remove
                            // node.geometry = modifier.modify( node.geometry, count );
                          }})
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
                        mesh.rotation.set(rot.x,rot.y,rot.z);

                        mesh.scale.set(sca.x,sca.y,sca.z);
                      

                        mesh.position.set(...r);
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        // if(theVector.name.includes("loutro")){
                        //   mesh.traverse(function (node){
                        //   if (node.isMesh) {
                        //     if(node.material.map && node.geometry.boundingBox){
                        //       node.material.map.wrapS = THREE.RepeatWrapping;
                        //       node.material.map.wrapT = THREE.RepeatWrapping;
                        //       const p1 = node.geometry.boundingBox.min;
                        //       const p2 = node.geometry.boundingBox.max;
                        //       const d = parseInt(Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2) + Math.pow(p1.z - p2.z,2)));
                        //       node.material.map.repeat.set( d,d );
                        //     }
                        //   }})
                        // }
                         window.meshes = window.meshes || []
                         window.meshes.push (mesh)
                        props.scene.add(mesh)
                      });
                    }
                }
                const newLayers = [...props.layers];
                newLayers[1].children[3].children.push({ key: `1-3-${newLayers[1].children[3].children.length}`, title: d.name + "_" + theVector.name, checkable:true,selectable:false})
                props.setLayers(newLayers);
                
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