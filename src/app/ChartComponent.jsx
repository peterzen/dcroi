import React from "react";

// this fucker isn't visible inside the _.map() functions below
const numeral =require('numeral');


import TimelineChartComponent from './TimelineChartComponent.jsx';
import TotalsComponent from './TotalsComponent.jsx';
import TimeIntervalSelectorComponent from "./TimeIntervalSelectorComponent.jsx";
import TimeResolutionSelectorComponent from './TimeResolutionSelectorComponent.jsx';

class TicketVoteCountChartComponent extends TimelineChartComponent {
  componentDidMount() {
    this.instantiateChart(this.state.id, 'Tickets', 'Tickets staked & voted on',
      [{
        type: 'area',
        name: 'Voted tickets',
        data: _.map(this.props.seriesData, function (i) {
          return [
            i.datePoint.valueOf(),
            i.ticketVoteCount
          ]
        })
      }, {
        type: 'area',
        name: 'Staked tickets',
        data: _.map(this.props.seriesData, function (i) {
          return [
            i.datePoint.valueOf(),
            i.ticketStakedCount
          ]
        })
      }]
    );
  }
}

class RewardChartComponent extends TimelineChartComponent {
  componentDidMount() {
    this.instantiateChart(this.state.id, 'Staking rewards', 'Reward (DCR)',
      [{
        type: 'area',
        name: 'Reward',
        data: _.map(this.props.seriesData, function (i) {
          return [
            i.datePoint.valueOf(),
            i.rewardAmt
          ]
        })
      }]
    );
  }
}

class TicketPriceChartComponent extends TimelineChartComponent {
  componentDidMount() {
    this.instantiateChart(this.state.id, 'Average ticket price', 'Ticket price (DCR)',
      [{
        type: 'area',
        name: 'Ticket price',
        data: _.map(this.props.seriesData, function (i) {
          return [
            i.datePoint.valueOf(),
            i.purchasedTicketCostAmount / i.ticketStakedCount
          ]
        })
      }]
    );
  }
}

class ReturnChartComponent extends TimelineChartComponent {
  componentDidMount() {
    this.instantiateChart(this.state.id, 'Return on investment', 'Returns (%)',
      [{
        type: 'area',
        name: 'Return on investment',
        data: _.map(this.props.seriesData, function (i) {
          return [
            i.datePoint.valueOf(),
            i.returnPct * 100
          ]
        })
      }]
    );
  }
}


export default class ChartComponent extends React.Component {

  render() {

    return (
      <div>

        <div className="row mt-5">
          <div className="col-sm-6 mb-5">
            <TimeIntervalSelectorComponent/>
          </div>

          <div className="col-sm-6">
            <TimeResolutionSelectorComponent/>
          </div>
        </div>

        <TotalsComponent totals={this.props.totals}/>

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <TicketVoteCountChartComponent seriesData={this.props.seriesData}/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <RewardChartComponent seriesData={this.props.seriesData}/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <TicketPriceChartComponent seriesData={this.props.seriesData}/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <ReturnChartComponent seriesData={this.props.seriesData}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
