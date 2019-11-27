import { ssc } from '../client';
import { usdFormat, getPrices, getScotConfigForAccount } from '../helpers';

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

            if (!symbols.length) {
                const tokenSymbols = [];

                for (const token of tokens) {
                    tokenSymbols.push(token.symbol);
                }

                queryConfig.symbol = { $in: tokenSymbols };
            }

            const metrics = await ssc.find('market', 'metrics', queryConfig, limit, offset, '', false);

            for (const token of tokens) {
                if (token?.metadata) {
                    token.metadata = JSON.parse(token.metadata);
                }

                const metric = metrics.find(m => token.symbol == m.symbol);

                if (metric) {
                    metric.highestBid = parseFloat(metric.highestBid);
                    metric.lastPrice = parseFloat(metric.lastPrice);
                    metric.lowestAsk = parseFloat(metric.lowestAsk);
                    metric.marketCap = metric.lastPrice * parseFloat(token.circulatingSupply);
                    metric.lastDayPrice = parseFloat(metric.lastDayPrice);

                    if (metric.priceChangePercent !== null) {
                        metric.priceChangePercent = metric.priceChangePercent.replace('%', '');
                    }

                    if (Date.now() / 1000 < metric.volumeExpiration) {
                        metric.volume = parseFloat(metric.volume);
                    }
        
                    if (Date.now() / 1000 < metric.lastDayPriceExpiration) {
                        metric.priceChangePercent = parseFloat(metric.priceChangePercent);
                        metric.priceChangeSteem = parseFloat(metric.priceChangeSteem);
                    }
                    
                    token.metric = metric;
                } else {
                    token.metric = {
                        highestBid: 0,
                        lastPrice: 0,
                        lowestAsk: 0,
                        marketCap: 0,
                        volume: 0,
                        lastDayPrice: 0,
                        priceChangePercent: 0,
                        priceChangeSteem: 0
                    };
                }

                if (token.symbol === 'STEEMP') {
                    token.metric.lastPrice = 1;
                }

                results.push(token);
            }

            results.sort((a, b) => {
                return (
                    (b.metric.volume > 0 ? b.metric.volume : b.metric.marketCap / 1000000000) - (a.metric.volume > 0 ? a.metric.volume : a.metric.marketCap / 1000000000)
                );
            });

            return results;
        },
        symbolBalances: async (_: any, { symbol, symbols = [], limit = 1000, offset = 0 }) => {
            const queryConfig = {
                symbol,
            };

            if (symbols.length) {
                queryConfig.symbol = { $in: symbols };
            }
            
            const prices: any = await getPrices();
            let results: any[] = await ssc.find('tokens', 'balances', queryConfig, limit, offset, '', false);

            if (!symbols.length) {
                const tokenSymbols = [];

                for (const token of results) {
                    tokenSymbols.push(token.symbol);
                }

                queryConfig.symbol = { $in: tokenSymbols };
            }

            const metrics = await ssc.find('market', 'metrics', queryConfig, limit, offset, '', false);

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

                const findMetric = metrics.find(m => m.symbol === token.symbol);

                token.metric = findMetric;
                
                if (token.metric) {
                    token.metric.highestBid = parseFloat(token.metric.highestBid);
                    token.metric.lastPrice = parseFloat(token.metric.lastPrice);
                    token.metric.lowestAsk = parseFloat(token.metric.lowestAsk);
                    token.metric.marketCap = token.metric.lastPrice * parseFloat(token.circulatingSupply);
                    token.metric.lastDayPrice = parseFloat(token.metric.lastDayPrice);

                    if (token.metric.priceChangePercent !== null) {
                        token.metric.priceChangePercent = token.metric.priceChangePercent.toString().replace('%', '');
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