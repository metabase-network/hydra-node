var levelup     = require('levelup');
var leveldown   = require('leveldown');
var path        = require('path');

var storageCategory = [ 'dbNode','dbPool','dbChain','dbState'];

class Storage {
  constructor(opts){

    this.storagePath  = path.resolve(opts);
    this.init();

  }
  init(){
    storageCategory.forEach(function(i,index){
      this[i] = levelup(leveldown(this.storagePath + '/' + i ));
    }.bind(this))
  }
  put(db,key,value){
    console.log(this[db].put);

    return new Promise(async function(resolve, reject) {
      try{
        resolve(await this[db].put(key,value))
      }catch(err){
        reject(err);
      }
    });
  }
  get(db,key,value){
    return new Promise(async function(resolve, reject) {
      try{
        resolve(await this[db].get(key))
      }catch(err){
        reject(err);
      }
    });
  }
  del(db,key,value){
    return new Promise(async function(resolve, reject) {
      try{
        resolve(await this[db].del(key))
      }catch(err){
        reject(err);
      }
    });
  }
}

module.exports = Storage;
