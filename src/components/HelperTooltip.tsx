// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import styled from 'styled-components';

interface Props {
	content: string
}

const myIcon = ({ className }:{className?: string}) => <Icon className={className} name='question circle'/>;

const StyledIcon = styled(myIcon)`
	color: #aeaeae;
	margin-left: 0.2rem !important;
`;

const HelperTooltip = ({ content }:Props) =>
	<Popup
		content={content}
		hoverable={true}
		trigger={<span><StyledIcon/></span>}
	/>;

export default HelperTooltip;