import { ssc } from '../client';

export default {
    Query: {
        tokens: async (_: any, {limit = 1000, offset = 0, symbol, symbols = [], resultLimit = 100, resultOffset = 0}) => {
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

            return results.slice(resultOffset * resultLimit, (resultOffset + 1) * resultLimit);
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