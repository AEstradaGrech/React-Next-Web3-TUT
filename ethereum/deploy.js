const version = 'v0.0.6';

const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { abi, evm } = require(`./builds/CampaignFactory-${version}.json`);
const path = require('path');
const fs = require('fs-extra');

const buildsPath = path.resolve(__dirname, 'builds');

const pnemonic = 'access action trip ice inflict invite assume maze primary student travel flock';
const endpoint = 'https://sepolia.infura.io/v3/22814a84a4ab473bb5586697bea1e5b5';

const provider = new HDWalletProvider( pnemonic, endpoint);

const web3 = new Web3(provider);

const deploy = async () => {
    let accounts = await web3.eth.getAccounts();
    console.log('Deploying contract from address: ', accounts[0]);
    let contract = await new web3.eth.Contract(abi)
        .deploy({data: evm.bytecode.object})
        .send({from: accounts[0], gas: '3000000'});
    console.log(JSON.stringify(abi));
    fs.outputJSONSync(path.resolve(__dirname,'builds', `campaignsFactory-${version}-deploy.json`), { creator: accounts[0] , address: contract.options.address, abi: abi });
    console.log('Contract deployed to address: ', contract.options.address );
    provider.engine.stop();
}
//updated web3 and hdwallet-provider imports added for convenience

deploy()

// 13/02/24 -> Factory Address: 0x7BC1F6334c397CA12831498810c165123A44da7A, 
//                              0x9eC5dc4ca57B4C21e176d85a33E4C013489897dd (dsde json)
// 13/02/24 -> Factory Abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"minAmount","type":"uint256"}],"name":"createCampaing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCreatorAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDeployedCampaigns","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"}] 
//              (dsd json): [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"minAmount","type":"uint256"}],"name":"createCampaing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCreatorAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDeployedCampaigns","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"}]