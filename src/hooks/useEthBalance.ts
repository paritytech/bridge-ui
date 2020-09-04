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
  let currentAccount = account;
  const fetchBalance = () => {
		ethProvider.getBalance(currentAccount)
			.then(b => setBalance(b));
  }
  ethProvider.on('block', fetchBalance);

	useEffect(() => {
		if (!account) {
			return;
    }
    currentAccount = account;
    fetchBalance();
	}, [account, ethProvider]);

	return { balance };
};

export default useEthBalance;
