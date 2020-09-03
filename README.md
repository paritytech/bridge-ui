# Bridge-ui

This repo hosts a simple interface to send tokens using the [Rialto bridge](https://github.com/paritytech/parity-bridges-common) between an Ethereum network and a Substrate network.
Metamask is required to sign Ethereum transactions.

The interface is available at: [https://paritytech.github.io/bridge-ui](https://paritytech.github.io/bridge-ui)

## Building and running locally

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
