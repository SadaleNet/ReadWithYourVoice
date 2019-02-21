import React from 'react';
import $ from 'jquery';

import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Helmet } from "react-helmet";

import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import CopyLinks from './CopyLinks'
import ErrorDialog from "./ErrorDialog";

import config from './private/config.json';

let articles = require('./articles.json').content;
let loadAudio = require('./audioSynth.js').loadAudio;
let reconfigAudio = require('./audioSynth.js').reconfigAudio
let playSentence = require('./audioSynth.js').playSentence;
let stopPlaying = require('./audioSynth.js').stopPlaying;


class RecordingPlayback extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			name: "...",
			localName: "...", //The name in the textbox that isn't uploaded to the server
			stressedFrequency: "...",
			unstressedFrequency: "...",
			durationValue: "...",
			audioSeparation: 0,
			loaded: false,
			playing: false,
			changingName: false,
			text: "Loading audio... It may take a while...\no awen!",
			errorMessage: "",
		};
	}

	componentDidMount(){
		console.log(articles);
		let that = this;
		//Read public metadata
		$.ajax(
		`${config.apiEndPoint}/${this.getVoiceId()}/metadata.json`,
		{
			type : 'GET',
			success : (data, textStatus, jqXHR) => {
				that.setState({
					name: data.name,
					localName: data.name,
					stressedFrequency: data.stressedFrequency,
					unstressedFrequency: data.unstressedFrequency,
					durationValue: data.durationValue,
					audioSeparation: data.durationValue,
				});

				loadAudio(`${config.apiEndPoint}/${this.getVoiceId()}`,
				{
					stressedFrequency: data.stressedFrequency,
					unstressedFrequency: data.unstressedFrequency,
					syllableDuration: data.durationValue,
					fileSeparationDuration: data.durationValue
				}, () => {
					that.setState({text: "", loaded: true });
				});
			},
			error : that.ajaxErrorHandler,
		});
	}
	getVoiceId = () => {
		return this.props.location.pathname.endsWith('kute') ?
			window.location.href.split('/').slice(-3)[0] :
			window.location.href.split('/').slice(-1)[0];
	}
	handleNameChange = (e) => {
		this.setState({localName: e.target.value});
	}
	handleTextChange = (e) => {
		this.setState({text: e.target.value});
	}
	handlePlayText = () => {
		let that = this;
		if(!this.state.playing){
			this.setState({playing: true}, () => {
				playSentence(that.state.text, () => {
					that.setState({playing: false});
				});
			});
		}else{
			stopPlaying();
		}
	}
	handleSubmitNameChange = () => {
		this.setState({changingName: true});

		const that = this;
		$.ajax(
		`${config.apiEndPoint}/api/${this.getVoiceId()}/update-name`,
		{
			data : JSON.stringify({
				token: window.location.href.split('/').slice(-2)[0],
				name: this.state.localName,
			}),
			contentType : 'application/json',
			type : 'POST',
			success : (data, textStatus, jqXHR) => {
				that.setState({
					name: this.state.localName,
					changingName: false
				});
			},
			error : (jqXHR, textStatus, errorThrown) => {
				that.setState({changingName: false});
				that.ajaxErrorHandler(jqXHR, textStatus, errorThrown);
			},
		});
	}
	handleDurationChange = (e) => {
		if(parseInt(e.target.value)<parseInt(e.target.min) ||
			parseInt(e.target.value)>parseInt(e.target.max)){
			return;
		}
		this.setState({audioSeparation: parseInt(e.target.value)});
		reconfigAudio({fileSeparationDuration: parseInt(e.target.value)})
	}
	handleChangeSentence = (e) => {
		if(!e.target.value)
			return;
		this.setState({text: e.target.value});
	}
	//TODO: Code duplication with RecordModification.js. Consider extracting it.
	ajaxErrorHandler = (jqXHR, textStatus, errorThrown) => {
		this.setState({errorMessage:
			( (jqXHR.responseJSON && "errorMessage" in jqXHR.responseJSON) ?
			jqXHR.responseJSON.errorMessage : "Unknown Error Occured.")
		});
	}
	//TODO: Code duplication with RecordModification.js. Consider extracting it.
	clearCloseErrorMessageDialog = () => {
		this.setState({errorMessage: ""});
	}
	render() {
		return (
			<main class="container flex-column d-flex flex-grow-1 p-2">
				<Translate>
					{({ translate }) => (
						<Helmet>
							<title>{this.state.name+' | '+translate("playback.title")+' | '+translate("global.title")}</title>
						</Helmet>)
					}
				</Translate>
				<ErrorDialog message={this.state.errorMessage} onClose={this.clearCloseErrorMessageDialog} />
				<div class="d-flex flex-column mx-auto w-100 justify-content-center align-items-center">
					{ this.props.location.pathname.endsWith('kute') ?
					(
						<InputGroup className="w-100">
							<Form.Control
								aria-label="Name of the voice"
								value={this.state.localName}
								onChange={this.handleNameChange}
								disabled={!this.state.loaded || this.state.changingName}
							/>
							<InputGroup.Append>
								<Button variant="outline-secondary"
									onClick={this.handleSubmitNameChange}
									disabled={!this.state.loaded || this.state.changingName}>
									<Translate id="playback.changename"/>
								</Button>
							</InputGroup.Append>
						</InputGroup>
					) : (
						<h1>{this.state.name}</h1>
					)}
					<small class="text-center">
					<Translate id="playback.stressed"/> : {this.state.stressedFrequency} Hz |&nbsp;
					<Translate id="playback.unstressed"/> : {this.state.unstressedFrequency} Hz |&nbsp;
					<Translate id="playback.duration"/> : {this.state.durationValue} ms
					</small>
				</div>
				<div class="d-flex flex-column mx-auto flex-grow-1 w-100 justify-content-center align-items-center">
					<Form.Control as="select" className="w-100"
						onChange={this.handleChangeSentence}
						value=""
						disabled={!this.state.loaded || this.state.playing}>
						<Translate>{({ translate }) => (
							<option value="" selected>{translate("playback.selectText")}</option>
						)}</Translate>
						{
							articles.map(x => <option value={x.text}>{x.name}</option>)
						}
					</Form.Control>
					<Form.Control
						as="textarea"
						className="h-100"
						onChange={this.handleTextChange}
						value={this.state.text}
						disabled={!this.state.loaded || this.state.playing}/>
						
					<div class="d-flex w-100">
						<div class="align-self-center text-right"><Translate id="playback.separation"/>&nbsp;</div>
						<Form.Control type="number"
							className="w-25"
							onChange={this.handleDurationChange}
							min="0"
							max="2500"
							step="10"
							value={this.state.audioSeparation}
							disabled={!this.state.loaded || this.state.playing}
							/>
						<Button
							variant="success"
							className="flex-grow-1"
							onClick={this.handlePlayText}
							disabled={!this.state.loaded}>
							{this.state.playing?
								<Translate id="playback.stopPlay"/>:
								<Translate id="playback.play"/>}
						</Button>
					</div>
				</div>
				{ this.props.location.pathname.endsWith('kute') ? (
					<div class="d-flex flex-column mx-auto w-100 justify-content-center align-items-center">
						<CopyLinks/>
					</div>
				) : null
				}

				{ this.props.location.pathname.endsWith('kute') ? (
					<div class="d-flex flex-column mx-auto w-100 justify-content-center align-items-center">
						<Link to={this.props.location.pathname.split('/').slice(0, -1).join('/')+'/ante'} className="w-100">
							<Button variant="secondary" className="w-100">
								<Translate id="playback.switch"/>
							</Button>
						</Link>
					</div>
				) : null
				}
				
				
				{ this.props.location.pathname.endsWith('kute') ? null : (
					<div class="d-flex flex-column mx-auto w-100 justify-content-center align-items-center text-secondary">
						<Translate id="playback.share"/>
					</div>
					)
				}
			</main>
		);
	}
}

export default withLocalize(RecordingPlayback);
