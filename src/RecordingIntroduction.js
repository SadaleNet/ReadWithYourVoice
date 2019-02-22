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

import CopyLinks from './CopyLinks'
import SpinningWheel from './SpinningWheel'
import ErrorDialog from "./ErrorDialog";

import config from './private/config.json';

class RecordingIntroduction extends React.Component{
	constructor(props){
		super(props);
		this.state = {tokenVerified: false, errorMessage: ""}
	}
	componentDidMount(){
		const url = `${config.apiEndPoint}/api/${window.location.href.split('/').slice(-3)[0]}/get-private-metadata`;
		let dataToBeSent = {
			token: window.location.href.split('/').slice(-2)[0]
		};
		let that = this;
		$.ajax(url, {
			data : JSON.stringify(dataToBeSent),
			contentType : 'application/json',
			type : 'POST',
			success : (data, textStatus, jqXHR) => {
				that.setState({tokenVerified: true});
			},
			error : (jqXHR, textStatus, errorThrown) => {
				this.setState({errorMessage:
					( (jqXHR.responseJSON && "errorMessage" in jqXHR.responseJSON) ?
					jqXHR.responseJSON.errorMessage : "Unknown Error Occured.")
				});
			},
		});
	}
	clearCloseErrorMessageDialog = () => {
		this.setState({errorMessage: ""});
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
				<ErrorDialog message={this.state.errorMessage} onClose={this.clearCloseErrorMessageDialog} />
				<div class="d-flex flex-column mx-auto flex-grow-1 w-100 h-100 justify-content-center align-items-center">
					<SpinningWheel show={!this.state.tokenVerified}/>
					<CopyLinks />
					<Link to={this.props.location.pathname.split('/').slice(0, -1).join('/')+'/ante'}>
						<Button variant="primary" disabled={!this.state.tokenVerified}>
							<Translate id="playback.switch"/>
						</Button>
					</Link>
				</div>
			</main>
		);
	}
}

export default withLocalize(RecordingIntroduction);
