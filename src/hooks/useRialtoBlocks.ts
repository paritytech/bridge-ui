// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import BN from 'bn.js';
import { useContext,useEffect, useState } from 'react';

import { ApiPromiseContext } from '../context/ApiPromiseContext';

interface HeaderId{
	number: BN,
	hash: Hash
}

type CodecHeaderId = Codec & HeaderId;
type CodecBestBloc = Codec & [HeaderId, any]

const useRialtoBlocks = () => {
	const { api, isApiReady } = useContext(ApiPromiseContext);
	const [bestBlock, setBestBlock] = useState('');
	const [bestFinalizedBlock, setBestFinalizedBlock] = useState('');

	useEffect(() => {
		if(!api || !isApiReady){
			return;
		}

		api.query.bridgeRialto.finalizedBlock((res: CodecHeaderId) => {
			setBestFinalizedBlock(res.number.toString());
		});

		api.query.bridgeRialto.bestBlock((res: CodecBestBloc) => {
			setBestBlock(res[0].number.toString());
		});
	},[api, isApiReady]);

	return { bestBlock, bestFinalizedBlock };
};

export default useRialtoBlocks;