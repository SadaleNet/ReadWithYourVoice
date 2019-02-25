/*
Copyright 2019 Wong Cho Ching <https://sadale.net>

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React from 'react';

import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Helmet } from "react-helmet";

import Jumbotron from 'react-bootstrap/Jumbotron';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

class Home extends React.Component{
	componentDidMount() {
		document.title = "Read with Your Voice";
		this.props.setExtraStyle("");
	}
	render() {
		return (
			<main class="container flex-column d-flex p-2">
				<Translate>
					{({ translate }) => (
						<Helmet>
							<title>{translate("global.title")}</title>
						</Helmet>)
					}
				</Translate>
				<div class="d-flex mx-auto w-100 justify-content-center align-items-center">
					<Jumbotron>
					<h1>
						<Translate id="home.header">Toki Pona Text to Speech with Your Voice!</Translate>
					</h1>
					<p>
						<Translate id="home.description">Record 25 Toki Pona sentences and you can synthesize arbitrary Toki Pona text using your voice!</Translate>
					<br/>
					<small>
						<Translate id="home.remarks">For synthesizing non-standard words, additional syllables had to be recorded.</Translate>
					</small>
					</p>
					<p>
						<Link to="/kalama/00000000-0000-0000-0000-000000000000">
							<Button variant="primary">
							<Translate id="home.demovoice">Demo Voice</Translate>
							</Button>
						</Link>
						&nbsp;
						<Link to="/kalama-sin">
							<Button variant="primary">
							<Translate id="home.startrecording">Start Recording!</Translate>
							</Button>
						</Link>
					</p>
					<p>
						<a href="https://youtu.be/oV5kHIu6AVc" target="_blank" rel="noopener noreferrer">
							<Button variant="secondary">
							<Translate id="home.usagedemovideo" />
							</Button>
						</a>
					</p>
					</Jumbotron>
				</div>
				<div class="d-flex mx-auto w-100 justify-content-center align-items-center">
					<small>
						<Translate id="home.developedby">Developed by</Translate>
						&nbsp;
						<a href="https://sadale.net" target="_blank" rel="noopener noreferrer">
							<Translate id="home.author">Sadale</Translate>
						</a>
					</small>
				</div>
				<div class="d-flex mx-auto w-100 justify-content-center align-items-center">
					<small>
						<Translate id="home.sourcecode">Source code available on</Translate>
						&nbsp;
						<a href="https://github.com/SadaleNet/ReadWithYourVoice" target="_blank" rel="noopener noreferrer">
							<Translate id="home.github">Github</Translate>
						</a>
					</small>
				</div>
			</main>
		);
	}
}

export default withLocalize(Home);
