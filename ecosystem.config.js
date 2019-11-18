module.exports = {
    apps: [
        {
            name: 'steem-engine-ql',
            script: './node_modules/.bin/ts-node',
            args: 'index.ts',
            env: {
                NODE_ENV: 'development',
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
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
