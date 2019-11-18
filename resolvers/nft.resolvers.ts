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
            }

            return results;
        },

        nft: async (_: any, { symbol }: any) => {
            const result = await ssc.findOne('nft', 'nfts', { symbol });

            if (result?.metadata) {
                result.metadata = JSON.parse(result.metadata);
            }

            return result;
        }
    }
}