import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";

function ErrorDialog(props){
	return (
		<Modal show={props.message} onHide={props.onClose} backdrop="static">
			<Modal.Header closeButton>
				<Modal.Title><Translate id="global.error"/></Modal.Title>
			</Modal.Header>
			<Modal.Body>{props.message}</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={props.onClose}>
				<Translate id="global.ok"/>
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default withLocalize(ErrorDialog);
