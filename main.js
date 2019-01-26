const SHA256 = require("crypto-js/sha256");

class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("block mined:" + this.hash)
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("25/01/2019", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!")
        this.chain.push(block);

        this.pendingTransactions = [
            new Transactions(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction)
    }
    
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount
                }
            }
        }
        return balance;
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let sampleCoin = new Blockchain();
sampleCoin.createTransaction(new Transactions('address1', 'address2', 100))
sampleCoin.createTransaction(new Transactions('address2', 'address1', 50))

console.log('\n Starting the miner...')
sampleCoin.minePendingTransactions('loke-address');

console.log('\nBalance of loke is ', sampleCoin.getBalanceOfAddress('loke-address'));

console.log('\n Starting the miner again...')
sampleCoin.minePendingTransactions('loke-address');

console.log('\nBalance of loke is ', sampleCoin.getBalanceOfAddress('loke-address'));

// console.log("mining block 1...")
// sampleCoin.addBlock(new Block(1, '26/01/2019', { amount: 5 }));

// console.log("mining block 2...")
// sampleCoin.addBlock(new Block(2, '27/02/2019', { amount: 25 }));

// console.log(JSON.stringify(sampleCoin, null , 4))
// console.log('is blockchain valid? ', sampleCoin.isChainValid());

// sampleCoin.chain[1].data = { amount: 100 };
// sampleCoin.hash = sampleCoin.chain[1].calculateHash();

// console.log('is blockchain valid? ', sampleCoin.isChainValid());