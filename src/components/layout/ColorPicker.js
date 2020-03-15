/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,
no-alert, no-console, react/no-find-dom-node */
import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';

class ColorPicker extends React.Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    const { keys } = props;
    this.state = {
      clicked: false,
      color:"#000"
    };

  }

  render() {
    if(this.state.clicked) {
      return <SketchPicker />
    }
    return <div style={{
      backgroundColof:this.state.color,
      border:"3px solid whitesmoke",
      borderRadius:"4px",
      width:"16px",
      height:"16px",
      float:"right"
    }}></div>
  }
}

export default ColorPicker;