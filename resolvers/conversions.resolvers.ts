import { ssc } from '../client';
import axios from 'axios';

const CONVERT_API_ENDPOINT = 'https://converter-api.steem-engine.com/api/conversions/';

export default {
    Query: {
        conversionSent: async (_: any, { account, limit = 20, offset = 0 }) => {
            const result = await axios.get(CONVERT_API_ENDPOINT, {
                headers: {
                    'Origin': 'https://steem-engine.com',
                    'Referer': 'https://steem-engine.com/?p=conversion_history',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
                },
                params: {
                    limit,
                    offset,
                    deposit__from_account: account
                }
            });
            return result.data;
        },

        conversionReceived: async (_: any, { account, limit = 20, offset = 0 }) => {
            const result = await axios.get(CONVERT_API_ENDPOINT, {
                headers: {
                    'Origin': 'https://steem-engine.com',
                    'Referer': 'https://steem-engine.com/?p=conversion_history',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
                },
                params: {
                    limit,
                    offset,
                    to_address: account
                }
            });
            return result.data;
        }
    }
};