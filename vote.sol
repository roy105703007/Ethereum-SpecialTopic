pragma solidity ^0.4.25;
contract Vote {
    struct candidate{
        string candidateName;
        uint candidateId;
        uint numberOfVote;
    }
    candidate[] candidates;
    uint idCount = 0;
    uint C1 = 1;
    uint C2 = 1;
    uint[] id = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    uint[] keys;
    function AddKeys(uint k){
        keys.push(k);
    }
    //105777642032448366460234198415590594741299614061019231004883639673054673335513 = "roy"
    function createCandidate(string name) returns (uint){
        if (idCount<10){
            candidates.push(candidate(name, id[idCount], 0));
            idCount += 1;
        }
        return candidates[idCount-1].candidateId;
    }
    function getC1() returns (uint c1){
        return C1;
    }
    function getC2() returns (uint c2){
        return C2;
    }
    function keyAndVote(string s, uint c1, uint c2) returns (string){
        uint rand = uint(keccak256(abi.encodePacked(s)));
        for(uint i=0; i<keys.length; i++){
            if(rand==keys[i]){
                C1 *= c1;
                C2 *= c2;
                return "Vote success";
            }
            else{
                return "Key error";
            }
        }
    }
    function ext_euclid(uint a, uint b) returns (uint X, uint Y, uint Q){
        uint x;
        uint y;
        uint q;
        uint tempx;
        uint tempy;
        if(b == 0){
            return (1, 0, a);
        }
        else {
            (x, y, q)= ext_euclid(b, a % b);
            tempx = x;
            tempy = y;
            x = y;
            y = tempx-(a/b)*tempy;
        }
        return (x, y, q);
    }
    function decode(uint p, uint x) returns (uint m) {
        uint nk;
        uint K = C1;
        for(uint j=0; j<x-1; j++){
            K = K*C1%p;
        }
        (nk,,) = ext_euclid(K,p);
        ///for(uint i=0; i<2000; i++){
        ///    if (K*i%p == 1){
        ///        uint nk=i;
        ///        break;
        ///    }
        ///}
        uint M=C2*nk%p;
        uint n=M;
        uint prime = 2;
        uint kk;
        if(n==prime){
            vote(n);
        }
        else {
            while (n>=prime){
                kk=n%prime;
                if( kk == 0){
                    vote(prime);
                    n=n/prime;
                }
                else {
                    prime=prime+1;
                }
            }
        }
        //vote(M);
        return M;
    }
    function vote(uint id){
        uint len = candidates.length;
        for(uint i=0; i<len; i++){
            if(candidates[i].candidateId == id){
                candidates[i].numberOfVote +=1;
            }
        }
    }
    function openBallot() returns (string s){
        uint len = candidates.length;
        uint max = 0;
        uint id;
        for(uint i=0; i<len; i++){
            if(candidates[i].numberOfVote > max){
                max = candidates[i].numberOfVote;
                id = i;
            }
        }
        return candidates[id].candidateName;
    }
}
