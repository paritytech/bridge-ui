// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
    className?: string;
    children?: JSX.Element;
}
const ErrorMessage = ({ children, className }: Props) => {

	return (
		<div className={className}>
			{children}
		</div>
	);
};

export default styled(ErrorMessage)`
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
        margin: 10px;
        vertical-align: middle;
        width: 32px;
    }
`;