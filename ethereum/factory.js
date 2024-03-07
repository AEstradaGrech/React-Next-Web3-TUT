const { abi, address } = require('./builds/campaignsFactory-v0.0.11-deploy.json')
import web3 from './web3';

const instance = new web3.eth.Contract(abi, address);

export default instance;