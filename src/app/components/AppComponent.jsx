import React from "react";
import $ from 'jquery';

import TotalsComponent from './TotalsComponent.jsx';
import TimeIntervalSelectorComponent from "./TimeIntervalSelectorComponent.jsx";
import TimeResolutionSelectorComponent from './TimeResolutionSelectorComponent.jsx';
import ChartsComponent from "./ChartsComponent.jsx";

export default class AppComponent extends React.Component {

  render() {

    return (
      <section>
        <hr/>
        <div className="row mt-5">
          <div className="col-sm-6 mb-5">
            <TimeIntervalSelectorComponent/>
          </div>

          <div className="col-sm-6">
            <TimeResolutionSelectorComponent/>
          </div>
        </div>

        <TotalsComponent datastore={this.props.datastore}/>

        <ChartsComponent datastore={this.props.datastore}/>

      </section>
    );
  }
}
