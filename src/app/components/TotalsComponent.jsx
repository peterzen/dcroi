import React from 'react';
import numeral from 'numeral';

export default class TotalsComponent extends React.Component {

  render() {

    let totals = this.props.datastore.getTotals();

    return (
      <section>
        <div className="row mb-3">
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <h3 className="text-muted">Tickets</h3>
                <div className="row">
                  <div className="col-sm-4">
                    <h3>{numeral(totals.ticketVoteCount).format('0,0')}</h3>
                    <p className="mb-0 text-uppercase">Voted </p>
                  </div>
                  <div className="col-sm-4">
                    <h3>{numeral(totals.liveTickets).format('0,0')}</h3>
                    <p className="mb-0 text-uppercase">Live </p>
                  </div>
                  <div className="col-sm-4">
                    <h3>{numeral(totals.ticketRevokeCount).format('0,0')}</h3>
                    <p className="mb-0 text-uppercase">Revoked </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <h3 className="text-muted">Rewards</h3>
                <div className="row">
                  <div className="col-sm-8">
                    <h3>{numeral(totals.rewardAmt).format('0,0.00')}
                      <small className="text-muted">DCR</small>
                    </h3>
                    <p className="mb-0 text-uppercase">&sum; rewards</p>
                  </div>
                  <div className="col-sm-4">
                    <h3>{numeral(totals.returnPct).format('0.00%')}</h3>
                    <p className="mb-0 text-uppercase">Return %</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

}
