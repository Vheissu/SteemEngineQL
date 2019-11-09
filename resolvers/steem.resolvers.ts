import * as steem from 'steem';

export default {
    Mutation: {
        customJSON: async(_: any, { activeKey, name, id, json }) => {
            const result = steem.broadcast.customJsonAsync(activeKey, [name], null, id, json);

            console.log(result);

            return result;
        }
    },
    Query: {
        account: async (_: any, { name }) => {
            let result: any = await steem.api.getAccountsAsync([name]);

            if (result[0]?.json_metadata) {
                result[0].json_metadata = JSON.parse(result[0].json_metadata);
            }

            return result[0];
        },
        accounts: async (_: any, { names }) => {
            let result: any = await steem.api.getAccountsAsync(names);

            return result;
        }
    }
};