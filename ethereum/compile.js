const solc = require('solc');
const Web3 = require('web3');
const fs = require('fs-extra');
const path = require('path')

const buildPath = path.resolve(__dirname, 'builds');
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(contractPath, 'utf-8');
const input = {
    language: 'Solidity',
    sources: {
      'Campaign.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];

fs.ensureDirSync(buildPath);
const version = '0.0.4';
for (let contract in output)
{
   fs.outputJSONSync(path.resolve(buildPath, `${contract}-v${version}.json`), output[contract]);
}

// console.log(':: ABI :: \n',output['CampaignFactory'].abi);
// console.log(':: EVM :: \n',output['CampaignFactory'].evm);
//module.exports = output['CampaignFactory'];
//console.log(':: MODULE EXPORTS :: \n', JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'].CampaignFactory);
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'].CampaignFactory;