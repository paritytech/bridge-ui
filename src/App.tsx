// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ethers } from 'ethers';
import React, { useEffect,useMemo,useState } from 'react';

// extend the existing window interface to tell it about your new ethereum property.
declare global {
    interface Window { ethereum: any; }
}

window.ethereum = window.ethereum || {};

const App = () => {
	// A Web3Provider wraps a standard Web3 provider, which is
	// what Metamask injects as window.ethereum into each page
	const provider = useMemo(() => new ethers.providers.Web3Provider(window.ethereum), []);

	// The Metamask plugin also allows signing transactions to
	// send ether and pay to change state within the blockchain.
	// For this, we need the account signer...
	window.ethereum.enable();
	const signer = provider.getSigner();
	const [blockNumber, setBlockNumber] = useState(0);
	const [accountList, setAccountList] = useState<string[]>([]);

	console.log('accountList',accountList);
	const sendTx = () => signer.sendTransaction({
		// AccounId to hex from 5Ev8deqBc5bXB2pq2C9RWCBXM1kuS6wjqbZJiSRTA8kLZfTu
		data: '0x7e2ae4cfcf198ca3bb3312e6409c65e87294c67a73d9cb00bd72e8deca626347',
		to: '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF',
		value: ethers.utils.parseEther('1.0')
	})
		.then(response => console.log('hash', response.hash))
		.catch( e => console.error('Tx send error',e));

	useEffect(() => {
		provider.on('block', (blockNumber: number) => setBlockNumber(blockNumber));
	}, [provider]);

	useEffect(() => {
		provider.listAccounts().then( a => setAccountList(a));
	}, [provider]);

	return (
		<>
			<h1>
				block: {blockNumber}<br/>
				accounts: {accountList.toString()}
			</h1>
			<button onClick={sendTx}>Send 1 ETH</button>
		</>
	);
};

export default App;
