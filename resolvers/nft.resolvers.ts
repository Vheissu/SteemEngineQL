import { ssc } from '../client';

export default {
    Query: {
        nfts: async (_: any, { account, limit = 200, offset = 0 }: any) => {
            const params: any = { account };

            const results: any[] = await ssc.find('nft', 'nfts', params, limit, offset, [], false);
            
            for (const nft of results) {
                if (nft?.metadata) {
                    nft.metadata = JSON.parse(nft.metadata);
                }

                if (nft?.properties) {
                    let finalProperties = [];

                    for (const [key, value] of Object.entries(nft.properties) as any) {
                        finalProperties.push({ name: key, ...value });
                    }

                    nft.properties = finalProperties;
                }
            }

            return results;
        },

        nft: async (_: any, { symbol }: any) => {
            const result = await ssc.findOne('nft', 'nfts', { symbol });

            if (result?.metadata) {
                result.metadata = JSON.parse(result.metadata);
            }

            if (result?.properties) {
                let finalProperties = [];

                for (const [key, value] of Object.entries(result.properties) as any) {
                    finalProperties.push({ name: key, ...value });
                }

                result.properties = finalProperties;
            }

            return result;
        },
    }
}