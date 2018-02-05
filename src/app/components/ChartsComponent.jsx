import React from "react";

import TimelineChartComponent from './TimelineChartComponent.jsx';

class TicketVoteCountChartComponent extends TimelineChartComponent {
  constructor(props) {
    super(props);
    this.chartInfo = {
      chartTitle: 'Tickets',
      yAxisTitle: 'Tickets staked & voted on'
    };
  }

  getSeriesData() {

    const seriesData = this.props.datastore.getSeries();

    return [{
      type: 'area',
      name: 'Voted tickets',
      data: _.map(seriesData, function (i) {
        return [
          i.datePoint.valueOf(),
          i.ticketVoteCount
        ]
      })
    }, {
      type: 'area',
      name: 'Staked tickets',
      data: _.map(seriesData, function (i) {
        return [
          i.datePoint.valueOf(),
          i.ticketStakedCount
        ]
      })
    }];
  }
}

class RewardChartComponent extends TimelineChartComponent {
  constructor(props) {
    super(props);
    this.chartInfo = {
      chartTitle: 'Staking rewards',
      yAxisTitle: 'Reward (DCR)'
    };
  }

  getSeriesData() {
    const seriesData = this.props.datastore.getSeries();

    return [{
      type: 'area',
      name: 'Reward',
      data: _.map(seriesData, function (i) {
        return [
          i.datePoint.valueOf(),
          i.rewardAmt
        ]
      })
    }];
  }
}

class TicketPriceChartComponent extends TimelineChartComponent {

  constructor(props) {
    super(props);
    this.chartInfo = {
      chartTitle: 'Average ticket price',
      yAxisTitle: 'Ticket price (DCR)'
    };
  }

  getSeriesData() {
    const seriesData = this.props.datastore.getSeries();
    return [{
      type: 'area',
      name: 'Ticket price',
      data: _.map(seriesData, function (i) {
        return [
          i.datePoint.valueOf(),
          i.purchasedTicketCostAmount / i.ticketStakedCount
        ]
      })
    }];
  }
}

class ReturnChartComponent extends TimelineChartComponent {
  constructor(props) {
    super(props);
    this.chartInfo = {
      chartTitle: 'Return on investment',
      yAxisTitle: 'Returns (%)'
    };
  }

  getSeriesData() {
    const seriesData = this.props.datastore.getSeries();
    return [{
      type: 'area',
      name: 'Return on investment',
      data: _.map(seriesData, function (i) {
        return [
          i.datePoint.valueOf(),
          i.returnPct * 100
        ]
      })
    }];
  }
}


export default class ChartsComponent extends React.Component {

  render() {

    return (
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <TicketVoteCountChartComponent datastore={this.props.datastore}/>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <RewardChartComponent datastore={this.props.datastore}/>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <TicketPriceChartComponent datastore={this.props.datastore}/>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <ReturnChartComponent datastore={this.props.datastore}/>
          </div>
        </div>
      </div>
    );
  }
}
