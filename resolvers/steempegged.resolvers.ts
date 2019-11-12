import { ssc } from '../client';

export default {
    Query: {
        pendingWithdrawals: async (_: any, {limit = 1000, offset = 0, account}) => {
            const queryConfig = {};

            if (account) {
                // @ts-ignore
                queryConfig.recipient = account;
            }

            let results: any[] = await ssc.find('steempegged', 'withdrawals', queryConfig, limit, offset);

            return results;
        }
    }
};