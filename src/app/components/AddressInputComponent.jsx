import React from "react";
import $ from 'jquery'

import EventEmitterSingleton from '../EventEmitter';

export default class AddressInputComponent extends React.Component {

  constructor(props) {
    super(props);
    this.eventEmitter = EventEmitterSingleton.getInstance();
    this.state = {};
    this.onInputChanged = this.onInputChanged.bind(this);
  }

  componentDidMount(){
    const form = $('#address-input-form');
    const inputField = form.find('input');
    this.setState({
      input: inputField
    });
    inputField.focus();
  }

  render() {
    return (
      <div className="w-100 text-center">
        <h4 className="">Enter voting wallet address</h4>
        <form className="form-inline  justify-content-center" id="address-input-form">
          <label className="sr-only" htmlFor="votingWalletAddress">Name</label>
          <input type="text" className="form-control form-control-lg mr-sm-2" id="votingWalletAddress" placeholder="Ds...."
                 aria-label="DCR voting wallet address" onChange={this.onInputChanged} size="35"/>

          <div className="invalid-feedback">
            Invalid Decred address.
          </div>
        </form>
      </div>
    );
  }

  onInputChanged(e) {
    e.preventDefault();
    const value = this.state.input.val();
    if (value.match(/^Ds[a-zA-Z0-9]{33}$/)) {
      this.state.input.removeClass('is-invalid');
      this.eventEmitter.emit('addressinput:changed', value);
    } else {
      this.state.input.addClass('is-invalid');
    }
  }
}
