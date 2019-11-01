import { ssc } from '../client';

export default {
    Query: {
        buyBook: async (_, { symbol, account, limit = 200, offset = 0 }) => {
            const params: any = { symbol, account };

            const results: any[] = await ssc.find('market', 'buyBook', params, limit, offset,
                [{ index: 'priceDec', descending: true }], false);
            return results;
        },

        sellBook: async (_, { symbol, account, limit = 200, offset = 0 }) => {
            const params: any = { symbol, account };

            const results: any[] = await ssc.find('market', 'sellBook', params, limit, offset,
                [{ index: 'priceDec', descending: true }], false);
            return results;
        },

        tradesHistory: async (_, { symbol, limit = 30, offset = 0 }) => {
            const params: any = { symbol };

            const results: any[] = await ssc.find('market', 'tradesHistory', params, limit, offset, [
                { 
                    index: '_id',
                    descending: true
                }
            ], false);

            return results;
        },

        metrics: async (_, { limit = 1000, offset = 0 }) => {
            const results: any[] = await ssc.find('market', 'metrics', { }, limit, offset, '', false);
            return results;
        }
    }
}