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
import {changeSection} from "../actions";



function LayerPanel (props) {
  const { keys } = props;
  const defaultExpandedKeys= keys;
  const defaultSelectedKeys = [];
  const defaultCheckedKeys = keys

  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
  };

  const onSelect = (selectedKeys, info) => {
    const title = info.node.title.toLowerCase();
    console.log('selected', selectedKeys, info);
    props.changeSection(selectedKeys.length ? title : null)
  };

  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
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
  },[props.layers])
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
          onExpand={onExpand}
          defaultSelectedKeys={defaultSelectedKeys}
          defaultCheckedKeys={defaultCheckedKeys}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={layers}
        />
      </div>
    );
}

const mapStateToProps = state => {
  return {
    layers:state.api.layers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeSection:section => dispatch(changeSection(section))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerPanel);
