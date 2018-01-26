/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */

import Highcharts from 'highcharts';
import _ from 'lodash';
import moment from 'moment';
import $ from 'jquery';


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


// Check to make sure service workers are supported in the current browser,
// and that the current page is accessed from a secure origin. Using a
// service worker from an insecure origin will trigger JS console errors. See
// http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.1/8 is considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

if ('serviceWorker' in navigator &&
  (window.location.protocol === 'https:' || isLocalhost)) {
  navigator.serviceWorker.register('service-worker.js')
    .then(function (registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function () {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function () {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                  'service worker became redundant.');

              default:
              // Ignore
            }
          };
        }
      };
    }).catch(function (e) {
    console.error('Error during service worker registration:', e);
  });
}

// Your custom JavaScript goes here

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




