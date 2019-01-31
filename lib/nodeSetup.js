'use strict'


class nodeSetup{
  constructor(opts){
    global.storage.dbNode.put("NodeID", opts.nodeID);
    global.storage.dbNode.put("isMiner", opts.isMiner);
    global.storage.dbNode.put("blockTxLimit", opts.blockchainSpec.blockTxLimit);
    global.storage.dbNode.put("blockTxAvg", opts.blockchainSpec.blockTxAvg);
    global.storage.dbNode.put("blockTime", opts.blockchainSpec.blockTime);
    global.storage.dbNode.put("conformationTime", opts.blockchainSpec.conformationTime);
    global.storage.dbNode.put("scalingEpoch", 2);
    global.storage.dbNode.put("currentCapacity", 0);
    global.storage.dbNode.put("thresholdCapacity", 80);
    global.storage.dbNode.put("currentBlockNo", "");
    global.storage.dbPool.put("poolData", JSON.stringify([]));
    this.init()
  }
  async init(){
    global.logger.debug("Local Node ID is " + await global.storage.dbNode.get("NodeID"));
    global.logger.debug("Mining / Validation is " + await global.storage.dbNode.get("isMiner"));
    global.logger.debug("Mining / Validation is " + await global.storage.dbNode.get("isMiner"));
    global.logger.debug("Number of Transaction in one block " + await global.storage.dbNode.get("blockTxLimit"));
    global.logger.debug("Number of blocks considered for determining capacity utilization " + await global.storage.dbNode.get("blockTxAvg"));
    global.logger.debug("Block Generation time set at " + await global.storage.dbNode.get("blockTime"));
    global.logger.debug("Max Confirmation time for tx " + await global.storage.dbNode.get("conformationTime"));
    global.logger.debug("Tx in Pool " + JSON.parse((await global.storage.dbPool.get("poolData"))).length);
  }
}

module.exports = nodeSetup;
