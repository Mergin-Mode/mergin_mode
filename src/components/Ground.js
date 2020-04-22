import React,{ useState,useEffect } from 'react';
import { connect } from "react-redux";
import * as THREE from 'three';
import {setPlane,loadGround} from "../actions/index";
function ModelList(props) {
  const [vector, setVector] = useState(0);

  
  const onChange = vectorId => setVector(vectorId);

  return (
    <div className="ModelList container">
      <h3>{props.title}</h3>
      <select onChange={e=>{ props.loadGround(e.target.value,props)}}>
        <option value={0} selected={vector == 0}>Select</option>
        {props.vectors.map(v=><option value={v.id} selected={vector == v.id}>{v.name}</option>)}
      </select>
    </div>
  );
}


const mapStateToProps = state => {
  return {
    models:state.api.models,
    title:state.api.section.title,
    scene:state.api.scene,
    vectors:state.api.vectors.data,
    plane: state.api.plane.mesh,
    coords:state.api.plane.coords
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPlane: (array,coords) => dispatch(setPlane({dem:array,coords})),
    loadGround: (vecId) => dispatch(loadGround(vecId)),

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelList);
