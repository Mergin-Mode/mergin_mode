import React,{ useState,useEffect } from 'react';
import './ModelList.css';
import { connect } from "react-redux";

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
import {loadModel,changeSection,setModelLayer,setLayers,addModel} from "../actions";


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
                
                <button className="mm-btn" onClick={e=>props.addModel({d, scale,rotation,vector},props)} >Add To Scene</button>
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
    layers:state.api.layers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadModel:model =>dispatch(loadModel(model)),
    changeSection:section => dispatch(changeSection(section)),
    setModelLayer: layer => dispatch(setModelLayer(layer)),
    setLayers: layers => dispatch(setLayers(layers)),
    addModel: (options,props) => addModel(options,props)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelList);

