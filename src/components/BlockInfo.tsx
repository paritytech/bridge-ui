// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ethers } from 'ethers';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components';

import useEthBlockNumber from '../hooks/useEthBlockNumber';
import useRialtoBlocks from '../hooks/useRialtoBlocks';
import useSubBlocks from '../hooks/useSubstrateBlocks';

interface Props {
	className? : string;
    ethProvider: ethers.providers.Web3Provider;
}
const BlockInfo = ({ className, ethProvider }: Props) => {
	const { blockNumber } = useEthBlockNumber({ ethProvider });
	const { bestBlock: bestRialtoBlock, bestFinalizedBlock: bestRialtoFinalizedBlock } = useRialtoBlocks();
	const { bestBlock: bestSubBlock } = useSubBlocks();

	return (

		<Grid className={className}>
			<Grid.Row>
				<Grid.Column width={2}/>
				<Grid.Column width={4} className='blockInfo'>
					<div>
						<h2>Ethereum</h2>
						<div className='blockNumber'>Best: #{blockNumber}</div>
					</div>
				</Grid.Column>
				<Grid.Column width={4} className='blockInfo'>
					<div>
						<h2>Bridge</h2>
						<div className='blockNumber'>
								Best: #{bestRialtoBlock}<br/>
								Finalized: #{bestRialtoFinalizedBlock}<br/>
						</div>
					</div>
				</Grid.Column>
				<Grid.Column width={4} className='blockInfo'>
					<div>
						<h2>Substrate</h2>
						<div className='blockNumber'>
							Best: #{bestSubBlock}<br/>
						</div>
					</div>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

export default styled(BlockInfo)`
	.blockInfo{
		background: #d3d3d342;
		margin: .5rem;
		border-radius: 0.2rem;
		padding: .5rem;
		text-align: center;
	}
`;