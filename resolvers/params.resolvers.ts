import { ssc } from '../client';

export default {
    Query: {
        sscstore: async (_: any) => {
            const results: any[] = await ssc.find('sscstore', 'params', {});
            return results;
        },

        tokens: async (_: any) => {
            const results: any[] = await ssc.find('tokens', 'params', {});
            return results;
        }
    }
};