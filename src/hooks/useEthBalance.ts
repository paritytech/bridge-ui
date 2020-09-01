// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';

interface Props {
	ethProvider: ethers.providers.Web3Provider;
	account: string;
}

const useEthBalance = ({ account, ethProvider }: Props) => {
	const [balance, setBalance] = useState(BigNumber.from(0));

	const getBalance = ethProvider.getBalance(account)
		.then(b => setBalance(b));

	useEffect(() => {
		ethProvider.on('block', () => getBalance);
	}, [ethProvider, getBalance]);

	return { balance };
};

export default useEthBalance;