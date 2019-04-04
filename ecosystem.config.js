module.exports = {
    apps : [{
      name: "steem-engine-ql",
      script: "./node_modules/.bin/ts-node",
      args: "index.ts",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }