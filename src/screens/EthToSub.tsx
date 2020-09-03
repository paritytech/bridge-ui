// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keyring } from '@polkadot/api';
import Identicon from '@polkadot/react-identicon';
import { formatBalance, u8aToHex } from '@polkadot/util';
import * as blockies from 'blockies-ts';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useMemo,useState } from 'react';
import { Button, Container, Grid,Icon, Input, InputOnChangeData, Loader } from 'semantic-ui-react';
import styled from 'styled-components';

import BlockInfo from '../components/BlockInfo';
import { ApiPromiseContext } from '../context/ApiPromiseContext';
import useEthAccount from '../hooks/useEthAccount';
import useEthBalance from '../hooks/useEthBalance';
import useRialtoBlocks from '../hooks/useRialtoBlocks';
import shortenAddress from '../util/shortenAddress';

interface Props {
	className?: string;
	ethProvider: ethers.providers.Web3Provider;
}

interface sendStatusType {
	blockNumber?: number;
	txHash?: string;
	sending?: boolean;
	message?: string;
}

const keyring = new Keyring({ type: 'sr25519' });

const EthToSub = ({ className, ethProvider } : Props) => {
	const { api, isApiReady } = useContext(ApiPromiseContext);
	const signer = ethProvider.getSigner();

	const [errorMessage, setErrorMessage] = useState('');
	const [amount, setAmount] = useState('');
	const [receiver, setReceiver] = useState('');
	const [receiverBalance, setReceiverBalance] = useState('');
	const { ethAccount } = useEthAccount();
	const { balance: ethAccountBalance } = useEthBalance({ account: ethAccount , ethProvider });
	const [sendStatus, setSendStatus] = useState<sendStatusType>({ sending: false });
	const { bestFinalizedBlock: bestRialtoFinalizedBlock } = useRialtoBlocks();

	const imgSrc = useMemo(() => blockies.create({ seed: ethAccount }).toDataURL(), [ethAccount]);

	const sendTx = () => {
		setSendStatus({
			message: 'waiting for signature',
			sending: true
		});

		signer.sendTransaction({
			data: u8aToHex(keyring.decodeAddress(receiver)),
			to: '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF',
			value: ethers.utils.parseEther(amount)
		})
			.then(response => {
				setSendStatus({
					message: 'transaction sent to the ETH network...',
					sending: true
				});
				response.wait().then( receipt => {
					console.log('hash', response.hash);
					console.log('receipt', JSON.stringify(receipt, null, 4));
					setSendStatus({
						...sendStatus,
						blockNumber: receipt.blockNumber+1,
						message: `waiting for finalization of block ${receipt.blockNumber+1}...`,
						sending: true,
						txHash:response.hash
					});
				}
				);
			}).catch( e => {
				// user rejected the Tx
				setSendStatus({
					message: '',
					sending: false
				});
				console.error('Tx send error',e);
			});
	};

	useEffect(() => {
		if(sendStatus.sending && sendStatus.blockNumber){
			if (Number(bestRialtoFinalizedBlock) >= sendStatus.blockNumber){
				setSendStatus({ message: '', sending: false });
			}
		}
	}, [bestRialtoFinalizedBlock, sendStatus.blockNumber, sendStatus.sending]);

	useEffect(() => {
		if (!api || !isApiReady) {
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
	}, [api, isApiReady, receiver]);

	const changeReceiver = (_: any , data: InputOnChangeData) => {
		setReceiver(data.value);
	};

	const changeValue = (_: any , data: InputOnChangeData) => {
		checkValue(data.value);
		setAmount(data.value);
	};

	const checkValue = (amount: string) => {
		if( !amount || amount.match(/^\d+(,\d+)*(\.\d+)?$/)){
			setErrorMessage('');
		} else {
			setErrorMessage('Wrong amount.');
		}
	};

	return (
		<Container className={className}>
			<BlockInfo ethProvider={ethProvider}/>
			<hr/>
			<h2>Send ETH to SUB</h2>
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}/>
					<Grid.Column className='accountCard' width={5}>
						<div className='balance'>ETH account</div>
						{!!ethAccount && (
							<>
								<div>{!!imgSrc && <img src={imgSrc} height={52}/>}</div>
								<div>{shortenAddress(ethAccount, true)}</div>
								<div
									className='balance'
									title={ethers.utils.formatEther(ethAccountBalance)}
								>
									{toEthBalance(ethAccountBalance)} ETH
								</div>
							</>
						)}
					</Grid.Column>
					<Grid.Column width={2} className='arrow'>
						<Icon name='arrow right'/>
					</Grid.Column>
					<Grid.Column className='accountCard' width={5}>
						<div className='balance'>SUB account</div>
						{!!receiver && (
							<>
								<Identicon size={52} value={receiver}/>
								<div>{shortenAddress(receiver)}</div>
								<div
									className='balance'
									title={formatBalance(receiverBalance, {
										withSi: false,
										withSiFull: false,
										withUnit: false
									})}
								>
									{toBalance(receiverBalance)} SUB
								</div>
							</>
						)}
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Input
						className='largeInput'
						disabled={sendStatus.sending}
						label='Receiver'
						placeholder='5Ev8deqBc5bXB2pq2C9RWCBXM1kuS6wjqbZJiSRTA8kLZfTu'
						onChange={changeReceiver}
						value={receiver}
					/>
				</Grid.Row>
				<Grid.Row>
					<Input
						className='largeInput'
						error={!!errorMessage}
						disabled={sendStatus.sending}
						label='Amount'
						placeholder='1.23'
						onChange={changeValue}
						value={amount}
					/>
				</Grid.Row>
				{errorMessage && <div className='errorMessage'>{errorMessage}</div>}
				<Grid.Row>
					<Button
						disabled={!!errorMessage || !amount}
						primary
						onClick={() => !sendStatus.sending && sendTx()}

					>
						{sendStatus.message
							? <><Loader active inverted inline size='small'/><span className='sendStatus'>{sendStatus.message}</span></>
							: <><Icon name='paper plane'/>Send</>
						}

					</Button>
				</Grid.Row>
			</Grid>
		</Container>
	);
};

function toEthBalance(v: BigInt) {
	return formatBalance(v.toString(), {
		decimals: 18,
		withSi: true,
		withSiFull: true,
		withUnit: false
	});
}

function toBalance(v: number|string) {
	return formatBalance(v, {
		decimals: 9,
		withSi: true,
		withSiFull: false,
		withUnit: false
	});
}

export default styled(EthToSub)`
	.arrow {
		text-align: center;
		font-size: 3rem;
		margin-top: 3rem;
	}

	.errorMessage {
		color: darkred
	}

    .largeInput {
		width: 40rem;
		margin-bottom:.2rem;
    }

	.balance{
		font-weight: 800;
		font-size: large;
    text-overflow: ellipsis;
    overflow: hidden;
	}

	.accountCard {
		background: #d3d3d342;
		margin: .5rem;
		border-radius: 0.2rem;
		padding: .5rem;
		text-align: center;
	}

	.sendStatus {
		margin-left: 1rem;
	}
`;
