/*
Copyright 2019 Wong Cho Ching <https://sadale.net>

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React from 'react';
import $ from 'jquery';

import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Helmet } from "react-helmet";

import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

import SpinningWheel from './SpinningWheel'
import ErrorDialog from "./ErrorDialog";

import config from './private/config.json';

let loadAudio = require('./audioSynth.js').loadAudio;
let reloadAudio = require('./audioSynth.js').reloadAudio;
let playSentence = require('./audioSynth.js').playSentence;
let stopPlaying = require('./audioSynth.js').stopPlaying;

class RecordingModification extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			stressedFrequency: 0,
			unstressedFrequency: 0,
			durationValue: 0,
			sentences: [],
			currentSentence: -1,
			audioLoaded: false,
			errorMessage: "",
			step: "loading" //loading, idle, playing, recording, uploading
		};
	}
	prepareRecorder(){
		let that = this;
		this.recorder = new window.Recorder({
			encoderPath: `${process.env.PUBLIC_URL}/opus-recorder/encoderWorker.min.js`,
			resampleQuality: 10,
			mediaTrackConstraints: {
				autoGainControl: true,
				//Never enable echoCancellation.
				//It's empirically found that it causes the audio to sound strange.
				//It sucks on both headset and laptop mic.
				echoCancellation: false,
				noiseSuppression: true
			}
		});
		this.recorder.onstreamerror = this.recordErrorHandler;
		this.recorder.ondataavailable = (audioBuffer) => {
			if(that.state.step === "uploading"){
				let dataToBeSent = {
					token: window.location.href.split('/').slice(-2)[0],
					sentenceId: parseInt(that.state.currentSentence),
					//Converts audio data from Uint8Array to base64. Found in https://stackoverflow.com/a/42334410
					audio: window.btoa(
						new Uint8Array(audioBuffer).reduce(
							(data, byte) => data + String.fromCharCode(byte), ''
						)
					)
				};
				$.ajax(
				`${config.apiEndPoint}/api/${window.location.href.split('/').slice(-3)[0]}/send-audio`,
				{
					data : JSON.stringify(dataToBeSent),
					contentType : 'application/json',
					type : 'POST',
					success : (data, textStatus, jqXHR) => {
						that.setState({sentences: data.sentences});

						let wordList = [];
						for(let word of that.getCurrentSentence().sentence.split(' ')){
							if(word.endsWith('*')){
								wordList.push(word.slice(0, -1));
							}
						}
						reloadAudio(wordList, () => {
							that.setState({step: "playing"},
							() => {
								playSentence(that.getCurrentSentence().sentence,
								() => {
									that.setState({step: "idle"});
								});
							});
						});
					},
					error : that.ajaxErrorHandler,
				});
			}
		};

		this.recorder.onstart = () => {
			if(that.state.step === "recording"){
				playSentence(that.getCurrentSentence().sentence,
					() => {
						that.setState({step: "uploading"}, () => {
							that.recorder.stop();
						});
					}, 
					true);
			}
		};
	}
	//TODO: Code duplication with RecordPlayback.js. Consider extracting it.
	ajaxErrorHandler = (jqXHR, textStatus, errorThrown) => {
		this.setState({errorMessage:
			( (jqXHR.responseJSON && "errorMessage" in jqXHR.responseJSON) ?
			jqXHR.responseJSON.errorMessage : "Unknown Error Occured.")
		});
	}
	componentDidMount(){
		//Set the style of the parent container so that the UI components would use the entire page height
		this.props.setExtraStyle("h-100");

		this.prepareRecorder();

		let that = this;
		//Read public metadata
		$.ajax(
		`${config.dataEndPoint}/${window.location.href.split('/').slice(-3)[0]}/metadata.json`,
		{
			type : 'GET',
			success : (data, textStatus, jqXHR) => {
				that.setState({
					name: data.name,
					stressedFrequency: data.stressedFrequency,
					unstressedFrequency: data.unstressedFrequency,
					durationValue: data.durationValue
				});
				loadAudio(`${config.dataEndPoint}/${window.location.href.split('/').slice(-3)[0]}`,
				{
					stressedFrequency: data.stressedFrequency,
					unstressedFrequency: data.unstressedFrequency,
					syllableDuration: data.durationValue,
					fileSeparationDuration: data.durationValue/2,
					reload: true,
				}, () => {
					that.setState({step: "idle"});
				});
			},
			error : that.ajaxErrorHandler,
		});

		//Read private metadata
		let dataToBeSent = {
			token: window.location.href.split('/').slice(-2)[0]
		};
		$.ajax(
		`${config.apiEndPoint}/api/${window.location.href.split('/').slice(-3)[0]}/get-private-metadata`,
		{
			data : JSON.stringify(dataToBeSent),
			contentType : 'application/json',
			type : 'POST',
			success : (data, textStatus, jqXHR) => {
				that.setState({
					currentSentence: 0,
					sentences: data.sentences
				}, that.handleNextButton //Select the first non-recorded sentence
				);
			},
			error : that.ajaxErrorHandler,
		});
	}
	//TODO: Code duplication with RecordPlayback.js. Consider extracting it.
	clearCloseErrorMessageDialog = () => {
		this.setState({errorMessage: ""});
	}
	getWordList = () => {
		let wordList = [];
		for(let i of this.state.sentences){
			for(let word of i.sentence.split(' ')){
				if(word.endsWith('*')){
					if(word.includes('-') || word.includes('_'))
						continue; //Do not include syllables in the word list
					word = word.slice(0,-1);
					if(!(word in wordList)){
						wordList.push(word);
					}
				}
			}
		}
		return wordList.sort();
	}
	getCurrentSentence = (e) => {
		return (this.state.currentSentence !== -1 ? this.state.sentences[this.state.currentSentence] : {sentence: "", recorded: ""});
	}
	isNextAvailable = () => {
		for(let i=parseInt(this.state.currentSentence)+1; i<this.state.sentences.length; i++){
			if(!this.state.sentences[i].recorded)
				return true;
		}
		return false;
	}
	handleChangeSentence = (e) => {
		this.setState({currentSentence: e.target.value});
	}
	handleChangeSentenceByWord = (e) => {
		for(let i=0; i<this.state.sentences.length; i++){
			for(let word of this.state.sentences[i].sentence.split(' ')){
				if(word === e.target.value+'*'){
					this.setState({currentSentence: i});
					return;
				}
			}
		}
	}
	recordErrorHandler = (e) => {
		this.setState({step: "idle",
			errorMessage: "Recording Error: "+e.message});
		this.recorder.stop();
	}
	handleRecordButton = () => {
		let that = this;
		switch(this.state.step){
			case "idle":
				this.setState({step: "recording"}, () => {
					that.recorder.start().catch(that.recordErrorHandler);
				});
				
			break;
			case "recording":
				stopPlaying();
				this.setState({step: "idle"}, () => {that.recorder.stop(); });
			break;
			default:
		}
	}
	handlePlayButton = () => {
		let that = this;
		switch(this.state.step){
			case "idle":
				this.setState({step: "playing"}, () => {
					playSentence(that.getCurrentSentence().sentence, () => {
						that.setState({step: "idle"});
					});
				});
			break;
			case "playing":
				stopPlaying();
			break;
			default:
		}
	}
	handleNextButton = () => {
		for(let i=this.state.currentSentence; i<this.state.sentences.length; i++){
			if(!this.state.sentences[i].recorded){
				this.setState({currentSentence: i});
				break;
			}
		}
	}
	render() {
		return (
			<main class="container flex-column d-flex flex-grow-1 p-2">
				<Translate>
					{({ translate }) => (
						<Helmet>
							<title>{this.state.name+' | '+translate("record.title")+' | '+translate("global.title")}</title>
						</Helmet>)
					}
				</Translate>
				<ErrorDialog message={this.state.errorMessage} onClose={this.clearCloseErrorMessageDialog} />
				<div class="d-flex flex-column mx-auto flex-grow-1 w-100 justify-content-center align-items-center">
					<Form className="w-100">
						<Form.Group controlId="formBasicSentence" className="w-100">
							<Form.Label><Translate id="record.currentsentence"/></Form.Label>
							<Form.Control as="select" onChange={this.handleChangeSentence} disabled={this.state.step !== "idle"}>
								{
									this.state.sentences.map(x => (
										<option key={x.sentence}
											value={x.id}
											selected={(x.id===this.state.currentSentence)}>
										{x.recorded ? "[ ]" : "[!]"} {x.sentence}
										</option>
										)
									)
								}
							</Form.Control>
						</Form.Group>

						<Form.Control as="select" className="w-100"
							onChange={this.handleChangeSentenceByWord}
							value="-1"
							disabled={this.state.step !== "idle"}>
							<Translate>{({ translate }) => (
								<option value="-1" selected>{translate("record.search")}</option>
							)}</Translate>
							{
								this.getWordList().map((x) => (
									<option key={x} value={x}>{x}</option>
								))
							}
						</Form.Control>
					</Form>
				</div>
				<div class="d-flex flex-column mx-auto flex-grow-1 w-100 h-100 justify-content-center align-items-center">
					<big class="text-center"><b>
					{this.getCurrentSentence().sentence}
					</b></big>
					<SpinningWheel show={true} style={(!this.state.name || this.state.currentSentence===-1 || this.state.step === "loading" || this.state.step === "uploading") ? {} : {visibility:"hidden"}}/>
					<hr/>
					<Button variant="danger" className="w-100" onClick={this.handleRecordButton}
					disabled={(!this.state.name || this.state.currentSentence===-1
					|| (this.state.step !== "idle" && this.state.step !== "recording") )}>
						<b>
						{this.state.step==="recording"?<Translate id="record.stopRecord"/>:<Translate id="record.record"/>}
						</b>
					</Button>
					<Button variant="success" className="w-100" onClick={this.handlePlayButton}
					disabled={(this.state.step !== "idle" && this.state.step !== "playing")
					|| !this.getCurrentSentence().recorded}>
						<b>
						{this.state.step==="playing"?<Translate id="record.stopPlay"/>:<Translate id="record.play"/>}
						</b>
					</Button>
					<Button variant="primary" className="w-100" onClick={this.handleNextButton}
					disabled={this.state.step !== "idle" || !this.getCurrentSentence().recorded || !this.isNextAvailable()}>
						<b>
						{this.isNextAvailable()?<Translate id="record.next"/>:<Translate id="record.noMoreNext"/>}
						</b>
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
