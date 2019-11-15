import { ssc } from '../client';
import axios from 'axios';

const HISTORY_API_ENDPOINT = 'https://api.steem-engine.com/accounts/history';
const SCOT_API = 'https://scot-api.steem-engine.com/';

async function getScotConfigForAccount(account: string) {
    const result = await axios.get(`${SCOT_API}@${account}`);

    return result.data;
}

export default {
    Query: {
        balances: async (_: any, { account, limit = 1000, offset = 0 }) => {
            let results: any[] = await ssc.find('tokens', 'balances', { account }, limit, offset, '', false);

            for (const token of results) {
                if (token?.balance) {
                    token.balance = parseFloat(token.balance);
                }

                if (token?.delegationsIn) {
                    token.delegationsIn = parseFloat(token.delegationsIn);
                }

                if (token?.delegationsOut) {
                    token.delegationsOut = parseFloat(token.delegationsOut);
                }

                if (token?.stake) {
                    token.stake = parseFloat(token.stake);
                }

                if (token?.pendingUnstake) {
                    token.pendingUnstake = parseFloat(token.pendingUnstake);
                }

                if (token?.metadata) {
                    token.metadata = JSON.parse(token.metadata);
                }
            }

            const scotConfig = await getScotConfigForAccount(account);

            if (results && Object.keys(scotConfig).length) {
                for (const token of results) {
                    const scotConfigToken = scotConfig[token.symbol];

                    if (scotConfigToken) {
                        token.scotConfig = scotConfigToken;
                    }
                }
            }

            return results;
        },
        tokenBalance: async (_: any, { symbol, account }) => {
            const results: any[] = await ssc.find('tokens', 'balances', {
                account,
                symbol: {
                    '$in': [symbol, 'STEEMP'] 
                }
            }, 2, 0, '', false);

            for (const token of results) {
                if (token?.balance) {
                    token.balance = parseFloat(token.balance);
                }

                if (token?.delegationsIn) {
                    token.delegationsIn = parseFloat(token.delegationsIn);
                }

                if (token?.delegationsOut) {
                    token.delegationsOut = parseFloat(token.delegationsOut);
                }

                if (token?.stake) {
                    token.stake = parseFloat(token.stake);
                }

                if (token?.pendingUnstake) {
                    token.pendingUnstake = parseFloat(token.pendingUnstake);
                }

                if (token?.metadata) {
                    token.metadata = JSON.parse(token.metadata);
                }
            }

            const scotConfig = await getScotConfigForAccount(account);

            if (results && Object.keys(scotConfig).length) {
                for (const token of results) {
                    const scotConfigToken = scotConfig[token.symbol];

                    if (scotConfigToken) {
                        token.scotConfig = scotConfigToken;
                    }
                }
            }

            return results;
        },
        history: async (_: any, { account, limit = 100, offset = 0, type = 'user' }) => {
            const result = await axios.get(HISTORY_API_ENDPOINT, {
                headers: {
                    'Origin': 'https://steem-engine.com',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
                },
                params: {
                    account,
                    limit,
                    offset,
                    type
                }
            });
            return result.data;
        },
        scotTokens: async (_: any, { account }) => {
            const scotConfig = await getScotConfigForAccount(account);
            const keys = Object.keys(scotConfig);
            
            const results = keys.reduce((acc: any[], value: any) => {
                acc.push(scotConfig[value]);

                return acc;
            }, []);

            return results;
        },
    }
}