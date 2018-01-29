/* eslint-env browser */

import 'bootstrap';
import 'popper.js';

import React from 'react';
import ReactDOM from 'react-dom';

import 'font-awesome/css/font-awesome.css';
import '../styles/custom.scss';


import EventEmitterSingleton from './EventEmitter';

const eventEmitter = EventEmitterSingleton.createInstance();

import ChartComponent from './ChartComponent.jsx';
import AddressInputComponent from './AddressInputComponent.jsx';
import SpinnerComponent from './SpinnerComponent.jsx';
import StakeStatsComponent from './StakeStatsComponent.jsx';

import Datastore from './Datastore.js';

const datastore = new Datastore(EventEmitterSingleton.getInstance());


ReactDOM.render(
  <AddressInputComponent/>,
  document.getElementById("address-input-component")
);


datastore.fetchStakeStats()
  .done(function(stakeStatsData){

    ReactDOM.render(
      <StakeStatsComponent stakeStatsData={stakeStatsData}/>,
      document.getElementById("stake-stats-component")
    );
  });


eventEmitter.addListener('addressinput:changed', function (votingWalletAddress) {

  ReactDOM.render(
    <SpinnerComponent/>,
    document.getElementById("chart-component")
  );

  datastore.fetchInsightData(votingWalletAddress)
    .then(function () {

      datastore.calculateSeries('week');

      const seriesData = datastore.getSeries();
      const totals = datastore.getTotals();

      ReactDOM.render(
        <ChartComponent seriesData={seriesData} totals={totals}/>,
        document.getElementById("chart-component")
      );
    });
});








