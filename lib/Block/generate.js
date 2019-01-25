
class genBlock{
  constructor(){
    this.BlockTime = this.genTime()
    this.start()
  }
  async genTime(){
    return await global.storage.dbNode.put("blockTime")
  }
  start(){
    setInterval(async function(){
      let poolData = await global.storage.dbPool.get("poolData");
      global.logger.debug("Transactions in Mining Pool",JSON.parse(poolData.toString()).length)
      await global.storage.dbPool.put("poolData",JSON.stringify([]));
    }.bind(this),1000)
  }
}

module.exports = new genBlock();
