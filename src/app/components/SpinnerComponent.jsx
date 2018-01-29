
import React from 'react';

export default class SpinnerComponent extends React.Component {

  render(){

    return (
      <div className="w-100 justify-content-center text-center mt-5">
        <i className="fa fa-4x fa-spin fa-circle-o-notch text-muted"/>

        <p className="text-muted">Loading transactions...</p>
      </div>
    );
  }

}
