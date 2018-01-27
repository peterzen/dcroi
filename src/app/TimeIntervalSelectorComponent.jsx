import React from "react";

import EventEmitterSingleton from './EventEmitter';

export default class TimeIntervalSelectorComponent extends React.Component {

  constructor(props) {
    super(props);
    this.eventEmitter = EventEmitterSingleton.getInstance();

    this.state = {
      value: 'This week',
    };

    this.handleChange = this.handleChange.bind(this);
  }


  render() {
    return (
      <div className="dropdown">
        <button className="btn btn-outline-secondary dropdown-toggle" id="period-selector-dropdown"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="fa fa-calendar"/>&nbsp;
          {this.state.value}
        </button>

        <div className="dropdown-menu" aria-labelledby="period-selector-dropdown">
          <a className="dropdown-item" href="#" data-value="This week" onClick={this.handleChange}>This
            week</a>
          <a className="dropdown-item" href="#" data-value="This month" onClick={this.handleChange}>This
            month</a>
          <a className="dropdown-item" href="#" data-value="All time" onClick={this.handleChange}>All
            time</a>
        </div>
      </div>
    );
  }

  handleChange(e) {
    const value = e.target.getAttribute('data-value');
    this.eventEmitter.emit('timeintervalselector:changed', value);
    this.setState({
      value: value
    });
    this.render();
  }


  // componentIsMounted(){
  //
  // }
  //
  // componentWillDismount() {
  //
  // }
  //

}
