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
  return (
    <div className="ModelList">
      <h3>{props.title}</h3>
      {props.models.data.map(d=>(
        <div className="model-item col-md-3 col-sm-6 col-xs-12">
        <div>id: {d.id}</div>
        <div>name: {d.name}</div>
        <div>size: {(d.size/1000/1000).toFixed(2)} Mb</div>
        </div>
        ))}
    </div>
  );
}


const mapStateToProps = state => {
  return {
    models:state.api.models,
    title:state.api.section.title
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
