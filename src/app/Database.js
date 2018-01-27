import _ from 'lodash';
import $ from "jquery";
import moment from "moment/moment";
import Promise from 'bluebird';

// const watchAddress = 'DscqujsHptcUnDKChLMaTRrNhfmTW5Gvfo5';
const watchAddress = 'DsRpXsnhsXU3LvuahyHXVLPdnQzd2NxL3Bj';
const apiBackendUrl = 'http://dcroi.com/api/txs?address=';
const backendUrl = '/tx.json';

// const backendUrl = apiBackendUrl + watchAddress;


export default class Database {

  constructor() {
    this.voteTxs = [];
    this.stakeTxs = [];
    this.txIndex = {};
    this._totals = {};
    this._series = [];
  }

  fetchInsightData() {

    let voteTxs = this.voteTxs = [];
    let stakeTxs = this.stakeTxs = [];

    return new Promise(function (resolve, reject) {

      $.get(backendUrl, function (data) {

        let insightVoteTxs = _.filter(data.txs, 'agendas');
        let insightStakeTxs = _.filter(data.txs, 'isStakeTx');

        _.map(insightVoteTxs, function (tx) {

          let rewardVin = _.find(tx.vin, 'stakebase');
          let returnVin = _.find(tx.vin, 'txid');

          voteTxs.push({
            rewardAmt: rewardVin.amountin,
            returnedTicketCostAmt: returnVin.amountin,
            ticketId: tx.ticketid,
            ts: moment.unix(tx.time)
          });
        });

        _.map(insightStakeTxs, function (tx) {
          stakeTxs.push({
            ticketId: tx.txid,
            purchasedTicketCostAmount: tx.valueIn,
            fees: tx.fees,
            ts: moment.unix(tx.time)
          });
        });

        resolve();
      });
    });
  }


  _indexTxs(insightTxCollection, timeInterval, txType) {

    let txIndex = this.txIndex;

    _.map(insightTxCollection, function (tx) {
      let datePoint = tx.ts.endOf(timeInterval);
      let dateSpec = datePoint.toString();
      if (_.isUndefined(txIndex[dateSpec])) {
        txIndex[dateSpec] = {
          datePoint: datePoint,
          voteTx: [],
          stakeTx: []
        };
      }
      txIndex[dateSpec][txType].push(tx);
    });
  }


  calculateSeries(timeInterval) {

    this.txIndex = {};

    this._indexTxs(this.voteTxs, timeInterval, 'voteTx');
    this._indexTxs(this.stakeTxs, timeInterval, 'stakeTx');

    console.log(this.txIndex);

    let totals = this._totals = {
      ticketVoteCount: 0,
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

      series.push(sum);
    });

    // XXX TODO this needs to take into account missed tickets
    totals.liveTickets = totals.ticketStakedCount - totals.ticketVoteCount;

    console.log(this._totals);
  }


  getTotals() {
    return this._totals;
  }

  getSeries() {
    return _.sortBy(this._series, function (item) {
      return item.datePoint.valueOf();
    });
  }
}


