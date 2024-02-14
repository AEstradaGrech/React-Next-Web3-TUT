const { Web3 }  = require('web3');
const ganache = require('ganache');
const assert = require('assert');
const { abi, evm } = require('../ethereum/builds/CampaignFactory-v0.0.2.json')
const campaignJson = require('../ethereum/builds/Campaign-v0.0.2.json');
const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let contract;
let contractAddress;
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(abi)
        .deploy({data: evm.bytecode.object})
        .send({from:accounts[0], gas: '2000000'});

    await factory.methods
        .createCampaign('Testing', 2)
        .send({from: accounts[0], gas: '2000000'});

    contractAddress = await factory.methods.getDeployedCampaigns().call({from:accounts[0], gas: '2000000'});
    contract = await new web3.eth.Contract(campaignJson.abi, contractAddress[0]);
                
    // console.log(' :: DEPLOYED CAMPAIGN ADDRESS: ', contractAddress[0]);
    // console.log(' :: DEPLOYED CAMPAIGN :: \n', contract);
});

it('Should deploy a CampaignFactory contract', () => {
    assert.ok(contract);
});

// it('Should have the right manager address', async () => {
//     console.log(' :: CONTRACT ADDRESS :: \n',contractAddress);
//     let address = await contract.methods.getCreatorAddress().call({from: accounts[0], gas: '1000000'});
//     console.log(address);
// })