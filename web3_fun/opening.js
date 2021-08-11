const fs = require('fs')
const Web3 = require('web3')

let web3 = new Web3('http://localhost:8545')

const abi = JSON.parse(fs.readFileSync('../contract/vote.abi').toString())
const address = fs.readFileSync('../address.txt').toString()
let election = new web3.eth.Contract(abi, address)

let creater = 0;/*change here to change who create this vote----------------------------------------------*/
let key = JSON.parse(fs.readFileSync('../key.json')).key[Math.floor((Math.random() * 0) )];/*private key---------------------------------------------------------------------*/

web3.eth.getAccounts().then(function (accounts) {

    //create a new vote
    election.methods.decode(key.p, key.x).call({
        from: accounts[creater],//who create a vote
        gas: 3400000,
    }).then(function (receipt) {
        console.log(receipt)
    });

})