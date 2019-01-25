'use strict'

const smoke = require('smokesignal')

class p2p{
  constructor(opts){
    this.node = smoke.createNode({
      port: opts.localPort,
      address: smoke.localIp(opts.localIp),
      seeds: [{
        port: opts.seedPort,
        address:opts.seedIP
      }],
      minPeerNo : 16,
      maxPeerNo : 16
    })
    this.node.broadcast.on('data',function(e){
      global.iStream.emit("p2p",e);
    })
    global.p2p = this.node.broadcast;
  }
  start(){
    global.logger.info("Node Started")
    this.node.start();
  }
  send(data){
    return this.node.broadcast.write(data)
  }
}

module.exports = p2p;

/*
const stream = require('stream');
const smoke = require('smokesignal')
var node1 = smoke.createNode({
  port: 8000,
  address: smoke.localIp('127.0.0.1'),
  seeds: [{
    port: 8000,
    address:'127.0.0.1'
  }],
  minPeerNo : 16,
  maxPeerNo : 16,
})
node1.on('connect', function() {
  node1.broadcast.write('Node1 Here')
})
node1.start();
node1.broadcast.on('data',function(e){
  console.log(e.toString());
})

const smoke = require('smokesignal')
var node2 = smoke.createNode({
  port: 8001,
  address: smoke.localIp('127.0.0.1/255.255.255.0'),
  seeds: [{
    port: 8000,
    address:'127.0.0.1'
  }],
  minPeerNo : 16,
  maxPeerNo : 16,
})
node2.on('connect', function() {
  node2.broadcast.write('Node2 Here')
})
node2.start()
node2.broadcast.on('data',function(e){
  console.log(e.toString());
})

const smoke = require('smokesignal')
var node3 = smoke.createNode({
  port: 8002,
  address: smoke.localIp('127.0.0.1/255.255.255.0'),
  seeds: [{
    port: 8000,
    address:'127.0.0.1'
  }],
  minPeerNo : 16,
  maxPeerNo : 16,
})
node3.on('connect', function() {
  node3.broadcast.write('Node3 Here')
})
node3.start()
node3.broadcast.on('data',function(e){
  console.log(e.toString());
})

*/
