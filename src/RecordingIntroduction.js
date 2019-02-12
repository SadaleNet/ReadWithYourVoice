import React from 'react';

import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Helmet } from "react-helmet";

import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button';

import CopyLinks from './CopyLinks'

class RecordingIntroduction extends React.Component{
	render() {
		return (
			<main class="container flex-column d-flex h-100 p-2">
				<Translate>
					{({ translate }) => (
						<Helmet>
							<title>{translate("record.title")+' | '+translate("global.title")}</title>
						</Helmet>)
					}
				</Translate>
				<div class="d-flex flex-column mx-auto flex-grow-1 w-100 h-100 justify-content-center align-items-center">
					<CopyLinks />
					<Link to={this.props.location.pathname.split('/').slice(0, -1).join('/')+'/ante'}>
						<Button variant="primary">
							<Translate id="playback.switch"/>
						</Button>
					</Link>
				</div>
			</main>
		);
	}
}

export default withLocalize(RecordingIntroduction);
