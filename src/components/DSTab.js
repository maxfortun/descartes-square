import Debug from 'debug';

import React, {
	useContext
} from 'react';

import {
	Tab
} from '@mui/material';

import { AppContext } from './AppContext';

export default function (props) {
	const { session, setSession } = useContext(AppContext);

	const debug = Debug('descartes-squares:DSTab:'+session.account.email);

	return <Tab id={props.id} label={props.dSquare.decision} />;
}

