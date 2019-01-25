'use strict'

const iStream = require('stream').Duplex;
const poolMgr = require('./Tx/pool.js');

global.iStream = Object.create(iStream.prototype, { constructor: { value: "iStream" }})
global.iStream.on("p2p",async function(e){
  try{
    let data = JSON.parse(e.toString());
//    global.logger.info("Transaction Broadcast Received for " + data.length + " Transactions")
    if(data[0] === "TxB"){
      await poolMgr.incommingHandler(data.slice(1,data.length))
      global.iStream.emit("TxB",data)
    }else if(data[0] === "BlkB"){
      global.logger.debug("Block Broadcast Received")
      global.iStream.emit("BlkB",data)
    }
  }catch(err){
    console.log(err);
  }
})

/*
txDef = {
  "type" : "TxB",
  "from" : "",
  "hash" : "",
  "TxData" : ""
}

BlockB = {
  "blockNo" : '',
  ""
}

*/
