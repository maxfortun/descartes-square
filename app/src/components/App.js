import Debug from 'debug';
import React, { useState, useContext, useEffect } from 'react';

import { Icon } from '@mui/material';

import { AppContext } from './AppContext';
import AppBar from './AppBar';
import Welcome from './Welcome';
import Console from './Console';
import Loader from './Loader';
import LoggedOut from './LoggedOut';

const debug = Debug('dsquares:App');

const appContext = {};

export default function () {
	const [ state, setState ] = useState({
		should_login: localStorage.should_login == 'true',
		is_logged_in: false,
		selectedSquare: {}
	});

	Object.assign(appContext, {
		state, setState
	});

	useEffect(() => {
		localStorage.should_login = (state.should_login?'true':'false');
		debug('useEffect localStorage.should_login', localStorage.should_login);
	}, [state?.should_login]);

	function getAppComponent() {
		if(!state?.should_login) {
			return <Welcome />;
		}

		if(!state?.account) {
			return <Loader />;
		}

		return <Console />;
	}

	return (
		<AppContext.Provider value={ appContext }>
			<AppBar />
			{getAppComponent()}
		</AppContext.Provider>
	);
}

