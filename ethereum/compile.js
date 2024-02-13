const solc = require('solc');
const fs = require('fs');
const path = require('path');
const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(contractPath, 'utf8');
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
  console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'].CampaignFactory);
  module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'].CampaignFactory;
// const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];

// fs.ensureDirSync(buildPath);

// for (let contract in output)
// {
//    fs.outputJSONSync(path.resolve(buildPath, contract + '.json'), output[contract]);
// }

// console.log(':: ABI :: \n',output['CampaignFactory'].abi);
// console.log(':: EVM :: \n',output['CampaignFactory'].evm);
//module.exports = output['CampaignFactory'];
//console.log(':: MODULE EXPORTS :: \n', JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'].CampaignFactory);
