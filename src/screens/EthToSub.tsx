// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { formatBalance } from '@polkadot/util';
import * as blockies from 'blockies-ts';
import { BigNumber,ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Icon, Input, InputOnChangeData, Label } from 'semantic-ui-react';
import styled from 'styled-components';

import { ApiPromiseContext } from '../context/ApiPromiseContext';

interface Props {
    className?: string
    ethProvider: ethers.providers.Web3Provider
}

const zero = BigNumber.from(0);

const EthToSub = ({ className, ethProvider } : Props) => {
	const { api } = useContext(ApiPromiseContext);
	const signer = ethProvider.getSigner();
	const [blockNumber, setBlockNumber] = useState(0);
	const [ethAccount, setEthAccount] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [ethAccountBalance, setEthAccountBalance] = useState<ethers.BigNumber>(zero);
	const [amount, setAmount] = useState('');
	const [receiver, setReceiver] = useState('');
	const [receiverBalance, setReceiverBalance] = useState('');

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
		if (!api) {
			return;
		}

		let unsubscribe: () => void;
		if(api.isReady && receiver){
			api.derive.balances.account(receiver,
				data => setReceiverBalance( data.freeBalance.toString()))
				.then( unsub => {unsubscribe = unsub;})
				.catch(console.error);
		}

		return () => unsubscribe && unsubscribe();
	}, [api, receiver]);

	useEffect(() => {
		window.ethereum.on('accountsChanged', (accounts: Array<string>) => setEthAccount(accounts[0]));
	},[]);

	useEffect(() => {
		ethProvider.getBalance(ethAccount)
			.then(balance => setEthAccountBalance(balance))
			.catch(
				//no need to do anything here
			);
	},[ethAccount, ethProvider, blockNumber]);

	useEffect(() => {
		ethProvider.listAccounts()
			.then(accounts => setEthAccount(accounts[0]))
			.catch(
			//no need to do anything here
			);
	}, [ethProvider]);

	useEffect(() => {
		ethProvider.on('block', (blockNumber: number) => setBlockNumber(blockNumber));
	}, [ethProvider]);

	const changeReceiver = (_: any , data: InputOnChangeData) => {
		setReceiver(data.value);
	};

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
			<div>
                block: {blockNumber}<br/>
                account: <img src={imgSrc}/> {ethAccount}<br/>
                balance: {ethers.utils.formatEther(ethAccountBalance)} ETH<br/>
			</div>
			<Input className='largeInput' label='amount' onChange={changeValue} value={amount}/><br/>
			<Input className='largeInput' label='to' onChange={changeReceiver} value={receiver}/><Label>{formatBalance(receiverBalance, { withUnit: false })} SUB</Label><br/>
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

export default styled(EthToSub)`
    .largeInput {
		width: 40rem;
    }
`;
