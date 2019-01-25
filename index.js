'use strict'

const config = require(process.argv[2].split(' ')[2]);
const node = require('./lib/index.js');

let LiveNode = new node(config)
