import React from 'react';

import Highcharts from "highcharts";
import shortid from "shortid";


export default class TimelineChartComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: shortid.generate(),
      chart: null
    };
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
  }


  instantiateChart(containerId, chartTitle, yAxisTitle, seriesData) {

    this.state.chart = Highcharts.chart(containerId, {
      chart: {
        // zoomType: 'x'
      },
      title: {
        text: chartTitle
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
          text: yAxisTitle
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

      series: seriesData
    });

  }

}
