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