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

  componentDidMount() {
    const form = $('#address-input-form');
    const $inputField = form.find('input');
    this.setState({
      input: $inputField
    });
    $inputField.focus();

    $inputField.on('focus', function(){
      this.select();
    });
  }

  componentWillDismount(){
    this.state.input.off('focus');
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

  render() {
    return (
      <div className="w-100">
        <form className="" id="address-input-form">
          <div className="form-group row">
            <label className="col-sm-4 col-form-label col-form-label-lg" htmlFor="votingWalletAddress">Your voting
              wallet address</label>
            <div className="col-sm-8">
              <input type="text"
                     className="form-control form-control-lg mr-sm-2"
                     id="votingWalletAddress"
                     placeholder="Ds...."
                     autoComplete="off"
                     aria-label="DCR voting wallet address"
                     onChange={this.onInputChanged} size="35"/>
              <div className="invalid-feedback">
                Invalid Decred address (pool addresses are not supported).
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
