import React from 'react';
import $ from 'jquery';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Helmet } from "react-helmet";
import ErrorDialog from "./ErrorDialog";

import ReCAPTCHA from "react-google-recaptcha";

import config from './private/config.json';

let loadAudio = require('./audioSynth.js').loadAudio;
let playSentence = require('./audioSynth.js').playSentence;

const pianoNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const frequencyAndNames = [...new Array(12*4)].map( function(_,i){
	return {
		frequency: Math.pow(2,(i+16-49)/12)*440,
		name: pianoNames[i%12]+Math.floor(i/12+2)
	}
}).reverse();

function nameToFrequency(name){
	for(let i of frequencyAndNames){
		if(i.name === name)
			return i.frequency;
	}
	return null;
}

function frequencyToName(frequency){
	for(let i of frequencyAndNames){
		if(i.frequency === frequency)
			return i.name;
	}
	return null;
}

function PitchSelector(props) {
	return (
		<Form.Control as="select" onChange={props.onChange}>
			{frequencyAndNames.map(i => <option value={i.frequency} selected={i.frequency === props.frequency ?"selected":false}>{`${i.name} (${Math.round(i.frequency*100, 2)/100} Hz)`}</option>)}
		</Form.Control>
	);
}

class CreateNewVoice extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			name: "",
			stressedFrequency:nameToFrequency("A3"),
			unstressedFrequency:nameToFrequency("A2"),
			durationValue: 200,
			captchaToken: "dummyTokenToBypassCaptcha", //TODO: set this to "" to re-enable captcha
			errorMessage: "", //If it isn't empty, an error dialog will be shown.
			submittingForm: false,
			playingTestAudio: false
		};
	}
	playAudioTest = () => {
		const sampleSentence = "mi wile kepeken e ilo.";
		loadAudio('', {
			stressedFrequency: this.state.stressedFrequency,
			unstressedFrequency: this.state.unstressedFrequency,
			syllableDuration: this.state.durationValue,
			fileSeparationDuration: this.state.durationValue,
		});
		this.setState({playingTestAudio: true});
		playSentence(sampleSentence,
			() => {
			this.setState({playingTestAudio: false});
			}, 
			true);
	}
	handleStressedFrequencyChange = (e) => {
		this.setState({stressedFrequency: e.target[e.target.selectedIndex].value});
	}
	handleUnstressedFrequencyChange = (e) => {
		this.setState({unstressedFrequency: e.target[e.target.selectedIndex].value});
	}
	handleNameChange = (e) => {
		this.setState({name: e.target.value});
	}
	handleDurationChange = (e) => {
		this.setState({durationValue: e.target.value});
	}
	handleCaptchaReady = (captchaToken) => {
		this.setState({captchaToken: captchaToken});
	}
	handleFormSubmit = (e) => {
		e.preventDefault();
		const url = "http://localhost:3001/api/kalama-sin"; //TODO: Variable API endpoint
		const dataToBeSent = {
			name: this.state.name,
			stressedFrequency: parseFloat(this.state.stressedFrequency),
			unstressedFrequency: parseFloat(this.state.unstressedFrequency),
			durationValue: parseFloat(this.state.durationValue),
			captchaToken: e.target.elements["g-recaptcha-response"].value
		};
		this.setState({submittingForm: true});
		const that = this;
		$.ajax(url, {
			data : JSON.stringify(dataToBeSent),
			contentType : 'application/json',
			type : 'POST',
			success : (data, textStatus, jqXHR) => {
				if("id" in data && "token" in data){
					that.props.history.push(`/kalama/${data.id}/${data.token}/open`);
				}else{
					that.setState({errorMessage: "Unknown Error Occured."});
					that.setState({submittingForm: false});
				}
			},
			error : (jqXHR, textStatus, errorThrown) => {
				this.setState({errorMessage:
					( (jqXHR.responseJSON && "errorMessage" in jqXHR.responseJSON) ?
					jqXHR.responseJSON.errorMessage : "Unknown Error Occured.")
				});
				that.setState({submittingForm: false});
			},
		});
	}
	clearCloseErrorMessageDialog = () => {
		this.setState({errorMessage: ""});
	}
	render() {
		return (
			<main class="container flex-column d-flex p-2">
				<Translate>
					{({ translate }) => (
						<Helmet>
							<title>{translate("newvoice.title")+' | '+translate("global.title")}</title>
							<script src="https://www.google.com/recaptcha/api.js" async defer></script>
						</Helmet>)
					}
				</Translate>
				<ErrorDialog message={this.state.errorMessage} onClose={this.clearCloseErrorMessageDialog} />
				<div class="d-flex mx-auto w-100 justify-content-center align-items-center">
					<Form onSubmit={this.handleFormSubmit} className="w-75">
						<Form.Group controlId="formBasicName">
							<Form.Label><Translate id="newvoice.name"/></Form.Label>
							<Form.Control type="name" onChange={this.handleNameChange} placeholder="e.g. Elizabeth, jan Ilisape" />
						</Form.Group>

						<Form.Row className="w-100">
							<Form.Group as={Form.Col} controlId="formGridFrequencyStressed" className="w-50">
								<Form.Label><Translate id="newvoice.stressedsyllable"/></Form.Label>
								<PitchSelector onChange={this.handleStressedFrequencyChange} frequency={this.state.stressedFrequency} />
								<Form.Text className="text-muted">
									<Translate id="newvoice.nochange"/>
								</Form.Text>
							</Form.Group>

							<Form.Group as={Form.Col} controlId="formGridFrequencyUnstressed" className="w-50">
								<Form.Label><Translate id="newvoice.unstressedsyllable"/></Form.Label>
								<PitchSelector onChange={this.handleUnstressedFrequencyChange} frequency={this.state.unstressedFrequency} />
								<Form.Text className="text-muted">
									<Translate id="newvoice.nochange"/>
								</Form.Text>
							</Form.Group>
						</Form.Row>

						<Form.Group controlId="formBasicDuration">
							<Form.Label><Translate id="newvoice.duration"/></Form.Label>
							<Form.Control type="number" onChange={this.handleDurationChange} min="100" max="500" step="1" value={this.state.durationValue} />
							<Form.Text className="text-muted">
								<Translate id="newvoice.nochange"/>
							</Form.Text>
						</Form.Group>
						<div class="text-center">
							<Button variant="success" className="text-center" onClick={this.playAudioTest} disabled={this.state.playingTestAudio}>
							▶ <Translate id="newvoice.test"/>
							</Button>
						</div>
						<br/>
						<div class="text-center">
							<ReCAPTCHA
								sitekey={config.captchaKey}
								onChange={this.handleCaptchaReady}
								class="captcha-center-helper"
							/>
						</div>
						<Button variant="primary" type="submit" className="w-100" disabled={this.state.name.length===0 || !this.state.captchaToken || this.submittingForm}>
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
