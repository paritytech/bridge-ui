# Bridge-ui

This repo hosts a simple interface to send tokens using the [Rialto bridge](https://github.com/paritytech/parity-bridges-common) between an Ethereum network and a Substrate network (one way).
Metamask (connected to Rialto network) is required to sign Ethereum transactions. The interface automatically connects to Rialto's Substrate nodes (no configuration or plugin required).

The interface is available at: [https://paritytech.github.io/bridge-ui](https://paritytech.github.io/bridge-ui)

## Deprecation notice

This repo is deprecated, the work for Bridge UI continues in [https://paritytech.github.io/parity-bridges-ui](https://paritytech.github.io/parity-bridges-ui)

## Building and running locally

### Environment variables

You can set the Substrate and Ethereum nodes you want to connect to, by overriding the following variables in the `.env` file:
```bash
SUBSTRATE_PROVIDER
ETHEREUM_PROVIDER
EXPECTED_ETHEREUM_NETWORK_ID
```

### Development
First install dependencies:

```sh
yarn
```
or using npm
```sh
npm install
```

To run in hot module reloading mode:

```sh
yarn start
```
or using npm
```sh
npm start
```

To check for linting errors/warnings:

```sh
yarn lint
```
or using npm
```sh
npm run lint
```

### To create a production build:

```sh
yarn build
```
or using npm
```sh
npm run build
```

### Running locally

Open the file `dist/index.html` in your browser

## Credits

Made with [parcel bundler](https://github.com/parcel-bundler/parcel) using [createapp.dev](https://createapp.dev/)
