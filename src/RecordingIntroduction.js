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

class RecordingIntroduction extends React.Component{
	constructor(props){
		super(props);
		this.state = {tokenVerified: false, errorMessage: ""}
	}
	componentDidMount(){
		const url = `http://localhost:3001/api/${window.location.href.split('/').slice(-3)[0]}/get-private-metadata`; //TODO: Variable API endpoint
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
