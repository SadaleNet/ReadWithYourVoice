/*
Copyright 2019 Wong Cho Ching <https://sadale.net>

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React from 'react';
import { Link } from "react-router-dom";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";

import Button from 'react-bootstrap/Button';
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
					<Button variant="light" onClick={() => setActiveLanguage("tkp")}>toki pona</Button>
				</li>
				&nbsp;
				<li class="nav-item">
					<Button variant="light" onClick={() => setActiveLanguage("en")}>English</Button>
				</li>
			</ul>
		</Navbar.Collapse>
	</Navbar>
);

export default withLocalize(NavBar);
