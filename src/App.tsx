// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import 'semantic-ui-css/semantic.min.css';

import { WsProvider } from '@polkadot/api';
import { ethers } from 'ethers';
import React from 'react';

import Menu from './components/MenuBar';
import { ApiPromiseContextProvider } from './context/ApiPromiseContext';
import customTypes from './customTypes';
import EthToSub from './screens/EthToSub';

// extend the existing window interface to tell it about your new ethereum property.
declare global {
    interface Window { ethereum: any; }
}

window.ethereum = window.ethereum || {};

const App = () => {

	const WS_PROVIDER_ENV='wss://wss.rialto.brucke.link/';
	// const wsProvider = new WsProvider('wss://wss.rialto.brucke.link/');
	// const WS_PROVIDER = process.env.WS_PROVIDER;
	// console.log('WS_PROVIDER:',process.env.WS_PROVIDER);
	const WS_PROVIDER = WS_PROVIDER_ENV;

	if (!WS_PROVIDER) {
		console.error('Env variable WS_PROVIDER not set');
		return null;
	}

	const wsProvider = new WsProvider(WS_PROVIDER);

	// A Web3Provider wraps a standard Web3 provider, which is
	// what Metamask injects as window.ethereum into each page
	const ethProvider = new ethers.providers.Web3Provider(window.ethereum);

	// The Metamask plugin also allows signing transactions to
	// send ether and pay to change state within the blockchain.
	// For this, we need the account signer...
	window.ethereum.enable();

	return (
		<>
			<Menu/>
			<ApiPromiseContextProvider provider={wsProvider} types={customTypes}>
				<>
					<EthToSub ethProvider={ethProvider} />
				</>
			</ApiPromiseContextProvider>
		</>
	);
};

export default App;
