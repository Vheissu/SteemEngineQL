import axios from 'axios';

const CONVERT_API_ENDPOINT = 'https://converter-api.steem-engine.com/api/';

export default {
    Query: {
        coinPairs: async(_: any, {}) => {
            const coins = await axios.get(`${CONVERT_API_ENDPOINT}coins/`, {
                headers: {
                    'Origin': 'https://steem-engine.com',
                    'Referer': 'https://steem-engine.com/?p=conversion_history',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
                }
            });

            const pairs = await axios.get(`${CONVERT_API_ENDPOINT}pairs/`, {
                headers: {
                    'Origin': 'https://steem-engine.com',
                    'Referer': 'https://steem-engine.com/?p=conversion_history',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
                }
            });

            let tokenPairs = [];
            const nonPeggedCoins = coins.data.filter(x => x.coin_type !== 'steemengine');

            const steem = { name: 'STEEM', symbol: 'STEEM', pegged_token_symbol: 'STEEMP' };
            tokenPairs.push(steem);

            for (const x of nonPeggedCoins) {
                // find pegged coin for each non-pegged coin
                const coinFound = pairs.data.find(y => y.from_coin_symbol === x.symbol);

                if (coinFound) {
                    const tp = {
                        name: x.display_name,
                        symbol: x.symbol,
                        pegged_token_symbol: coinFound.to_coin_symbol
                    }
    
                    // check if the token exists
                    if (!tokenPairs.find(x => x.pegged_token_symbol == tp.pegged_token_symbol)) {
                        tokenPairs.push(tp);
                    }
                }
            }
    
            // sort the coins
            tokenPairs = tokenPairs.sort((a, b) => a.name.localeCompare(b.name));

            return tokenPairs;
        },

        conversionSent: async (_: any, { account, limit = 20, offset = 0 }) => {
            const result = await axios.get(`${CONVERT_API_ENDPOINT}conversions/`, {
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
            const result = await axios.get(`${CONVERT_API_ENDPOINT}conversions/`, {
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