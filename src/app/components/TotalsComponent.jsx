
import React from 'react';
import numeral from 'numeral';

export default class TotalsComponent extends React.Component {

  render(){

    let totals = this.props.totals;

    return (
      <div className="row mb-3">
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <p className="mb-0 text-uppercase">Tickets voted</p>
              <h3>{numeral(totals.ticketVoteCount).format('0,0')}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <p className="mb-0 text-uppercase">Live tickets</p>
              <h3>{numeral(totals.liveTickets).format('0,0')}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card  mb-2">
            <div className="card-body">
              <p className="mb-0 text-uppercase">&sum; rewards</p>
              <h3>{numeral(totals.rewardAmt).format('0,0.00')} <small className="text-muted">DCR</small></h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <p className="mb-0 text-uppercase">Return %</p>
              <h3>{numeral(totals.returnPct).format('0.00%')}</h3>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
