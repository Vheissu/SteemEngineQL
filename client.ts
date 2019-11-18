import SSC = require('sscjs');

const MAIN_NET = 'https://api.steem-engine.com/rpc'
const TEST_NET = 'https://testapi.steem-engine.com';

const ENDPOINT = process.env.NODE_ENV === 'development' ? MAIN_NET : TEST_NET;

// Create an instance of the SSC JS library
export const ssc = new SSC(ENDPOINT);