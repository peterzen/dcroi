/* eslint-env browser */

import Highcharts from 'highcharts';
import _ from 'lodash';
import 'bootstrap';
import 'popper.js';

// import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import '../styles/custom.scss';


import React from 'react';
import ReactDOM from 'react-dom';


import Database from './Database.js';

function buildChart(containerId, chartTitle, yAxisTitle, seriesData) {

  Highcharts.chart(containerId, {
    chart: {
      zoomType: 'x'
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
      enabled: false
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

// const backendUrl = apiBackendUrl + watchAddress;

const database = new Database();

database.fetchInsightData()
  .then(function () {

    let timeSeries = database.getTimeSeries('month');

    buildChart('ticketcount-container', 'Tickets voted', 'Ticket count',
      [{
        type: 'area',
        name: 'Ticket count',
        data: _.map(timeSeries, function (i) {
          return [
            i.datePoint.valueOf(),
            i.ticketCount
          ]
        })
      }]
    );

    buildChart('reward-container', 'Staking rewards', 'Reward (DCR)',
      [{
        type: 'area',
        name: 'Reward',
        data: _.map(timeSeries, function (i) {
          return [
            i.datePoint.valueOf(),
            i.rewardAmt
          ]
        })
      }]
    );

    buildChart('ticketprice-container', 'Average ticket price', 'Ticket price (DCR)',
      [{
        type: 'area',
        name: 'Ticket price',
        data: _.map(timeSeries, function (i) {
          return [
            i.datePoint.valueOf(),
            i.ticketCostAmt / i.ticketCount
          ]
        })
      }]
    );
    buildChart('returnpct-container', 'Return on investment', 'Returns (%)',
      [{
        type: 'area',
        name: 'Return on investment',
        data: _.map(timeSeries, function (i) {
          return [
            i.datePoint.valueOf(),
            i.returnPct
          ]
        })
      }]
    );
  });







