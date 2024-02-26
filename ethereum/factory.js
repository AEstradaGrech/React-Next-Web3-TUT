//const { abi, evm } = require('./builds/CampaignFactory-v0.0.2.json')
const { abi, address } = require('./builds/campaignsFactory-v0.0.3-deploy.json')
import web3 from './web3';

const instance = new web3.eth.Contract(abi, address);

export default instance;