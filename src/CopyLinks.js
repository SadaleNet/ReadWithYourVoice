import React from 'react';
import $ from 'jquery';

import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

//TODO: Extract components for the copyable textboxes
class CopyLinks extends React.Component{
	constructor(props){
		super(props);
		this.state = {modifyCopied: false, shareCopied: false};
	}
	copyToClipboard = (type) => {
		const displayCopiedDuration = 1000;
		if(type==="modify"){
			$("#CopyLinksModify").select();
			this.setState({modifyCopied: true});
			setTimeout(() => this.setState({modifyCopied: false}), displayCopiedDuration);
		}else if(type==="share"){
			$("#CopyLinksShare").select();
			this.setState({shareCopied: true});
			setTimeout(() => this.setState({shareCopied: false}), displayCopiedDuration);
		}
		document.execCommand("copy");
	};
	render() {
		return (
			<div class="w-100">
				<Form.Label><Translate id="copylinks.modify"/></Form.Label>
				<InputGroup className="mb-3 w-100">
					<Form.Control
						id="CopyLinksModify"
						aria-label="URL for voice modification"
						value={window.location.href.split('/').slice(0, -1).join('/')}
						readOnly
					/>
					<InputGroup.Append>
						<Translate>
							{({ translate }) => (
							<Button variant="outline-secondary" onClick={() => this.copyToClipboard("modify")}>{this.state.modifyCopied?translate("copylinks.copied"):translate("copylinks.copy")}</Button>)
							}
						</Translate>
					</InputGroup.Append>
				</InputGroup>
				<Form.Label><Translate id="copylinks.share"/></Form.Label>
				<InputGroup className="mb-3 w-100">
					<Form.Control
						id="CopyLinksShare"
						aria-label="URL for voice sharing"
						value={window.location.href.split('/').slice(0, -2).join('/')}
						readOnly
					/>
					<InputGroup.Append>
						<Translate>
							{({ translate }) => (
							<Button variant="outline-secondary" onClick={() => this.copyToClipboard("share")}>{this.state.shareCopied?translate("copylinks.copied"):translate("copylinks.copy")}</Button>)
							}
						</Translate>
					</InputGroup.Append>
				</InputGroup>
			</div>
		);
	}
}

export default withLocalize(CopyLinks);
