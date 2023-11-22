import Debug from 'debug';
import React, { useState, useContext } from 'react';

import { Icon } from '@mui/material';

import { AppContext } from './AppContext';
import AppBar from './AppBar';
import Welcome from './Welcome';
import DSquares from './DSquares';
import Loader from './Loader';
import LoggedOut from './LoggedOut';

const debug = Debug('descartes-squares:App');

const appContext = {};

export default function () {
	debug("App");
	const [ session, setSession ] = useState({});
	Object.assign(appContext, { session, setSession });


	function getAppComponent() {
		if(!session.loaded) {
			return <Loader />;
		}

		if(session.logged_out) {
			return <LoggedOut />;
		}

		if(session.account) {
			return <DSquares />;
		}

		return <Welcome />;
	}

	return (
		<AppContext.Provider value={ appContext }>
			<AppBar />
			{getAppComponent()}
		</AppContext.Provider>
	);
}

