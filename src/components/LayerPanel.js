/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,
no-alert, no-console, react/no-find-dom-node */
import React from 'react';
import PropTypes from 'prop-types';
import 'rc-tree/assets/index.css';
import './LayerPanel.css';
import Tree, { TreeNode } from "rc-tree";
import ColorPicker from "./layout/ColorPicker";
import { SketchPicker } from 'react-color';

const treeData = [
  {
    key: '0-0',
    title: 'Scene',
    checkable:false,
    selectable:false,
    children: [
      { key: '0-0-0', title: 'Background',checkable:false,selectable:false,children: [{ key: '0-0-0-0', title: 'Color'},{ key: '0-0-0-1', title: 'Image' },{ key: '0-0-0-2', title: 'Video' }] },
      {
        key: '0-0-1',
        title: 'Ground',
        checkable:false,
        selectable:false,
        children: [
          { key: '0-0-1-0', title: 'Color'},
          { key: '0-0-1-1', title: 'Image' },
          { key: '0-0-1-2', title: 'Vertices' },
        ],
      },
    ],
  },
];

class Demo extends React.Component {
  static propTypes = {
    keys: PropTypes.array,
  };

  static defaultProps = {
    keys: ['0-0-0-0'],
  };

  constructor(props) {
    super(props);
    const { keys } = props;
    this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: [],
      defaultCheckedKeys: keys,
    };

    this.treeRef = React.createRef();
  }

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
  };

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    this.selKey = info.node.props.eventKey;
  };

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  onEdit = () => {
    setTimeout(() => {
      console.log('current key: ', this.selKey);
    }, 0);
  };

  onDel = e => {
    if (!window.confirm('sure to delete?')) {
      return;
    }
    e.stopPropagation();
  };

  setTreeRef = tree => {
    this.tree = tree;
  };

  render() {
    const customLabel = (
      <span className="cus-label">
        <span>operations: </span>
        <span style={{ color: 'blue' }} onClick={this.onEdit}>
          Edit
        </span>
        &nbsp;
        <label onClick={e => e.stopPropagation()}>
          <input type="checkbox" /> checked
        </label>
        &nbsp;
        <span style={{ color: '#EB0000' }} onClick={this.onDel}>
          Delete
        </span>
      </span>
    );

    return (
      <div style={{ margin: '0 20px' }}>
        <Tree
          className="myCls"
          showLine={true}
          checkable={true}
          multiple={false}
          checkStrictly={true}
          selectable={true}
          defaultExpandAll={true}
          onExpand={this.onExpand}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          treeData={treeData}
        />
      </div>
    );
  }
}

export default Demo;