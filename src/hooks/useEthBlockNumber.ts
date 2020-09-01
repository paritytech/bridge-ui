// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

interface Props{
    ethProvider: ethers.providers.Web3Provider
}

const useEthBlockNumber = ({ ethProvider }: Props) => {
	const [blockNumber, setBlockNumber] = useState(0);

	useEffect(() => {
		ethProvider.on('block', (blockNumber: number) => setBlockNumber(blockNumber));
	}, [ethProvider]);

	return { blockNumber };
};

export default useEthBlockNumber;