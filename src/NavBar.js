import React from 'react';
import { Link } from "react-router-dom";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";

import Navbar from 'react-bootstrap/Navbar';

const NavBar = ({languages, activeLanguage, setActiveLanguage}) => (
	<Navbar collapseOnSelect bg="light" expand="lg" navbar="light">
		<Navbar.Brand>
			<Link class="navbar-brand" to="/">
				<Translate id="global.title"/>
			</Link>
		</Navbar.Brand>
		<Navbar.Toggle aria-controls="responsive-navbar-nav" />
		<Navbar.Collapse id="responsive-navbar-nav">
			<ul class="navbar-nav ml-auto">
				<li class="nav-item">
					<a class="nav-link" onClick={() => setActiveLanguage("tkp")}>toki pona</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" onClick={() => setActiveLanguage("en")}>English</a>
				</li>
			</ul>
		</Navbar.Collapse>
	</Navbar>
);

export default withLocalize(NavBar);
