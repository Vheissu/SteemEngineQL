import { ssc } from '../client';

export default {
    Query: {
        balances: async (_, { account, limit = 1000, offset = 0 }) => {
            const results: any[] = await ssc.find('tokens', 'balances', { account }, limit, offset, '', false);
            return results;
        },
        tokenBalance: async (_, { symbol, account }) => {
            const params: any = { symbol, account };

            const results: any[] = await ssc.find('tokens', 'balances', {
                account, 
                symbol: { 
                    '$in': [symbol, 'STEEMP'] 
                }
            }, 2, 0, '', false);

            return results;
        }
    }
}