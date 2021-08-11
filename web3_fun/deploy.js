const fs = require('fs');
const Web3 = require('web3');

let web3 = new Web3('http://localhost:8545')

const abi = JSON.parse(fs.readFileSync('./contract/vote.abi').toString())
const bytecode = '0x' + fs.readFileSync('./contract/vote.bin').toString()
let election = new web3.eth.Contract(abi)

module.exports = {
    //address 為部屬合約的人 的account address，在demo裡是誰不重要
    deploy : function (address) {
        // deploy contract

        election.deploy({
            data: bytecode
        }).send({
            from: address,//one of account-----------------------------------------------------
            gas: 3400000
        }).on('receipt', function(newElection){
            // instance with the new contract address
            console.log(newElection);
            fs.writeFileSync('./address.txt', newElection.contractAddress);

            return 'deploy success'
        })
    }
}
