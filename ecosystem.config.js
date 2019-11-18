module.exports = {
    apps: [
        {
            name: 'steem-engine-ql',
            script: './node_modules/.bin/ts-node',
            args: 'index.ts',
            env: {
                NODE_ENV: 'development',
                PORT: 4999
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'steem-engine-ql-testnet',
            script: './node_modules/.bin/ts-node',
            args: 'index.ts',
            env: {
                NODE_ENV: 'staging',
                PORT: 4998
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
