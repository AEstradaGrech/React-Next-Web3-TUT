// get metamask provider
import Web3 from 'web3';

let web3;
//client / browser MM provider
if(typeof window !== "undefined" && typeof window.ethereum !== "undefined" ){
    window.ethereum.request({method: 'eth_requestAccounts'})
    web3 = new Web3(window.ethereum);    
}//next / server processing !MetaMask provider
else{
    const provider = new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/22814a84a4ab473bb5586697bea1e5b5');
    web3 = new Web3(provider);
}

export default web3;