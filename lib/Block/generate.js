let pow = require('./consensus/pow.js');

class genBlock{
  constructor(){
    this.BlockTime;
    this.capacityLimit;
    this.nodeID;
    this.scalingEpoch;
    this.blockTxLimit;
    this.hashes = [];
    this.init();
    setTimeout(function(){
      this.start();
    }.bind(this),3000)
  }
  async init(){
    this.BlockTime = parseInt((await global.storage.dbNode.get("blockTime")).toString());
    this.capacityLimit = parseInt((await global.storage.dbNode.get("thresholdCapacity")).toString());
    this.nodeID = parseInt((await global.storage.dbNode.get("NodeID")).toString());
    this.scalingEpoch = parseInt((await global.storage.dbNode.get("scalingEpoch")).toString());
    this.blockTxLimit = parseInt((await global.storage.dbNode.get("blockTxLimit")).toString());
  }


  start(){
    setInterval(async function(){
      try{
        this.scalingEpoch = parseInt((await global.storage.dbNode.get("scalingEpoch")).toString());
        let poolData = JSON.parse((await global.storage.dbPool.get("poolData")).toString());
        let poolLength = poolData.length
        if ( (this.nodeID<2**this.scalingEpoch) ){
          global.logger.debug("Mining activated")
          let hashArray = await this.generateBlockHashes(poolData);
          let block = await pow.generate(hashArray[0]);
          block.txRefMap = hashArray;
          block.nodeID = this.nodeID;
          global.p2p.write(JSON.stringify(['BlkB',block]));
          global.logger.info("Block Broadcasted on chain "+ this.nodeID + ", with total transactions " + hashArray[0].length)
        }
        await global.storage.dbPool.put("poolData",JSON.stringify([]));
      }catch(err){
        global.logger.error(err);
      }
    }.bind(this),this.BlockTime)
  }

  generateBlockHashes(poolData){
    return new Promise(async function(resolve, reject) {
      try{
        let hashes = [];
        let txRef  = []
        poolData.forEach(async function(i,j){
          i.epoch = await this.getHashepoch(i.TxHash);
          if( (this.nodeID === i.epoch) && (hashes.length < this.blockTxLimit) ){
            hashes.push(i.TxHash);
            txRef.push([i.TxHash,i.from]);
          }
        }.bind(this))

        resolve([hashes,txRef])
      }catch(err){
        global.logger.error(err);
        reject(false)
      }
    }.bind(this));
  }

  pushHash(hash){
    this.hashes.push(hash);
  }

  generateProof(hashes){

  }

  getHashepoch(hash){
    return new Promise(async function(resolve, reject) {
      try{
        resolve(Math.floor(parseInt(hash.slice(2,3),16)/(2**(4-this.scalingEpoch))));
      }catch(err){
        reject(false)
      }
    }.bind(this));
  }
}

module.exports = new genBlock();
