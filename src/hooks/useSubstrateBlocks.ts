// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useContext,useEffect, useState } from 'react';

import { ApiPromiseContext } from '../context/ApiPromiseContext';

const useSubBlocks = () => {
	const { api, isApiReady } = useContext(ApiPromiseContext);
	const [bestBlock, setBestBlock] = useState('');

	useEffect(() => {
		if(!api || !isApiReady){
			return;
		}

		api.derive.chain.bestNumber((res) => {
			setBestBlock(res.toString());
		});
	},[api, isApiReady]);

	return { bestBlock };
};

export default useSubBlocks;