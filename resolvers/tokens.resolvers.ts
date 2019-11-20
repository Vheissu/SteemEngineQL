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

            const results = [];

            const tokens: any[] = await ssc.find('tokens', 'tokens', queryConfig, limit, offset);
            const metrics = await ssc.find('market', 'metrics', queryConfig, limit, offset, '', false);

            for (const token of tokens) {
                if (token?.metadata) {
                    token.metadata = JSON.parse(token.metadata);
                }

                const metric = metrics.find(m => token.symbol == m.symbol);

                if (metric) {
                    token.metric = metric;
                }
            }

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