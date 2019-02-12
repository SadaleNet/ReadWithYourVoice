import React from 'react';
import { Route } from "react-router-dom";
import Home from './Home'
import NavBar from './NavBar'
import CreateNewVoice from './CreateNewVoice'
import RecordingIntroduction from './RecordingIntroduction'
import RecordingModification from './RecordingModification'
import RecordingPlayback from './RecordingPlayback'
import { withLocalize } from "react-localize-redux";

import { renderToStaticMarkup } from "react-dom/server";
import globalTranslations from "./translations/global.json";

class Main extends React.Component {
	constructor(props) {
		super(props);

		this.props.initialize({
			languages: [
			{ name: "English", code: "en" },
			{ name: "Toki Pona", code: "tkp" }
			],
			translation: globalTranslations,
			options: {
				renderToStaticMarkup,
				defaultLanguage: "en"
			}
		});
	}

	render() {
		return (
			<div class="d-flex flex-column h-100">
				<NavBar />
				<Route exact path="/" component={Home} />
				<Route exact path="/kalama-sin" component={CreateNewVoice} />
				<Route exact path="/kalama/:id/:token/open" component={RecordingIntroduction} />
				<Route exact path="/kalama/:id/:token/ante" component={RecordingModification} />
				<Route exact path="/kalama/:id/:token/kute" component={RecordingPlayback} />
				<Route exact path="/kalama/:id" component={RecordingPlayback} />
			</div>
		);
	}
}

export default withLocalize(Main);
