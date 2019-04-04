import { ssc } from '../client';

export default {
    Query: {
        tokens: async (_: any, {limit = 1000, offset = 0}) => {
            const results: any[] = await ssc.find('tokens', 'tokens', {}, limit, offset);
            return results;
        },
        tokenParams: async (_: any) => {
            const results: any[] = await ssc.find('tokens', 'params', {});
            return results;
        },
        steempBalance: async(_: any) => {
            const result: any = await ssc.findOne('tokens', 'balances', { account: 'steem-peg', symbol: 'STEEMP' }); 
            return result;
        }
    }
};