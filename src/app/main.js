/* eslint-env browser */

import Highcharts from 'highcharts';
import _ from 'lodash';
import 'bootstrap';
import 'popper.js';

import React from 'react';
import ReactDOM from 'react-dom';

import 'font-awesome/css/font-awesome.css';
import '../styles/custom.scss';


import ChartComponent from './ChartComponent.jsx';

import Database from './Database.js';

const database = new Database();

database.fetchInsightData()
  .then(function () {

    const seriesData = database.getTimeSeries('month');

    ReactDOM.render(
      <ChartComponent seriesData={seriesData}/>,
      document.getElementById("chart-component")
    );

  });







