import { ssc } from '../client';

export default {
    Query: {
        buyBook: async (_, { symbol, account }) => {
            const params: any = { symbol, account };

            const results: any[] = await ssc.find('market', 'buyBook', params, 200, 0, [{ index: 'price', descending: true }], false);
            return results;
        },

        sellBook: async (_, { symbol, account }) => {
            const params: any = { symbol, account };

            const results: any[] = await ssc.find('market', 'sellBook', params, 200, 0, [{ index: 'price', descending: true }], false);
            return results;
        },

        tradesHistory: async (_, { symbol }) => {
            const params: any = { symbol };

            const results: any[] = await ssc.find('market', 'tradesHistory', params, 30, 0, [
                { 
                    index: 'timestamp', 
                    descending: false 
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