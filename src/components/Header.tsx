// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Menu } from 'semantic-ui-react';

const Header = () => (
	<Menu pointing secondary>
		<Menu.Item>
          Bridge UI
		</Menu.Item>

		<Menu.Item  name='home' href="/somelink"/>
		<Menu.Item  name='posts' href="/somelink"/>
		<Menu.Item  name='contact' href="/somelink"/>
	</Menu>
);

export default Header;