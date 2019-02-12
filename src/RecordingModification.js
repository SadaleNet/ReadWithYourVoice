import React from 'react';

import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Helmet } from "react-helmet";

import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';


class RecordingModification extends React.Component{
	constructor(props) {
		super(props);
		this.state = {currentSentence: 0};
	}
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
				<div class="d-flex flex-column mx-auto flex-grow-1 w-100 justify-content-center align-items-center">
					<Form className="w-100">
						<Form.Group controlId="formBasicSentence" className="w-100">
							<Form.Label><Translate id="record.currentsentence"/></Form.Label>
							<Form.Control as="select">
								<option>mi moku e kili</option>
								<option>mi ken ala moli e pipi</option>
								<option>3</option>
								<option>4</option>
								<option>5</option>
							</Form.Control>
						</Form.Group>
				
						<Form.Control as="select" className="w-100">
							<Translate>{({ translate }) => (
								<option>{translate("record.search")}</option>
							)}</Translate>
							<option>a</option>
							<option>akesi</option>
							<option>alasa</option>
						</Form.Control>
					</Form>
				</div>
				<div class="d-flex flex-column mx-auto flex-grow-1 w-100 h-100 justify-content-center align-items-center">
					<big><b>
					mi moku e kili
					</b></big>
					<hr/>
					<Button variant="danger" className="w-100">
						<b>[Error message] Record Again</b>
					</Button>
					<Button variant="success" className="w-100" disabled>
						<b><Translate id="record.play"/></b>
					</Button>
					<Button variant="primary" className="w-100" disabled>
						<b><Translate id="record.next"/></b>
					</Button>
				</div>
				<div class="d-flex flex-column mx-auto flex-grow-1 w-100 justify-content-center align-items-center">
					<Link to={this.props.location.pathname.split('/').slice(0, -1).join('/')+'/kute'} className="w-100">
						<Button variant="secondary" className="w-100">
							<Translate id="record.switch"/>
						</Button>
					</Link>
				</div>
			</main>
		);
	}
}

export default withLocalize(RecordingModification);
