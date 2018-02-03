import React from 'react';
import _ from 'lodash';

import Highcharts from "highcharts";
import shortid from "shortid";

import EventEmitterSingleton from '../EventEmitter';

export default class TimelineChartComponent extends React.Component {

  constructor(props) {
    super(props);
    this.eventEmitter = EventEmitterSingleton.getInstance();
    this.state = {
      id: shortid.generate(),
      chart: null
    };
    this._listenerToken = null;
    this.datastoreChangedHandler = this.datastoreChangedHandler.bind(this);
  }

  render() {
    return (
      <div className="card-body timeline-chart" id={this.state.id}>
        Loading chart...
      </div>
    );
  }

  componentWillUnmount() {
    if (this.state.chart !== null) {
      this.state.chart.destroy();
    }
    if(this._listenerToken !== null) {
      this._listenerToken.remove();
    }
  }

  componentDidMount() {
    this.state.chart = Highcharts.chart(this.state.id, this.getChartData());
    this._listenerToken = this.eventEmitter.addListener('datastore:changed', this.datastoreChangedHandler);
  }

  datastoreChangedHandler(){
    const updatedSeriesData = this.getSeriesData();
    console.log('datastoreChangedHandler',updatedSeriesData);

    const chartSeries = this.state.chart.series;
    _.map(updatedSeriesData, function(series, index){
      chartSeries[index].setData(series.data, false);
    });
    this.state.chart.redraw(true);
  }

  getChartData(){
    return {
      chart: {
        // zoomType: 'x'
      },
      title: {
        text: this.chartInfo.chartTitle
      },
      // subtitle: {
      //   text: document.ontouchstart === undefined ?
      //     'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
      // },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: this.chartInfo.yAxisTitle
        }
      },
      legend: {
        enabled: true
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },

      series: this.getSeriesData()
    };
  }

  getSeriesData(){
    return [];
  }
}
