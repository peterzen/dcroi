
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
              <p className="mb-0 text-uppercase">Ticket price</p>
              <h3>{numeral(stats.diff.current).format('0,0.00')} <small className="text-muted">DCR</small></h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <p className="mb-0 text-uppercase">Est'd next ticket price</p>
              <h3>{numeral(stats.diff.next).format('0,0.00')} <small className="text-muted">DCR</small></h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <p className="mb-0 text-uppercase">PoS pool size</p>
              <h3>{numeral(stats.pool.size).format('0,0')}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card mb-2">
            <div className="card-body">
              <p className="mb-0 text-uppercase">PoS pool value</p>
              <h3>{numeral(stats.pool.value).format('0,0')} <small className="text-muted">DCR</small></h3>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
