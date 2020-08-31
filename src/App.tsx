// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import * as React from 'react';

interface Props {
   name:
    string
}

class App extends React.Component<Props> {
	render() {
		const { name } = this.props;
		return (
			<>
				<h1>
          Hello {name}
				</h1>
			</>
		);
	}
}

export default App;
