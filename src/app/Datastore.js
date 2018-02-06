import _ from 'lodash';
import $ from 'jquery';
import './vendor/jq-ajax-progress';

import moment from "moment/moment";
// import Promise from 'bluebird';
import Promise from 'promise-polyfill';


import EventEmitterSingleton from './EventEmitter';

const dcrdataUrlRoot = 'https://dcroi.com/dcrdata';
const apiUrlRoot = 'https://dcroi.com/api';

// const apiBackendUrl = 'https://dcroi.com/dcrdata/txs?address=';
// const stakeStatsUrl = 'https://dcroi.com/stakestats/mainnet/current.json';

export default class Datastore {

  constructor() {
    this.eventEmitter = EventEmitterSingleton.getInstance();
    this.voteTxs = [];
    this.stakeTxs = [];
    this.revokeTxs = [];
    this.txIndex = {};
    this._totals = {};
    this._series = [];
  }

  fetchInsightData(votingWalletAddress) {

    let voteTxs = this.voteTxs = [];
    let stakeTxs = this.stakeTxs = [];
    let revokeTxs = this.revokeTxs = [];

    this.eventEmitter.emit('datastore:isloading');

    const backendUrl = dcrdataUrlRoot + '/address/' + votingWalletAddress + '/count/1000/raw';

    const eventEmitter = this.eventEmitter;

    let progress = 5;
    eventEmitter.emit('progress:update', progress);

    return $.get(backendUrl, {
      // chunking: true,
    })
      .progress(function () {
        progress += 10;
        eventEmitter.emit('progress:update', progress);
      })
      .then(function (data) {

        eventEmitter.emit('progress:update', 100);

        _.map(data, function (tx) {

          let rewardVin = _.find(tx.vin, 'stakebase');
          let returnVin = _.find(tx.vin, 'txid');

          // vote tx
          if (rewardVin !== undefined) {
            voteTxs.push({
              rewardAmt: rewardVin.amountin,
              returnedTicketCostAmt: returnVin.amountin,
              ticketId: tx.ticketid,
              ts: moment.unix(tx.time)
            });
            return;
          }

          // stake submission
          let stakeTx = _.find(tx.vout, function (vout) {
            if (vout.scriptPubKey.type === "sstxcommitment") {
              return true;
            }
          });

          if (stakeTx) {
            stakeTxs.push({
              ticketId: tx.txid,
              purchasedTicketCostAmount: stakeTx.scriptPubKey.commitamt,
              ts: moment.unix(tx.time)
            });
            return;
          }

          // ticket revoke tx
          let revokeTx = _.find(tx.vout, function (vout) {
            if (vout.scriptPubKey.type === "stakerevoke") {
              return true;
            }
          });

          if (revokeTx) {
            revokeTxs.push({
              ticketId: tx.txid,
              ts: moment.unix(tx.time)
            });
            return;
          }
        });

        return Promise.resolve();
      });
  }


  _indexTxs(insightTxCollection, timeInterval, txType) {

    let txIndex = this.txIndex;

    _.map(insightTxCollection, function (tx) {
      let datePoint = tx.ts.clone().endOf(timeInterval);
      let dateSpec = datePoint.toString();
      if (_.isUndefined(txIndex[dateSpec])) {
        txIndex[dateSpec] = {
          datePoint: datePoint,
          voteTx: [],
          stakeTx: [],
          revokeTx: []
        };
      }
      txIndex[dateSpec][txType].push(tx);
    });
  }


  calculateSeries(timeInterval) {

    console.log('calculateSeries ' + timeInterval);

    this.txIndex = {};

    this._indexTxs(this.voteTxs, timeInterval, 'voteTx');
    this._indexTxs(this.stakeTxs, timeInterval, 'stakeTx');
    this._indexTxs(this.revokeTxs, timeInterval, 'revokeTx');

    // console.log('txIndex ' + timeInterval + '%%%%%', this.txIndex);

    let totals = this._totals = {
      ticketVoteCount: 0,
      ticketRevokeCount: 0,
      rewardAmt: 0,
      returnPct: 0,
      ticketStakedCount: 0,
      purchasedTicketCostAmount: 0,
      returnedTicketCostAmt: 0
    };

    let series = this._series = [];

    _.forEach(this.txIndex, function (txIndexItem) {

      let sum = {
        datePoint: txIndexItem.datePoint,
        ticketVoteCount: 0,
        ticketRevokeCount: 0,
        rewardAmt: 0,
        returnedTicketCostAmt: 0,
        returnPct: 0,
        ticketStakedCount: 0,
        purchasedTicketCostAmount: 0,
        liveTickets: 0
      };

      _.map(txIndexItem.voteTx, function (tx) {
        sum.ticketVoteCount += 1;
        sum.rewardAmt += tx.rewardAmt;
        sum.returnedTicketCostAmt += tx.returnedTicketCostAmt;
        sum.returnPct = sum.rewardAmt / sum.returnedTicketCostAmt;

        totals.rewardAmt += tx.rewardAmt;
        totals.ticketVoteCount += 1;
        totals.returnedTicketCostAmt += tx.returnedTicketCostAmt;
        totals.returnPct = totals.rewardAmt / totals.returnedTicketCostAmt;
      });

      _.map(txIndexItem.stakeTx, function (tx) {
        sum.ticketStakedCount += 1;
        sum.purchasedTicketCostAmount += tx.purchasedTicketCostAmount;

        totals.ticketStakedCount += 1;
        totals.purchasedTicketCostAmount += tx.purchasedTicketCostAmount;
      });

      _.map(txIndexItem.revokeTx, function (tx) {
        sum.ticketStakedCount -= 1;
        sum.ticketRevokeCount += 1;
        totals.ticketStakedCount -= 1;
        totals.ticketRevokeCount += 1;
      });

      series.push(sum);
    });

    totals.liveTickets = totals.ticketStakedCount - totals.ticketVoteCount - totals.ticketRevokeCount;

    this.eventEmitter.emit('datastore:changed');
  }

  fetchStakePoolStats() {

    const poolStats = {};

    const stakeStatsUrl = dcrdataUrlRoot + '/stake/pool';
    const stakeDiffUrl = dcrdataUrlRoot + '/stake/diff';

    // const stakeStatsUrl = '/pool.json';
    // const stakeDiffUrl = '/diff.json';

    return $.getJSON(stakeStatsUrl)
      .then(function (data) {
        poolStats.pool = data;
        return $.getJSON(stakeDiffUrl);
      })
      .then(function (data) {
        poolStats.diff = data;
        return Promise.resolve(poolStats);
      })
    // TODO add error handling

    // .done(function () {
    //   // console.log("second success");
    // })
    // .fail(function () {
    //   // console.log("error");
    // })
    // .always(function () {
    //   // console.log("complete");
    // });
  }

  getTotals() {
    return this._totals;
  }

  getSeries() {
    return _.sortBy(this._series, function (item) {
      return item.datePoint.valueOf();
    });
  }

  getmarketSummary() {
    const url = 'https://bittrex.com/dcrdata/v1.1/public/getmarketsummary?market=btc-dcr';
  }
}


