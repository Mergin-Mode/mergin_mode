import React,{ useState,useEffect } from 'react';
import './ModelList.css';
import { connect } from "react-redux";
import readXlsxFile from 'read-excel-file'

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
import {loadModel,changeSection} from "../actions";


function ModelList(props) {
  const [mode, setMode] = useState({});
  const [position, setPosition] = useState(JSON.stringify({}));
  const [scale, setScale] = useState(JSON.stringify({}));
  const [rotation, setRotation] = useState(JSON.stringify({}));

  useEffect(()=>{
    const newPosition = {}
    const newRotation = {}
    const newScale = {}
    const newMode = {}
    props.models.data.map(d=>{
      newPosition[d.id] = position[d.id] || JSON.stringify({x:0,y:0,z:0});
      newRotation[d.id] = rotation[d.id] || JSON.stringify({x:0,y:0,z:0});
      newScale[d.id] = scale[d.id] || JSON.stringify({x:1,y:1,z:1});
      newMode[d.id] = mode[d.id] || "info";
    })
    setPosition(newPosition);
    setRotation(newRotation);
    setScale(newScale);
    setMode(newMode);
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
                const mesh = d.mesh.clone();
                const pos = JSON.parse(position[d.id]);
                pos.x = Number(pos.x);
                pos.y = Number(pos.y);
                pos.z = Number(pos.z);
                const rot = JSON.parse(rotation[d.id]);
                rot.x = Number(rot.x);
                rot.y = Number(rot.y);
                rot.z = Number(rot.z);
                const sca = JSON.parse(scale[d.id]);
                sca.x = Number(sca.x);
                sca.y = Number(sca.y);
                sca.z = Number(sca.z);
                console.log(rot,sca,pos)
                mesh.rotation.set(rot.x,rot.y,rot.z);
                mesh.scale.set(sca.x,sca.y,sca.z);
                mesh.position.set(pos.x,pos.y,pos.z);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                props.scene.add(mesh)
              }} >Add To Scene</button>
                </React.Fragment>
                ):(
                <React.Fragment>
                  <label>Rotation</label>
                  <input onChange={e=>onChange(setRotation,d.id,rotation,e.target.value)} value={rotation[d.id]}/>
                  <label>Scale</label>
                  <input onChange={e=>onChange(setScale,d.id,scale,e.target.value)} value={scale[d.id]}/>
                  <label>Position</label>
                  <input onChange={e=>onChange(setPosition,d.id,position,e.target.value)} value={position[d.id]}/>
                  <input type="file" onChange={e=> {
                    console.log(e.target.files)
  readXlsxFile(e.target.files[0]).then((rows) => {
    console.log("in hre", rows)
    // `rows` is an array of rows
    // each row being an array of cells.
  })
}} />
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
    scene:state.api.scene
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadModel:model =>dispatch(loadModel(model)),
    changeSection:section => dispatch(changeSection(section))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelList);
