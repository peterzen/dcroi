import React from "react";
import $ from 'jquery';

import EventEmitterSingleton from '../EventEmitter';

export default class TimeResolutionSelectorComponent extends React.Component {

  constructor(props) {
    super(props);
    this.eventEmitter = EventEmitterSingleton.getInstance();

    this.state = {
      value: 'month'
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({
       value: value
    });
    this.eventEmitter.emit('resolutionselector:changed', value);
  }

  componentDidMount() {
    const $buttons = $('#resolution-select-buttons');
    this.setState({
      $buttons: $buttons
    });
    $buttons.on('change', this.handleChange.bind(this));
  }

  componentWillUnmount(){
    this.state.$buttons.off();
    this.state.$buttons.button('destroy');
  }


  render() {
    return (
      <div className="btn-toolbar mb-5 text-right">
        <div className="btn-group btn-group-toggle pull-right text-right" data-toggle="buttons" id="resolution-select-buttons">
          <label className="btn btn-outline-secondary active">
            <input type="radio"
                   name="options"
                   value="day"
                   id="option1"
                   autoComplete="off"
                   checked={this.state.value === "day"}
                   onChange={this.handleChange}
            /> Daily
          </label>
          <label className="btn btn-outline-secondary">
            <input type="radio"
                   name="options"
                   id="option2"
                   value="week"
                   autoComplete="off"
                   checked={this.state.value === 'week'}
                   onChange={this.handleChange}
            /> Weekly
          </label>
          <label className="btn btn-outline-secondary">
            <input type="radio"
                   name="options"
                   id="option3"
                   value="month"
                   autoComplete="off"
                   checked={this.state.value === 'month'}
                   onChange={this.handleChange}
            /> Monthly
          </label>
        </div>
      </div>
    );
  }

}
