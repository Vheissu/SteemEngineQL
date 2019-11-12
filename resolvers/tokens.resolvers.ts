import { ssc } from '../client';

export default {
    Query: {
        tokens: async (_: any, {limit = 1000, offset = 0, symbol, symbols = []}) => {
            const queryConfig = {
                symbol,
            };

            if (symbols.length) {
                queryConfig.symbol = { $in: symbols };
            }

            let results: any[] = await ssc.find('tokens', 'tokens', queryConfig, limit, offset);

            results = results.map(result => {
                if (result?.metadata) {
                    result.metadata = JSON.parse(result.metadata);
                }
                
                return result;
            });

            return results;
        },
        contractInfo: async(_: any) => {
            const results: any[] = await ssc.getContractInfo('tokens');
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