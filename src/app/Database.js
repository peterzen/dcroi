import _ from 'lodash';
import $ from "jquery";
import moment from "moment/moment";
import Promise from 'bluebird';

const watchAddress = 'DsRpXsnhsXU3LvuahyHXVLPdnQzd2NxL3Bj';
const apiBackendUrl = 'http://dcroi.com/api/txs?address=';
const backendUrl = '/tx.json';

// const backendUrl = apiBackendUrl + watchAddress;


export default class Database {

  constructor() {
    this.voteTxs = [];
  }

  fetchInsightData() {

    let voteTxs = this.voteTxs = [];

    return new Promise(function (resolve, reject) {

      $.get(backendUrl, function (data) {

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

        resolve();

      });
    });
  }


  getTimeSeries(timeInterval) {

    let series = [],
      txIndex = {},
      txs = this.voteTxs;

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

}


