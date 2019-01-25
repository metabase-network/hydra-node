'use strict'

class poolMgr{
  constructor(){

  }
  incommingHandler(inData){
    return new Promise(async function(resolve, reject) {
      try{
        let poolData = await global.storage.dbPool.get("poolData");
        poolData = JSON.parse(poolData.toString())
        inData.forEach(async function(i,j){
          if(!poolData.includes(i)){
            poolData.push(i);
          }
        })
        await global.storage.dbPool.put("poolData",JSON.stringify(poolData));
        resolve(true);
      }catch(err){
        console.log(err);
        global.logger.error("Error Detected while handling incomming Tx")
        reject(false)
      }
    });
  }
}
module.exports = new poolMgr()
