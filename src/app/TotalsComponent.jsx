
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
              <h2>{numeral(totals.ticketVoteCount).format('0,0')}</h2>
              <p className="mb-0 text-muted text-uppercase">Tickets voted</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <h2>{numeral(totals.liveTickets).format('0,0')}</h2>
              <p className="mb-0 text-muted text-uppercase">Live tickets</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card  mb-2">
            <div className="card-body">
              <h2>{numeral(totals.rewardAmt).format('0,0.00')} <small className="text-muted">DCR</small></h2>
              <p className="mb-0 text-muted text-uppercase">&sum; rewards</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <h2>{numeral(totals.returnPct).format('0.00%')}</h2>
              <p className="mb-0 text-muted text-uppercase">Return %</p>
            </div>
          </div>
        </div>
      </div>

    )
  }

}
