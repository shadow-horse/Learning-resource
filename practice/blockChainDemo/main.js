const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp,data,previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash =  previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)).toString();
    }
    
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0,"01/01/2018","Genesis block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock = this.chain[i];
            const previouBlock = this.chain[i-1];
            console.log("currentBlock hash: "+currentBlock.hash);
            console.log("currentBlock previous hash: "+currentBlock.previousHash);
            console.log("previousBlocl hash: "+previouBlock.hash);
            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash != previouBlock.hash){
                return false;
            }
            return true;
        }
    }
}


let savjeeCoin = new Blockchain();
savjeeCoin.addBlock(new Block(1,"10/07/2018",{amount:4}));
savjeeCoin.addBlock(new Block(2,"12/07/2018",{amount:10}));
savjeeCoin.addBlock(new Block(3,"12/08/2018",{amount:10}));

console.log("Is blockchain valid? " + savjeeCoin.isChainValid());

savjeeCoin.chain[1].data = {amout:100};
//savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();

console.log("Is blockchain valid? " + savjeeCoin.isChainValid());

//console.log(JSON.stringify(savjeeCoin,null,4));