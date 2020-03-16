import React,{ useState,useEffect } from 'react';
import './ModelList.css';
import { connect } from "react-redux";
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
  const [position, setPosition] = useState(JSON.stringify({x:0,y:0,z:0}));
  const [scale, setScale] = useState(JSON.stringify({x:1,y:1,z:1}));
  const [rotation, setRotation] = useState(JSON.stringify({x:0,y:0,z:0}));

  const onChange = (func,value) => func(value);

  return (
    <div className="ModelList">
      <h3>{props.title}</h3>
      <input value={position} onChange={e=>onChange(setPosition,e.target.value)}/>
      <input value={rotation} onChange={e=>onChange(setRotation,e.target.value)}/>
      <input value={scale} onChange={e=>onChange(setScale,e.target.value)}/>
      {props.models.data.map(d=>(
        <div className="model-item col-md-3 col-sm-6 col-xs-12">
          <div>id: {d.id}</div>
          <div>name: {d.name}</div>
          <div>size: {(d.size/1000/1000).toFixed(2)} Mb</div>
          <button onClick={()=>{
            const mesh = d.mesh.clone();
            const pos = JSON.parse(position);
            pos.x = Number(pos.x);
            pos.y = Number(pos.y);
            pos.z = Number(pos.z);
            const rot = JSON.parse(rotation);
            rot.x = Number(rot.x);
            rot.y = Number(rot.y);
            rot.z = Number(rot.z);
            const sca = JSON.parse(scale);
            sca.x = Number(sca.x);
            sca.y = Number(sca.y);
            sca.z = Number(sca.z);
            mesh.rotation.set(rot.x,rot.y,rot.z);
            mesh.scale.set(sca.x,sca.y,sca.z);
            mesh.position.set(pos.x,pos.y,pos.z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            props.scene.add(mesh)
          }} >Add To Scene</button>
        </div>

        ))}
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
