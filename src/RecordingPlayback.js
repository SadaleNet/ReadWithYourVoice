import React from 'react';

import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Helmet } from "react-helmet";

import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import CopyLinks from './CopyLinks'

class RecordingPlayback extends React.Component{
	render() {
		return (
			<main class="container flex-column d-flex h-100 p-2">
				<Translate>
					{({ translate }) => (
						<Helmet>
							<title>{ "TODO: name of the voice" +' | '+translate("global.title")}</title>
						</Helmet>)
					}
				</Translate>
				<div class="d-flex flex-column mx-auto flex-grow-1 w-100 justify-content-center align-items-center">
					{ this.props.location.pathname.endsWith('kute') ?
					(
						<InputGroup className="mb-3 w-100">
							<Form.Control
								aria-label="Name of the voice"
								value="TODO: name of the voice"
							/>
							<InputGroup.Append>
								<Button variant="outline-secondary" onClick={() => this.TODO}><Translate id="playback.changename"/></Button>
							</InputGroup.Append>
						</InputGroup>
					) : (
						<h1>TODO: name of the voice</h1>
					)}
					<small>
					<Translate id="playback.stressed"/> : TODO Hz |&nbsp;
					<Translate id="playback.unstressed"/> : TODO Hz |&nbsp;
					<Translate id="playback.duration"/> : TODO ms
					</small>
				</div>
				<div class="d-flex flex-column mx-auto flex-grow-1 w-100 justify-content-center align-items-center">
					<b><Translate id="playback.text"/></b>
					<Form.Control as="textarea" rows="8" />
					<Button variant="success" className="w-100">
						▶ <Translate id="playback.play"/>
					</Button>
				</div>
				{ this.props.location.pathname.endsWith('kute') ? (
					<div class="d-flex flex-column mx-auto flex-grow-1 w-100 justify-content-center align-items-center">
						<CopyLinks/>
					</div>
				) : null
				}

				{ this.props.location.pathname.endsWith('kute') ? (
					<div class="d-flex flex-column mx-auto flex-grow-1 w-100 justify-content-center align-items-center">
						<Link to={this.props.location.pathname.split('/').slice(0, -1).join('/')+'/ante'} className="w-100">
							<Button variant="secondary" className="w-100">
								<Translate id="playback.switch"/>
							</Button>
						</Link>
					</div>
				) : null
				}
			</main>
		);
	}
}

export default withLocalize(RecordingPlayback);
