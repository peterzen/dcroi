
/* eslint-env browser */

import Highcharts from 'highcharts';
import _ from 'lodash';
import moment from 'moment';
import $ from 'jquery';
import 'bootstrap';
import 'popper.js';

// import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import '../styles/custom.scss';

function getTimeSeries(txs, timeInterval) {

  let series = [],
    txIndex = {};

  _.map(txs, function (item) {
    let datePoint = item.ts.endOf(timeInterval);
    let dateSpec = datePoint.toString();
    if (_.isUndefined(txIndex[dateSpec])) {
      txIndex[dateSpec] = {
        datePoint: datePoint,
        items: []
      };
    }
    txIndex[dateSpec].items.push(item);
  });
  // console.log(txIndex);

  _.forEach(txIndex, function (txIndexItem, dateSpec) {
    let sum = {
      datePoint: txIndexItem.datePoint,
      ticketCount: 0,
      rewardAmt: 0,
      ticketCostAmt: 0,
      returnPct: 0
    };
    _.map(txIndexItem.items, function (tx) {
      sum.ticketCount += 1;
      sum.rewardAmt += tx.rewardAmt;
      sum.ticketCostAmt += tx.ticketCostAmt;
      sum.returnPct = sum.rewardAmt / sum.ticketCostAmt * 100;
    });

    series.push(sum);
  });

  // console.log(series);

  return _.sortBy(series, function (item) {
    return item.datePoint.valueOf();
  });
}

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


const watchAddress = 'DsRpXsnhsXU3LvuahyHXVLPdnQzd2NxL3Bj';
const apiBackendUrl = 'http://45.77.65.205/api/txs?address=';
const backendUrl = '/tx.json';

// const backendUrl = apiBackendUrl + watchAddress;

$.get(backendUrl, function (data) {

  let voteTxs = [];

  let txs = _.filter(data.txs, 'agendas');

  _.reduce(txs, function (sum, item) {
    // console.log(item.txid);

    let rewardVin = _.find(item.vin, 'stakebase');
    let returnVin = _.find(item.vin, 'txid');

    voteTxs.push({
      rewardAmt: rewardVin.amountin,
      ticketCostAmt: returnVin.amountin,
      ts: moment.unix(item.time).startOf('day')
    });

    // console.log(item.time + ' reward: ' + rewardVin.amountin + ' return: ' + returnVin.amountin);
  });

  // console.log(voteTxs);

  let timeSeries = getTimeSeries(voteTxs, 'month');

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




