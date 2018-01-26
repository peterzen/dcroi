
import React from "react";


import TimelineChartComponent from './TimelineChartComponent.jsx';



class TicketCountChartComponent extends TimelineChartComponent {
  componentDidMount() {
    this.instantiateChart(this.state.id, 'Tickets voted', 'Ticket count',
      [{
        type: 'area',
        name: 'Ticket count',
        data: _.map(this.props.seriesData, function (i) {
          return [
            i.datePoint.valueOf(),
            i.ticketCount
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
            i.ticketCostAmt / i.ticketCount
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
            i.returnPct
          ]
        })
      }]
    );
  }
}


export default class ChartComponent extends React.Component {

  render() {

    return (
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <TicketCountChartComponent seriesData={this.props.seriesData}/>
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
    );
  }


}


/*



        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body" id="reward-container" style="height:320px;">
              Loading chart...
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">

            <div className="card-body" id="ticketprice-container" style="height:320px;">
              Loading chart...
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-body" id="returnpct-container" style="height:320px;">
              Loading chart...
            </div>
          </div>
        </div>
 */
