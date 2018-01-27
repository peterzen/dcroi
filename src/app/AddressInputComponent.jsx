import React from "react";

import EventEmitterSingleton from './EventEmitter';

export default class AddressInputComponent extends React.Component {

  constructor(props) {
    super(props);
    this.eventEmitter = EventEmitterSingleton.getInstance();
    this.state = {};
    this.onInputChanged = this.onInputChanged.bind(this);
  }


  render() {
    return (
      <input className="form-control form-control-dark " type="text"
             placeholder="Enter voting wallet address: Ds...." aria-label="DCR address" onChange={this.onInputChanged}/>
    );
  }

  onInputChanged(e) {
    if(e.target.value.match(/^Ds[a-zA-Z0-9]{33}$/)){
      this.eventEmitter.emit('addressinput:changed', e.target.value);
    }
  }

}
