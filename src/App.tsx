// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import 'semantic-ui-css/semantic.min.css';

import * as blockies from 'blockies-ts';
import { BigNumber,ethers } from 'ethers';
import React, { useEffect,useMemo,useState } from 'react';
import { Button, Container, Icon, Input, InputOnChangeData } from 'semantic-ui-react';
import styled from 'styled-components';

// extend the existing window interface to tell it about your new ethereum property.
declare global {
	interface Window { ethereum: any; }
}

window.ethereum = window.ethereum || {};

const zero = BigNumber.from(0);

interface Props {
	className?: string;
}
const App = ({ className } : Props) => {
	// A Web3Provider wraps a standard Web3 provider, which is
	// what Metamask injects as window.ethereum into each page
	const provider = useMemo(() => new ethers.providers.Web3Provider(window.ethereum), []);

	// The Metamask plugin also allows signing transactions to
	// send ether and pay to change state within the blockchain.
	// For this, we need the account signer...
	window.ethereum.enable();

	const signer = provider.getSigner();
	const [blockNumber, setBlockNumber] = useState(0);
	const [ethAccount, setEthAccount] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState('');
	const [ethAccountBalance, setEthAccountBalance] = useState<ethers.BigNumber>(zero);
	const [amount, setAmount] = useState<string>('');

	const imgSrc = blockies.create({ seed: ethAccount }).toDataURL();

	const sendTx = () => signer.sendTransaction({
		// AccounId to hex from 5Ev8deqBc5bXB2pq2C9RWCBXM1kuS6wjqbZJiSRTA8kLZfTu
		data: '0x7e2ae4cfcf198ca3bb3312e6409c65e87294c67a73d9cb00bd72e8deca626347',
		to: '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF',
		value: ethers.utils.parseEther(amount)
	})
		.then(response => console.log('hash', response.hash))
		.catch( e => console.error('Tx send error',e));

	useEffect(() => {
		window.ethereum.on('accountsChanged', (accounts: Array<string>) => setEthAccount(accounts[0]));
	},[]);

	useEffect(() => {
		provider.getBalance(ethAccount).then(balance => setEthAccountBalance(balance));
	},[ethAccount, provider, blockNumber]);

	useEffect(() => {
		provider.listAccounts().then(accounts => setEthAccount(accounts[0]));
	}, [provider]);

	useEffect(() => {
		provider.on('block', (blockNumber: number) => setBlockNumber(blockNumber));
	}, [provider]);

	const changeValue = (_: any , data: InputOnChangeData) => {
		if (checkValue(data.value)){
			setErrorMessage('');
			setAmount(data.value);
		}
	};

	const checkValue = (amount: string) => {
		if( !amount || amount.match(/\d+(,\d+)*(\.\d+)?/)){
			return true;
		}

		setErrorMessage('Wrong amount');
		return false;
	};

	return (
		<Container className={className}>
			<h1>Eth to Sub transfer</h1>
			<div>
				block: {blockNumber}<br/>
				account: <img src={imgSrc}/> {ethAccount}<br/>
				balance: {ethers.utils.formatEther(ethAccountBalance)} ETH<br/>
				chainId: {window.ethereum.chainId}
			</div>
			<Input onChange={changeValue} value={amount}/>
			<Button
				primary
				onClick={sendTx}
				disabled={!!errorMessage || !amount}>
				<Icon name='paper plane'/>Send
			</Button>
			{errorMessage && <div>{errorMessage}</div>}
		</Container>
	);
};

export default styled(App)``;
