// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keyring } from '@polkadot/api';
import Identicon from '@polkadot/react-identicon';
import { formatBalance, u8aToHex } from '@polkadot/util';
import * as blockies from 'blockies-ts';
import { BigNumber,ethers } from 'ethers';
import React, { useContext, useEffect, useMemo,useState } from 'react';
import { Button, Container, Icon, Input, InputOnChangeData, Label } from 'semantic-ui-react';
import styled from 'styled-components';

import { ApiPromiseContext } from '../context/ApiPromiseContext';
import useEthAccount from '../hooks/useEthAccount';
import useEthBlockNumber from '../hooks/useEthBlockNumber';
import useRialtoBlocks from '../hooks/useRialtoBlocks';

interface Props {
    className?: string
    ethProvider: ethers.providers.Web3Provider
}

const zero = BigNumber.from(0);
const keyring = new Keyring({ type: 'sr25519' });

const EthToSub = ({ className, ethProvider } : Props) => {
	const { api } = useContext(ApiPromiseContext);
	const signer = ethProvider.getSigner();

	const [errorMessage, setErrorMessage] = useState('');
	const [ethAccountBalance, setEthAccountBalance] = useState<ethers.BigNumber>(zero);
	const [amount, setAmount] = useState('');
	const [receiver, setReceiver] = useState('');
	const [receiverBalance, setReceiverBalance] = useState('');
	const { blockNumber } = useEthBlockNumber({ ethProvider });
	const { ethAccount } = useEthAccount();
	const { bestFinalizedBlock: bestRialtoFinalizedBlock, bestBlock: bestRialtoBlock } = useRialtoBlocks();

	useEffect(() => {
		ethProvider.getBalance(ethAccount)
			.then(balance => setEthAccountBalance(balance));
	}, [ethAccount, ethProvider]);

	const imgSrc = useMemo(() => blockies.create({ seed: ethAccount }).toDataURL(), [ethAccount]);

	const sendTx = () => signer.sendTransaction({
		// AccounId to hex from 5Ev8deqBc5bXB2pq2C9RWCBXM1kuS6wjqbZJiSRTA8kLZfTu
		data: u8aToHex(keyring.decodeAddress(receiver)),
		to: '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF',
		value: ethers.utils.parseEther(amount)
	})
		.then(response => console.log('hash', response.hash))
		.catch( e => console.error('Tx send error',e));

	useEffect(() => {
		if (!api) {
			console.log('api not ready yet...');
			return;
		}

		let unsubscribe: () => void;
		if(receiver){
			api.derive.balances.account(receiver,
				data => setReceiverBalance( data.freeBalance.toString()))
				.then( unsub => {unsubscribe = unsub;})
				.catch(console.error);
		}

		return () => unsubscribe && unsubscribe();
	}, [api, receiver]);

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
				Bridge finalized block: {bestRialtoFinalizedBlock}<br/>
				Bridge block: {bestRialtoBlock}<br/>
                Block: {blockNumber}<br/>
                Account: {!!imgSrc && <img src={imgSrc}/>} {ethAccount}<br/>
                Balance: {ethers.utils.formatEther(ethAccountBalance)} ETH<br/>
			</div>
			<Input className='largeInput' label='amount' onChange={changeValue} value={amount}/><br/>
			<Input className='largeInput' label='to' onChange={changeReceiver} value={receiver}/><br/>
			<Identicon value={receiver}/><Label>{formatBalance(receiverBalance, { withUnit: false })} SUB</Label><br/>
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
