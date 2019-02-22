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
