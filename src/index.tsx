// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

const mountNode = document.getElementById('app');
ReactDOM.render(<App name="Jane" />, mountNode);
