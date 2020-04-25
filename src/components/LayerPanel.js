/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,
no-alert, no-console, react/no-find-dom-node */
import React,{ useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import 'rc-tree/assets/index.css';
import './LayerPanel.css';
import Tree, { TreeNode } from "rc-tree";
import ColorPicker from "./layout/ColorPicker";
import { SketchPicker } from 'react-color';
import { connect } from "react-redux";
import {changeSection,toggleLayer,setLayers} from "../actions";



function LayerPanel (props) {
  const defaultExpandedKeys = props.keys;
  const defaultSelectedKeys = [];
  const defaultCheckedKeys = props.keys

  const [keys, setKeys] = useState(props.keys);
  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
  };

  const onSelect = (selectedKeys, info) => {
    const title = info.node.key;
    console.log('selected', selectedKeys, info);
    props.changeSection(selectedKeys.length ? title : null)
  };

  const onCheck = (checkedKeys, info) => {
    // console.log(keys,'onCheck', checkedKeys, info);
    // keys = checkedKeys.checked;
    // console.log(keys)
    // console.log(keys.includes(info.node.key),keys,info.node.key,keys.indexOf(info.node.key))
    const newLayers = {...layers};
    layers.checked.includes(info.node.key) ? layers.checked.splice(layers.checked.indexOf(info.node.key),1) : layers.checked.push(info.node.key)
    props.setLayers(newLayers);
    toggleLayer({
      name:info.node.key,
      ...props
    },info.checked);
  };

  const onEdit = () => {
    setTimeout(() => {
    }, 0);
  };

  const onDel = e => {
    if (!window.confirm('sure to delete?')) {
      return;
    }
    e.stopPropagation();
  };

  const [layers,setLayers] = useState(props.layers)

  useEffect(()=>{
    setLayers(props.layers);
    console.log(layers.tree,layers.checked)
  },[props.layers]);

  useEffect(()=>{
    setKeys(props.keys)
  },[props.keys])

  const customLabel = (
      <span className="cus-label">
        <span>operations: </span>
        <span style={{ color: 'blue' }} onClick={onEdit}>
          Edit
        </span>
        &nbsp;
        <label onClick={e => e.stopPropagation()}>
          <input type="checkbox" /> checked
        </label>
        &nbsp;
        <span style={{ color: '#EB0000' }} onClick={onDel}>
          Delete
        </span>
      </span>
    );
    

    return (
      <div className="layers-panel" style={{ margin: '0 20px' }}>
        <Tree
          className="myCls"
          showLine={true}
          checkable={true}
          multiple={false}
          checkStrictly={true}
          selectable={true}
          defaultExpandAll={true}
          checkedKeys={layers.checked}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={layers.tree}
        />
      </div>
    );
}

const mapStateToProps = state => {
  return {
    keys:state.api.keys,
    layers:state.api.layers,
    scene:state.api.scene,
    plane:state.api.plane.mesh,
    sky:state.api.sky.mesh,
    gridHelper:state.api.plane.gridHelper,
    backgroundColor:state.api.background.color,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeSection:section => dispatch(changeSection(section)),
    setLayers:layers => dispatch(setLayers(layers)),
    toggleLayer
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerPanel);
