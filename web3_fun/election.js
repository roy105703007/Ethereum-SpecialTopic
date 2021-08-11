const fs = require('fs')
const Web3 = require('web3')

let web3 = new Web3('http://localhost:8545')

const abi = JSON.parse(fs.readFileSync('./contract/vote.abi').toString())
const address = fs.readFileSync('./address.txt').toString()
let election = new web3.eth.Contract(abi, address)

let id = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
//投票相關的function
module.exports = {
    //創建新的投票, creater為創建投票人的account address, candidate為候選人資訊，格式為object，password是創投票人自訂的string形式密碼
    create : function(creater, candidate, password){
        //add pasword, 作為身份辨識, 只有知道密碼的人能投票
        let sha3 = web3.utils.soliditySha3(password)
        //將hash過的密碼傳到合約上
        election.methods.AddKeys(sha3).send({
            from : creater,
            gas : 3400000
        }).then(function (receipt) {
            console.log('Add key success')
            console.log(receipt)
            return receipt
        }).then(function(callback){
            //添加候選人到合約中，有幾個候選人要寫在candiate.num上
            for(let i = 0;i < candidate.num;i ++){
                //create a new candidate
                election.methods.createCandidate(candidate.name[i]).send({
                    from: creater,//who create a vote
                    gas: 3400000
                }).then(function (receipt) {
                    console.log('add candiate[' + i.toString() + '] success')
                    console.log(receipt)
                });
            }
        })

    },
    //投票，要先經由公鑰加密後才傳給合約，caller為投票人的address，candiateID是看你要投給幾號候選人，password是由創投票人決定的密碼(作為身分辨識)，key是創投票人生成的公鑰，key.json有
    vote : function(caller, candiateID, password, key){
        //以下為加密過程
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
        let C2 = (candiateID * s) % key.p;
        console.log("c2 = " + C2.toString())

        //vote
        //加密接術後上傳合約
        let message = election.methods.keyAndVote(password, C1, C2, key.p).send({
            from: caller,//who want to a vote
            gas: 3400000
        }).then(function (receipt) {
            console.log('vote success')
            console.log(receipt)
        });

    },
    //開票，creater為創投票人的account address，candidate為候選人資訊，key是creater的密鑰
    open : function(creater, candidate, key){
        //opening
        //上傳密鑰
        election.methods.decode(key.p, key.x).call({
            from: creater, //who create a vote
            gas: 3400000
        }).then(function (receipt) {
            console.log('open success')
            console.log(receipt)

            //initialize
            let count = []
            for(let i = 0; i < candidate.num;i ++){
                count.push(0)
            }
            //將得到的結果因數分解
            while(receipt > 1){
                for(let i = 0;i < candidate.num; i ++){
                    if(receipt % id[i] == 0){
                        count[i] ++;
                        receipt /= id[i]
                    }
                }
            }

            candidate.count = count
            return candidate
        });

    }

}
