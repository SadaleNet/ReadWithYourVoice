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
						<Link to="/40b5393d-a9f6-4e0b-8a5f-c59538d85ff0">
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
						<a href="https://github.com/SadaleNet/TODO" target="_blank" rel="noopener noreferrer">
							<Translate id="home.github">Github</Translate>
						</a>
					</small>
				</div>
			</main>
		);
	}
}

export default withLocalize(Home);
