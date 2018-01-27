import React from "react";

import EventEmitterSingleton from './EventEmitter';

export default class TimeResolutionSelectorComponent extends React.Component {

  constructor(props) {
    super(props);
    this.eventEmitter = EventEmitterSingleton.getInstance();

    this.state = {
      value: 'day'
    };

    this.handleChange = this.handleChange.bind(this);
  }


  render() {
    return (
      <div className="btn-toolbar mb-5 text-right">
        <div className="btn-group btn-group-toggle pull-right text-right" data-toggle="buttons">
          <label className="btn btn-outline-secondary active">
            <input type="radio" name="options" value="day" id="option1" autoComplete="off"
                   onChange={this.handleChange} checked/> Daily
          </label>
          <label className="btn btn-outline-secondary">
            <input type="radio" name="options" value="week" autoComplete="off"
                   onChange={this.handleChange}/> Weekly
          </label>
          <label className="btn btn-outline-secondary">
            <input type="radio" name="options" value="month" autoComplete="off"
                   onChange={this.handleChange}/> Monthly
          </label>
        </div>
      </div>
    );
  }

  handleChange(e) {
    const value = e.target.getAttribute('data-value');
    this.eventEmitter.emit('resolutionselector:changed', value);
  }


}
