import { ssc } from '../client';
import axios from 'axios';

const MARKET_HISTORY_ENDPOINT = 'https://api.steem-engine.com/history/marketHistory';

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

        metrics: async (_, { limit = 1000, offset = 0, symbol, symbols = [] }) => {
            let results: any[] = await ssc.find('market', 'metrics', { symbol }, limit, offset, '', false);

            if (symbols.length) {
                results = results.filter(token => symbols.includes(token.symbol));
            }

            return results;
        },

        marketHistory: async (_, { symbol, timestampStart, timestampEnd,  }) => {
            const result: any = await axios.get(MARKET_HISTORY_ENDPOINT, {
                params: {
                    symbol,
                    timestampStart,
                    timestampEnd
                }
            });

            return result.data;
        }
    }
}