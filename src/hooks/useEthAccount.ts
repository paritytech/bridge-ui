// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';

const useEthAccount = () => {
	const [ethAccount, setEthAccount] = useState('');

	useEffect(() => {
		setEthAccount(window.ethereum.selectedAddress as string);
		window.ethereum.on('accountsChanged', (accounts: Array<string>) => setEthAccount(accounts[0]));
	},[]);

	return { ethAccount };
};

export default useEthAccount;
