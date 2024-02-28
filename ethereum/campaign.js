
import { abi } from './builds/Campaign-v0.0.5.json'
import web3 from './web3.js'

export default address => { return new web3.eth.Contract(abi, address)} 
