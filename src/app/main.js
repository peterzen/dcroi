/* eslint-env browser */

import 'bootstrap';
import 'popper.js';
import _ from 'lodash';
import $ from 'jquery';

import React from 'react';
import ReactDOM from 'react-dom';

import 'font-awesome/css/font-awesome.css';
import '../styles/custom.scss';


import EventEmitterSingleton from './EventEmitter';

const eventEmitter = EventEmitterSingleton.createInstance();

import AppComponent from './components/AppComponent.jsx';
import AddressInputComponent from './components/AddressInputComponent.jsx';
import SpinnerComponent from './components/SpinnerComponent.jsx';
import StakeStatsComponent from './components/StakeStatsComponent.jsx';
import ProgressbarComponent from './components/ProgressbarComponent.jsx';

import Datastore from './Datastore.js';

const datastore = new Datastore();


$(window).on("load", function () {
  $('body').removeClass('is-rendering');
});

ReactDOM.render(
  <AddressInputComponent/>,
  document.getElementById("address-input-component")
);


datastore.fetchStakePoolStats()
  .done(function (stakeStatsData) {
    ReactDOM.render(
      <StakeStatsComponent stakeStatsData={stakeStatsData}/>,
      document.getElementById("stake-stats-component")
    );
  });


eventEmitter.addListener('addressinput:changed', function (votingWalletAddress) {

  ReactDOM.render(
    <ProgressbarComponent/>,
    document.getElementById("chart-component")
  );

  datastore.fetchInsightData(votingWalletAddress)
    .progress(function(a){
      console.log('.', a)
    })

    .then(function () {

      datastore.calculateSeries('day');

      ReactDOM.render(
        <AppComponent datastore={datastore}/>,
        document.getElementById("chart-component")
      );
    });
});


eventEmitter.addListener('resolutionselector:changed', function (timeInterval) {

  datastore.calculateSeries(_.first(timeInterval));
});








