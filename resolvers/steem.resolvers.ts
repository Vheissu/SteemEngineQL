import * as steem from 'steem';

export default {
    Query: {
        account: async (_: any, { name }) => {
            let result: any = await steem.api.getAccountsAsync([name]);

            console.log(result);

            return result;
        },
        accounts: async (_: any, { names }) => {
            let result: any = await steem.api.getAccountsAsync(names);

            return result;
        }
    }
};