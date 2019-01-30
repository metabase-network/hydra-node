// Imports
let crypto   = require('crypto');
let hashfx   = crypto.createHash;
let merkle   = require('merkletreejs');
let SHA256   = require('crypto-js/sha256')

//Constructor
class consensus_PoW {
  constructor(opts){
    this.difficulty = 3;
  }
  deriveMerkle(hashes) {
    return  new Promise(function(resolve, reject) {
      try{
        let leaves = hashes.map(x => SHA256(x))
        let tree = new merkle(leaves, SHA256)
        let merkleRoot = '0x'+tree.getRoot().toString('hex');
        resolve(merkleRoot)
      }catch(err){
        reject(false);
      }
    });
  }
  derivePoW( input ){
    return new Promise(function(resolve, reject) {
      try{
        var id = 0;
        input.slice(0,2) === '0x' ? input=input.slice(2,input.length) : input=input;
        let result;
        let loop = true;
        while (loop) {
          var nonce = id.toString(16);
          var sha256 = hashfx('sha256');
          sha256.update(input);
          sha256.update(nonce);
          var xp = sha256.digest('hex');
          if (xp.slice(-3) === '000') {
            result = {
              "nonce" : "0x"+nonce,
              "proof" : '0x'+xp,
              "merkleRoot" : '0x'+input
            };
            loop = false;
          }else{
            id++;
          }
        }
        resolve(result)
      }catch(err){
        reject(0)
      }
    });
  }
  verifyPoW( input ,nonce){
    return  new Promise(function(resolve, reject) {
      try{
        input.slice(0,2) === '0x' ? input=input.slice(2,input.length) : input=input;
        nonce.slice(0,2) === '0x' ? nonce=nonce.slice(2,nonce.length) : nonce=nonce;
        var id = 0;
        var sha256 = hashfx('sha256');
        sha256.update(input);
        sha256.update(nonce);
        if (sha256.digest('hex').slice(-3) === '000'){
            resolve(true)
        }else{
          reject(false)
        }
      }catch(err){
        reject(false)
      }
    });
  }

  verifyHash( input ,nonce){
    return new Promise(function(resolve, reject) {
      try{
        input.slice(0,2) === '0x' ? input=input.slice(2,input.length) : input=input;
        nonce.slice(0,2) === '0x' ? nonce=nonce.slice(2,nonce.length) : nonce=nonce;

        var id = 0;
        var sha256 = hashfx('sha256');
        sha256.update(input);
        sha256.update(nonce);
        resolve('0x'+sha256.digest('hex'))
      }catch(err){
        reject(0x0)
      }
    });
  }

  generate(hashes){
    return new Promise(async function(resolve, reject) {
      try{
        let merkleRoot = await this.deriveMerkle(hashes);
        let powProof   = await this.derivePoW(merkleRoot);
        resolve(powProof);
      }catch(err){
        reject(false);
      }
    }.bind(this));
  }

  verify(hashes,proof){
    return new Promise(async function(resolve, reject) {
      try{
        let merkleRoot = await this.deriveMerkle(hashes);
        let powProof = await this.verifyPoW(merkleRoot,proof.nonce)
        if(merkleRoot === proof.merkleRoot && powProof === true){
          resolve(true);
        }else{
          reject(false);
        }
      }catch(err){
        reject(false);
      }
    }.bind(this));
  }

}

//Execution
module.exports = consensus_PoW;
