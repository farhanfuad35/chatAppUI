// Connects to the Datbase
const express = require('express');
const config = require('config');
const pgp = require('pg-promise')();    // Never ever forget to add extra parenthesis again damn it

console.log('db.js initialized');

const dbConfig = config.get('dbConfig');
const db = pgp('postgres://farhan:password@localhost:5432/kathak');
console.log('Database connected!');

module.exports = db;