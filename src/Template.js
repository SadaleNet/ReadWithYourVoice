import React from 'react';

import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Helmet } from "react-helmet";

class Template extends React.Component{
	render() {
		return (
			<main class="container flex-column d-flex p-2">
				<Translate>
					{({ translate }) => (
						<Helmet>
							<title>{translate("newvoice.title")+' | '+translate("global.title")}</title>
						</Helmet>)
					}
				</Translate>
				<div class="d-flex mx-auto w-100 justify-content-center align-items-center">
					Content Goes here...
				</div>
			</main>
		);
	}
}

export default withLocalize(Template);
