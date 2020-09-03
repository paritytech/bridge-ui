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
import HelperTooltip from './HelperTooltip';

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
				<Grid.Column width={6} className='blockInfo'>
					<div>
						<h2>Ethereum</h2>
						<div className='blockNumber'>Best<HelperTooltip content='Best block of the Rialto-POA network.'/>: #{blockNumber}</div>
					</div>
				</Grid.Column>
				<Grid.Column width={6} className='blockInfo'>
					<div>
						<h2>Substrate</h2>
						<div className='blockNumber'>
							Best<HelperTooltip content='Best block of the Rialto-SUB network.'/>: #{bestSubBlock}<br/>
						</div>
						<div className='blockInfo' title="The state of the PoA Light Client">
							<h4>Bridge Pallet</h4>
							<div className='blockNumber'>
								Best<HelperTooltip content='Best relayed PoA block.'/>: <strong>#{bestRialtoBlock}</strong>
							</div>
							<div className='blockNumber'>
								Finalized<HelperTooltip content='Best known finalized PoA block'/>: <strong>#{bestRialtoFinalizedBlock}</strong>
							</div>
						</div>
					</div>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

export default styled(BlockInfo)`
	.blockInfo {
		background: #d3d3d342;
		margin: .5rem;
		border-radius: 0.2rem;
		padding: .5rem;
		text-align: left;

		h2, h4 {
			text-align: center;
		}

		.blockInfo {
			padding: 1rem;
			text-align: left;
			background: #d3d3d342;
		}
	}
`;
