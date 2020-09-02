// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import 'semantic-ui-css/semantic.min.css';

import { WsProvider } from '@polkadot/api';
import { ethers } from 'ethers';
import React from 'react';
import { Icon } from 'semantic-ui-react';

import ErrorMessage from './components/ErrorMessage';
import Menu from './components/MenuBar';
import { ApiPromiseContextProvider } from './context/ApiPromiseContext';
import customTypes from './customTypes';
import EthToSub from './screens/EthToSub';

// extend the existing window interface to tell it about your new ethereum property.
declare global {
    interface Window { ethereum: any; }
}

window.ethereum = window.ethereum || {};

const WS_PROVIDER = 'wss://wss.rialto.brucke.link/';
const ETHEREUM_NODE = 'http://rpc.rialto.brucke.link:8545';
const EXPECTED_NETWORK_ID = 105; // Rialto

const App = () => {
	if (!WS_PROVIDER) {
		console.error('Env variable WS_PROVIDER not set');
		return null;
	}

	const wsProvider = new WsProvider(WS_PROVIDER);
	let ethProvider: ethers.providers.Web3Provider;

	try {
		// A Web3Provider wraps a standard Web3 provider, which is
		// what Metamask injects as window.ethereum into each page
		ethProvider = new ethers.providers.Web3Provider(window.ethereum);
	} catch (e) {
		return (<ErrorMessage>
			<>
				<h1>Couldn&apos;t connect to Rialto Ethereum node</h1>
				<h3>
							Make sure to install & enable
					<img
						src='https://avatars0.githubusercontent.com/u/11744586?s=280&v=4'
					/>
							Metamask extension
				</h3>
			</>
		</ErrorMessage>);
	}

	// The Metamask plugin also allows signing transactions to
	// send ether and pay to change state within the blockchain.
	// For this, we need the account signer...
	window.ethereum.enable();
	window.ethereum.on('chainChanged', () => {
		// Handle the new chain.
		// Correctly handling chain changes can be complicated.
		// We recommend reloading the page unless you have a very good reason not to.
		window.location.reload();
	});

	if (Number(window.ethereum.networkVersion) !== EXPECTED_NETWORK_ID){
		return (
			<ErrorMessage>
				<>
					<h1><Icon name='warning circle'/>Unexpected network</h1>
					<h3>Please connect Metamask to Rialto (using {ETHEREUM_NODE})</h3>
				</>
			</ErrorMessage>
		);
	}

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
