import { ssc } from '../client';

const parseBlockJsonStrings = result => {
    if (result?.transactions) {
        result.transactions = result.transactions.map(transaction => {
            if (transaction?.payload) {
                transaction.payload = JSON.parse(transaction.payload);
            }

            if (transaction?.logs) {
                transaction.logs = JSON.parse(transaction.logs);
            }

            return transaction;
        });
    }

    return result;
}

export default {
    Query: {
        latestBlockInfo: async (_: any) => {
            let result: any = await ssc.getLatestBlockInfo();

            result = parseBlockJsonStrings(result);

            return result;
        },
        blockInfo: async (_: any, { blockNumber }) => {
            let result: any = await ssc.getBlockInfo(blockNumber);

            result = parseBlockJsonStrings(result);

            return result;
        },
        transactionInfo: async (_: any, { txId }) => {
            let result: any = await ssc.getTransactionInfo(txId);

            result = parseBlockJsonStrings(result);

            return result;
        },
    }
};