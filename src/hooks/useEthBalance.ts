// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BigNumber, ethers } from 'ethers';
import { useCallback,useEffect, useState } from 'react';

interface Props {
	ethProvider: ethers.providers.Web3Provider;
	account: string;
}

const useEthBalance = ({ account, ethProvider }: Props) => {
	const [balance, setBalance] = useState(BigNumber.from(0));
	const setBalanceHandler = useCallback(
		() => {
			if (!account) {
				return;
			}

			ethProvider.getBalance(account)
				.then(b => {
					console.log('balance',b.toString());
					setBalance(b);
				});
		},[account, ethProvider]);

	useEffect(() => {
		ethProvider.on('block', setBalanceHandler);

		return () => {ethProvider.removeListener('block', setBalanceHandler);};

	}, [ethProvider, setBalanceHandler]);

	useEffect(() => {
		setBalanceHandler();
	}, [account, setBalanceHandler]);

	return { balance };
};

export default useEthBalance;