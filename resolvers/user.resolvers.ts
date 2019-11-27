import { ssc } from '../client';
import axios from 'axios';
import { usdFormat, getPrices, getScotConfigForAccount } from '../helpers';

const HISTORY_API_ENDPOINT = 'https://api.steem-engine.com/accounts/history';

export default {
    Query: {
        balances: async (_: any, { account, limit = 1000, offset = 0 }) => {
            const prices: any = await getPrices();
            let results: any[] = await ssc.find('tokens', 'balances', { account }, limit, offset, '', false);

            const symbols = results.reduce((acc: string[], value: any) => {
                acc.push(value.symbol);
                return acc;
            }, []);

            const tokens = await ssc.find('tokens', 'tokens', { symbol: { $in: symbols } }, 1000, 0);
            const metrics = await ssc.find('market', 'metrics', { symbol: { $in: symbols } }, 1000, 0, '', false);

            for (const token of results) {
                if (token?.balance) {
                    token.balance = parseFloat(token.balance);
                }

                if (token?.delegationsIn) {
                    token.delegationsIn = parseFloat(token.delegationsIn);
                }

                if (token?.delegationsOut) {
                    token.delegationsOut = parseFloat(token.delegationsOut);
                }

                if (token?.stake) {
                    token.stake = parseFloat(token.stake);
                }

                if (token?.pendingUnstake) {
                    token.pendingUnstake = parseFloat(token.pendingUnstake);
                }

                const findToken = tokens.find(t => t.symbol === token.symbol);
                const findMetric = metrics.find(m => m.symbol === token.symbol);

                token.token = findToken;
                token.metric = findMetric;

                if (token.token) {
                    token.token.metadata = JSON.parse(token.token.metadata);
                }
                
                if (token.metric) {
                    token.metric.highestBid = parseFloat(token.metric.highestBid);
                    token.metric.lastPrice = parseFloat(token.metric.lastPrice);
                    token.metric.lowestAsk = parseFloat(token.metric.lowestAsk);
                    token.metric.marketCap = token.metric.lastPrice * parseFloat(token.circulatingSupply);
                    token.metric.lastDayPrice = parseFloat(token.metric.lastDayPrice);

                    if (token.metric.priceChangePercent !== null) {
                        token.metric.priceChangePercent = token.metric.priceChangePercent.replace('%', '');
                    }
                }

                if (token?.metric?.volumeExpiration >= 0) {
                    if (Date.now() / 1000 < token.metric.volumeExpiration) {
                        token.metric.volume = parseFloat(token.metric.volume);
                    }
                }

                if (token?.metric?.lastDayPriceExpiration >= 0) {
                    if (Date.now() / 1000 < token.metric.lastDayPriceExpiration) {
                        token.metric.priceChangePercent = parseFloat(token.metric.priceChangePercent);
                        token.metric.priceChangeSteem = parseFloat(token.metric.priceChangeSteem);
                    }
                }

                if (token?.metric?.lastPrice) {
                    token.usdValueFormatted = usdFormat(parseFloat(token.balance) * token.metric.lastPrice, 3, prices.steem_price);
                    token.usdValue = usdFormat(parseFloat(token.balance) * token.metric.lastPrice, 3, prices.steem_price, true);
                } else {
                    token.usdValueFormatted = usdFormat(parseFloat(token.balance) * 1, 3, prices.steem_price);
                    token.usdValue = usdFormat(parseFloat(token.balance) * 1, 3, prices.steem_price, true);
                }
            }

            const scotConfig = await getScotConfigForAccount(account);

            if (results && Object.keys(scotConfig).length) {
                for (const token of results) {
                    const scotConfigToken = scotConfig[token.symbol];

                    if (scotConfigToken) {
                        token.scotConfig = scotConfigToken;
                    }
                }
            }

            return results;
        },
        tokenBalance: async (_: any, { symbol, account }) => {
            const results: any[] = await ssc.find('tokens', 'balances', {
                account,
                symbol: {
                    '$in': [symbol, 'STEEMP'] 
                }
            }, 2, 0, '', false);

            for (const token of results) {
                if (token?.balance) {
                    token.balance = parseFloat(token.balance);
                }

                if (token?.delegationsIn) {
                    token.delegationsIn = parseFloat(token.delegationsIn);
                }

                if (token?.delegationsOut) {
                    token.delegationsOut = parseFloat(token.delegationsOut);
                }

                if (token?.stake) {
                    token.stake = parseFloat(token.stake);
                }

                if (token?.pendingUnstake) {
                    token.pendingUnstake = parseFloat(token.pendingUnstake);
                }

                if (token?.metadata) {
                    token.metadata = JSON.parse(token.metadata);
                }
            }

            const scotConfig = await getScotConfigForAccount(account);

            if (results && Object.keys(scotConfig).length) {
                for (const token of results) {
                    const scotConfigToken = scotConfig[token.symbol];

                    if (scotConfigToken) {
                        token.scotConfig = scotConfigToken;
                    }
                }
            }

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
        scotTokens: async (_: any, { account }) => {
            const scotConfig = await getScotConfigForAccount(account);
            const keys = Object.keys(scotConfig);
            
            const results = keys.reduce((acc: any[], value: any) => {
                acc.push(scotConfig[value]);

                return acc;
            }, []);

            return results;
        },
    }
}