import React from 'react';
import $ from 'jquery';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Helmet } from "react-helmet";

function PitchSelector() {
	return (
		<Form.Control as="select">
			<option value="400">TODO!</option>
			<option value="500">2</option>
			<option value="600">3</option>
			<option value="700">4</option>
			<option value="800">5</option>
		</Form.Control>
	);
}

class CreateNewVoice extends React.Component{
	constructor(props){
		super(props);
		this.state = {durationValue: 200, submittingForm: false};
	}
	handleFormChange = (e) => {
		this.setState({durationValue: e.value});
	}
	handleFormSubmit = (e) => {
		e.preventDefault();
		const url = "https://jsonplaceholder.typicode.com/posts"; //TODO!
		const dataToBeSent = {foo: 100, bar: 200, TODO: 300};
		const componentThis = this;
		this.setState({submittingForm: true});
		$.post(url, dataToBeSent, function(data, textStatus) {
			componentThis.props.history.push('/kalama/d2b5d427-a092-4694-8d49-a731145e6fae/TESTTOKEN123/open'); //TODO!
		}, "json");
	}
	render() {
		return (
			<main class="container flex-column d-flex p-2">
				<Translate>
					{({ translate }) => (
						<Helmet>
							<title>{translate("newvoice.title")+' | '+translate("global.title")}</title>
						</Helmet>)
					}
				</Translate>
				<div class="d-flex mx-auto w-100 justify-content-center align-items-center">
					<Form onSubmit={this.handleFormSubmit} className="w-75">
						<Form.Group controlId="formBasicName">
							<Form.Label><Translate id="newvoice.name"/></Form.Label>
							<Form.Control type="name" placeholder="e.g. Elizabeth, jan Ilisape" />
						</Form.Group>

						<Form.Row className="w-100">
							<Form.Group as={Form.Col} controlId="formGridPitchStressed" className="w-50">
								<Form.Label><Translate id="newvoice.stressedsyllable"/></Form.Label>
								<PitchSelector />
								<Form.Text className="text-muted">
									<Translate id="newvoice.nochange"/>
								</Form.Text>
							</Form.Group>

							<Form.Group as={Form.Col} controlId="formGridPitchUnstressed" className="w-50">
								<Form.Label><Translate id="newvoice.unstressedsyllable"/></Form.Label>
								<PitchSelector />
								<Form.Text className="text-muted">
									<Translate id="newvoice.nochange"/>
								</Form.Text>
							</Form.Group>
						</Form.Row>

						<Form.Group controlId="formBasicDuration">
							<Form.Label><Translate id="newvoice.duration"/></Form.Label>
							<Form.Control type="number" onChange={this.handleFormChange} min="100" max="1000" step="1" value={this.state.durationValue} />
							<Form.Text className="text-muted">
								<Translate id="newvoice.nochange"/>
							</Form.Text>
						</Form.Group>
						<div class="text-center">
							<Button variant="success" className="text-center">
							▶ <Translate id="newvoice.test"/>
							</Button>
						</div>
						<br/>
						<small>
						TODO: captcha goes here!
						</small>
						<Button variant="primary" type="submit" className="w-100" disabled={this.state.submittingForm}>
						<Translate id="newvoice.submit"/> {this.state.submittingForm ? "..." : ""}
						</Button>
						<br/>
						<small>
						<Translate id="newvoice.tos"/>
						<pre>
						<Translate id="newvoice.toscontent"/>
						</pre>
						</small>
					</Form>
				</div>
			</main>
		);
	}
}

export default withLocalize(CreateNewVoice);
