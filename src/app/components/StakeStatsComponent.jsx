
import React from 'react';
import numeral from 'numeral';

export default class StakeStatsComponent extends React.Component {

  render(){

    let stats = this.props.stakeStatsData;

    return (
      <div className="row mb-3">
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <h2>{numeral(stats.currentstakediff.current).format('0,0.00')} <small className="text-muted">DCR</small></h2>
              <p className="mb-0 text-muted text-uppercase">Ticket price</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <h2>{numeral(stats.estimatestakediff.expected).format('0,0.00')} <small className="text-muted">DCR</small></h2>
              <p className="mb-0 text-muted text-uppercase">Est'd next ticket price</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <h2>{numeral(stats.block_header.poolsize).format('0,0')}</h2>
              <p className="mb-0 text-muted text-uppercase">POS pool size</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <h2>{numeral(stats.ticketfeeinfo_block.median).format('0.0000')} <small className="text-muted">DCR</small></h2>
              <p className="mb-0 text-muted text-uppercase">Average fee</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
