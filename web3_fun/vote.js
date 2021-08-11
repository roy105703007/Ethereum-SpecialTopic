const fs = require('fs')
const Web3 = require('web3')

let web3 = new Web3('http://localhost:8545')

const abi = JSON.parse(fs.readFileSync('../contract/vote.abi').toString())
const address = fs.readFileSync('../address.txt').toString()
let election = new web3.eth.Contract(abi, address)

let caller = 0;/*change here to change who want to vote---------------------------------------------------*/
let candidate = 3;/*change here to change which candidate caller want to vote-------------------------------------*/

let key = JSON.parse(fs.readFileSync('../key.json')).key[Math.floor((Math.random() * 0) )];/*public key ---------------------------------------------------*/
console.log("key = " );console.log(key)
let y = Math.floor(Math.random() * (key.p / 2 - 3)) + 2;
console.log("y = " + y.toString())

function pow(base, power, mod){
    let n = 1;
    for(let i = 0;i < power;i ++){
        n = n * base % mod;
    }
    return n;
}

let C1 = pow(key.g, y, key.p);
console.log("c1 = " + C1.toString())

let s = pow(key.h, y, key.p);
console.log("s = " + s.toString())
let C2 = (candidate * s) % key.p;
console.log("c2 = " + C2.toString())

web3.eth.getAccounts().then(function (accounts) {

    //create a new vote
    election.methods.keyAndVote('roy', C1, C2).send({
        from: accounts[caller],//who want to a vote
        gas: 3400000,
    }).then(function (receipt) {
        console.log(receipt)
    });

})