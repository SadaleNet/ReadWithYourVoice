/*
Copyright 2019 Wong Cho Ching <https://sadale.net>

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

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
