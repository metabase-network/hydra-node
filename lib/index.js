'use strict'

require('./stream');
const p2p     = require('./p2p.js');
const logger  = require('./logger.js');
const storage = require('./storage.js');
const listener = require('./listener.js');
const nodeSetup = require('./nodeSetup.js');
const blockGen = require('./Block/generate.js');

class node{
  constructor(opts){
    this.opts = opts;
    global.logger = new logger(this.opts.logLevel)
    global.storage = new storage(this.opts.storagePath)
    this.p2p = new p2p(this.opts.network);
    this.p2p.start();
    this.listener = new listener(this.opts.network);
    this.listener.start();
    this.nodeSetup = new nodeSetup(this.opts);
    this.reset();
/*
    setTimeout(function(){
      global.p2p.send(JSON.stringify({ "Test" : this.p2p.node.options.port}));
    }.bind(this),100)
*/
  }
  reset(){
    setInterval(function(){
      this.nodeSetup = new nodeSetup(this.opts);
    }.bind(this),900000)
  }
}

module.exports = node;
