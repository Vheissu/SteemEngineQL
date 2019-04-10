import { ssc } from '../client';
import axios from 'axios';

const HISTORY_API_ENDPOINT = 'https://api.steem-engine.com/accounts/history';

export default {
    Query: {
        balances: async (_: any, { account, limit = 1000, offset = 0 }) => {
            const results: any[] = await ssc.find('tokens', 'balances', { account }, limit, offset, '', false);
            return results;
        },
        tokenBalance: async (_: any, { symbol, account }) => {
            const params: any = { symbol, account };

            const results: any[] = await ssc.find('tokens', 'balances', {
                account,
                symbol: {
                    '$in': [symbol, 'STEEMP'] 
                }
            }, 2, 0, '', false);

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
    }
}