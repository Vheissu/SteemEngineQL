# SteemEngineQL

A GraphQL API implementation for Steem Engine.


## What is this?

If you're familiar with [Steem Engine](https://steem-engine.com), it is a Steem blockchain sidechain that allows the creation of custom tokens. While Steem Engine itself provides an official library for working with Steem Engine in the form of [sscjs](https://github.com/harpagon210/sscjs#readme) and a few other non-official options, admittedly it gets quite chatty when you start making requests.

This GraphQL layer aims to make it easier to request Steem Engine data in bulk without the need for constant requests causing a chatty application.

## Requirements

- [Node.js and Node Package Manager](https://nodejs.org/en/) (Npm)

## Installation and Running

- Download this repository, either clone it or download a ZIP file [here](https://github.com/Vheissu/SteemEngineQL/archive/master.zip).
- Install the dependencies using Npm: `npm install`
- Run the API: `npm start`
- A GraphQL server runs on port `4999` by default, this can be easily changed
- While running, you can visit the playground and make queries `http://localhost:4999`

## Usage

You will then query the API using your chosen client-side GraphQL client to make queries to the API.

### Conversions

GraphQL queries for accessing the Steem Engine conversions API.

#### `conversionSent`

**Accepted values:** account (string), limit (integer) and offset (integer).
**Required values:** account

Gets all sent conversions to the conversions API.

**Example query**:

```
{ 
	conversionSent(account: "aggroed") {
    count,
    results {
      from_coin_symbol,
      to_coin_symbol
    }
  }
}
```

#### `conversionReceived`

**Accepted values:** account (string), limit (integer) and offset (integer).
**Required values:** account

Gets all received conversions from the conversions API.

**Example query**:

```
{ 
	conversionReceived(account: "aggroed") {
    count,
    results {
      from_coin_symbol,
      to_coin_symbol
    }
  }
}
```

### Market

GraphQL queries for accessing the Steem Engine markets data.

#### `buyBook`

**Accepted values:** ``symbol`` (string), ``account`` (string).
**Required values:** ``symbol``

Gets buy orders for a specific token off of the market.

**Example query**:

```
{ 
    buyBook(symbol: "ENG") {
        account,
        quantity,
        price
    }
}
```

**Example query**:

```
{ 
    buyBook(symbol: "ENG", account: "garagebill") {
        account,
        quantity,
        price
    }
}
```

#### `sellBook`

**Accepted values:** ``symbol`` (string), ``account`` (string).
**Required values:** ``symbol``

Gets sell orders for a specific token off of the market.

**Example query**:

```
{ 
    sellBook(symbol: "ENG") {
        account,
        quantity,
        price
    }
}
```

**Example query**:

```
{ 
    sellBook(symbol: "ENG", account: "someguy123") {
        account,
        quantity,
        price
    }
}
```

#### `tradesHistory`

**Accepted values:** ``symbol`` (string).
**Required values:** ``symbol``

Gets trading history for a specific token off of the market.

**Example query**:

```
{ 
    tradesHistory(symbol: "ENG") {
        type,
        quantity,
        price
    }
}
```

#### `metrics`

**Accepted values:** ``limit`` (integer), ``offset`` (integer).
**Required values:** None

Get market metrics data for tokens.

**Example query**:

```
{ 
    metrics {
        symbol,
        volume,
        lastPrice,
        lowestAsk,
        highestBid
    }
}
```

### Params

GraphQL queries for accessing the Steem Engine params data.

#### `sscstore`

**Accepted values:** None
**Required values:** None

Gets Steem Engine site parameters.

**Example query**:

```
{ 
    sscstore {
        priceSBD,
        priceSteem,
        quantity,
        disabled
    }
}
```

### Tokens

GraphQL queries for accessing the Steem Engine tokens data.

#### `tokens`

**Accepted values:** ``limit``(integer), ``offset``(integer)
**Required values:** None

Gets Steem Engine tokens information.

**Example query**:

```
{ 
    tokens {
        issuer,
        symbol,
        name,
        circulatingSupply
    }
}
```

#### `tokenParams`

**Accepted values:** None
**Required values:** None

Gets Steem Engine token parameter information.

**Example query**:

```
{ 
    tokenParams {
        tokenCreationFee
    }
}
```

#### `steempBalance`

**Accepted values:** None
**Required values:** None

Gets Steem Engine STEEMP token holdings information. This tells you how much STEEMP is being held.

**Example query**:

```
{ 
    steempBalance {
        account,
        symbol,
        balance
    }
}
```

### User

GraphQL queries for accessing the Steem Engine users data.

#### `balances`

**Accepted values:** ``account``(string) ``limit``(integer), ``offset``(integer)
**Required values:** account

Get a users token balances.

**Example query**:

```
{ 
    balances(account: "aggroed") {
        account,
        symbol,
        balance
    }
}
```

#### `tokenBalance`

**Accepted values:** ``symbol``(string) ``account``(string)
**Required values:** symbol, account

Gets a users token balance for a specific token. It will also return the users STEEMP balance.

**Example query**:

```
{ 
    tokenBalance(symbol: "ENG", account: "aggroed") {
        account,
        symbol,
        balance
    }
}
```