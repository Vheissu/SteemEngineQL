import { ssc } from '../client';

export default {
    Query: {
        nfts: async (_: any, { account, limit = 200, offset = 0 }: any) => {
            const params: any = { };

            if (account) {
                params.issuer = account;
            }

            const results: any[] = await ssc.find('nft', 'nfts', params, limit, offset, [], false);
            
            for (const nft of results) {
                if (nft?.metadata) {
                    nft.metadata = JSON.parse(nft.metadata);
                }

                nft.orders = [];
                const orders: any[] = await ssc.find('nftmarket', `${nft.symbol.toUpperCase()}sellBook`, { }, 100, 0, [], false);

                if (orders && orders.length) {
                    nft.orders = orders;
                }

                if (nft?.properties) {
                    let finalProperties = [];

                    for (const [key, value] of Object.entries(nft.properties) as any) {
                        finalProperties.push({ name: key, ...value });
                    }

                    nft.properties = finalProperties;
                }

                if (!nft?.groupBy) {
                    nft.groupBy = [];
                }
            }

            return results;
        },

        nft: async (_: any, { symbol }: any) => {
            const result = await ssc.findOne('nft', 'nfts', { symbol });

            if (result) {
                if (result?.metadata) {
                    result.metadata = JSON.parse(result.metadata);
                }

                result.orders = [];
                const orders: any[] = await ssc.find('nftmarket', `${symbol.toUpperCase()}sellBook`, { }, 100, 0, [], false);

                if (orders && orders.length) {
                    result.orders = orders;
                }
    
                if (result?.properties) {
                    let finalProperties = [];
    
                    for (const [key, value] of Object.entries(result.properties) as any) {
                        finalProperties.push({ name: key, ...value });
                    }
    
                    result.properties = finalProperties;
                }
    
                if (!result?.groupBy) {
                    result.groupBy = [];
                }
            }

            return result;
        },

        userNfts: async (_: any, { account, limit = 1000, offset = 0 }) => {
            let userOwnedNfts = [];

            const nfts: any[] = await ssc.find('nft', 'nfts', {  }, limit, offset, [], false);

            for (const nft of nfts) {
                const instances: any[] = await ssc.find('nft', `${nft.symbol}instances`, { account }, limit, offset, [], false);

                for (const instance of instances) {
                    instance.symbol = nft.symbol;
                }

                if (instances) {
                    userOwnedNfts = [ ...userOwnedNfts, ...instances ];
                }

                if (!nft?.groupBy) {
                    nft.groupBy = [];
                }
            }

            return userOwnedNfts;
        },

        nftSellBook: async (_: any, { symbol, account, limit = 50, offset = 0 }) => {
            const options: any = {};

            if (account) {
                options.account = { $in: [account] };
            }

            const orders: any[] = await ssc.find('nftmarket', `${symbol.toUpperCase()}sellBook`, { }, limit, offset, [], false);

            return orders;
        },

        nftUserSellBooks: async (_: any, { account, limit = 50, offset = 0 }) => {
            const options: any = {
                account: { $in: [account] }
            };

            const orders = [];

            const results: any[] = await ssc.find('nft', 'nfts', { }, 999, 0, [], false);
            for (const nft of results) {
                const symbol = nft.symbol;

                const ordersResponse: any[] = await ssc.find('nftmarket', `${symbol.toUpperCase()}sellBook`, options, limit, offset, [], false);

                if (ordersResponse && ordersResponse.length) {
                    orders.push(...ordersResponse);
                }
            }

            return orders;
        },

        nftTradesHistory: async (_: any, { symbol, limit = 50, offset = 0 }) => {
            const history: any[] = await ssc.find('nftmarket', `${symbol.toUpperCase()}tradesHistory`, { }, limit, offset, [], false);

            return history;
        },

        nftOpenInterest: async (_: any, { symbol, limit = 50, offset = 0 }) => {
            const interest: any[] = await ssc.find('nftmarket', `${symbol.toUpperCase()}openInterest`, { }, limit, offset, [], false);

            return interest;
        },

        instances: async (_: any, { symbol, account, limit = 200, offset = 0 }: any) => {
            const params: any = { account };

            const results: any[] = await ssc.find('nft', `${symbol.toUpperCase()}instances`, params, limit, offset, [], false);

            return results;
        },

        nftParams: async (_: any) => {
            const result = await ssc.findOne('nft', 'params', {  });

            for (const [key, value] of Object.entries(result) as any) {
                if (!Object.keys(value)) {
                    result[key] = parseFloat(value);
                }
            }

            return result;
        },
    }
}