
class genBlock{
  constructor(){
    this.capacityArray = [];
    this.BlockTime;
    this.capacityLimit;
    this.init();
    setTimeout(function(){
      this.start();
    }.bind(this),3000)
  }
  async init(){
    this.BlockTime = parseInt((await global.storage.dbNode.get("blockTime")).toString());;
    this.capacityLimit = parseInt((await global.storage.dbNode.get("thresholdCapacity")).toString());
  }


  start(){
    console.log(this);
    setInterval(async function(){
      try{

        let poolData = JSON.parse((await global.storage.dbPool.get("poolData")).toString());
        let poolLength = poolData.length
        global.logger.debug("Transactions in Mining Pool",poolLength)
        this.generateBlock(poolData);
        await global.storage.dbPool.put("poolData",JSON.stringify([]));
      }catch(err){
        global.logger.error(err);
      }
    }.bind(this),this.BlockTime)
  }

  generateBlock(poolData){
    return new Promise(async function(resolve, reject) {
      try{
        let scalingEpoch = await global.storage.dbNode.get("scalingEpoch");
        console.log(poolData);
        resolve(true)
      }catch(err){
        global.logger.error(err);
        reject(false)
      }
    });
  }

  getHashepoch(hash){
    return new Promise(async function(resolve, reject) {
      try{
        let currentEpoch = parseInt((await global.storage.dbNode.get("scalingEpoch")).toString());
        resolve(Math.floor(parseInt(hash.slice(2,3),16)/(2**(4-currentEpoch))));
      }catch(err){
        reject(false)
      }
    });
  }
}

module.exports = new genBlock();
