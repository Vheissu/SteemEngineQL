import * as steem from 'steem';

export default {
    Mutation: {
        customJSON: async(_: any, {input}) => {
            const result = await steem.broadcast.customJsonAsync(input.activeKey, [input.name], null, input.id, JSON.stringify(input.json));

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