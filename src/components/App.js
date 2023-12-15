import Debug from 'debug';
import React, { useState, useContext, useEffect } from 'react';

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
	const [ session, setSession ] = useState({ login: localStorage.login == 'true'});
	const [ error, setError ] = useState(null);
	Object.assign(appContext, {
		error,
		setError,
		session,
		setSession
	});

	useEffect(() => {
		debug('mounted');
	}, []);

	useEffect(() => {
		debug('useEffect session.login', session.login);
		localStorage.login = session.login;
	}, [session.login]);

	function getAppComponent() {
		if(!session.login) {
			return <Welcome />;
		}

		if(!session.loaded) {
			return <Loader />;
		}

		if(session.logged_out) {
			return <LoggedOut />;
		}

		if(session.account) {
			return <DSquares />;
		}

		return <div>Error</div>;
	}

	return (
		<AppContext.Provider value={ appContext }>
			<AppBar />
			{getAppComponent()}
		</AppContext.Provider>
	);
}

