import React from 'react';
import { LocalizeProvider } from "react-localize-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Main from './Main'

class App extends React.Component {
	render() {
		return (
			<LocalizeProvider>
				<Router>
					<Main />
				</Router>
			</LocalizeProvider>
		);
	}
}

export default App;
