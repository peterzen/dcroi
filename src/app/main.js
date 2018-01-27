/* eslint-env browser */

import 'bootstrap';
import 'popper.js';

import numeral from 'numeral';

global.numeral = numeral;

import React from 'react';
import ReactDOM from 'react-dom';

import 'font-awesome/css/font-awesome.css';
import '../styles/custom.scss';


import ChartComponent from './ChartComponent.jsx';

import Database from './Database.js';

const database = new Database();

database.fetchInsightData()
  .then(function () {

    database.calculateSeries('month');

    const seriesData = database.getSeries();
    const totals = database.getTotals();

    ReactDOM.render(
      <ChartComponent seriesData={seriesData} totals={totals}/>,
      document.getElementById("chart-component")
    );

  });







