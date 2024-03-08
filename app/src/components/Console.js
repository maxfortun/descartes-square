import Debug from 'debug';
import React, { useState, useContext, useEffect } from 'react';

import { Icon } from '@mui/material';

import { WebSocket } from 'partysocket';
import ShareDb from 'sharedb/lib/client';
import ShareDbJSProxy from 'sharedb-jsproxy';
import ShareDbPromises from 'sharedb-promises';

import { AppContext } from './AppContext';
import AppBar from './AppBar';
import Welcome from './Welcome';
import DSquares from './DSquares';
import Loader from './Loader';
import LoggedOut from './LoggedOut';

const debug = Debug('dsquares:Console');
const debugShareDb = Debug('dsquares:ShareDb');
ShareDb.logger.setMethods({
	info: debugShareDb,
	warn: debugShareDb,
	error: debugShareDb
});

export default function () {

	const {
		selectedSquare, setSelectedSquare,
		selectedDecision, setSelectedDecision,
		selectedConsiderations, setSelectedConsiderations,
		selectedMembers, setSelectedMembers,
		selectedInvites, setSelectedInvites,
		squares, setSquares,
		invites, setInvites,
		error, setError,
		session, setSession,
		shareDbConnection, setShareDbConnection,
		squaresProxy, setSquaresProxy 
	} = useContext(AppContext);

	useEffect(() => {
		async function initShareDb() {
			const authProtocols = () => {
				const protocols = [];
				if(session.oidc.access_token) {
					protocols.push(btoa('Authorization: Bearer '+session.oidc.access_token));
				}
				return protocols;
			};

			const socket = new WebSocket('wss://sharedb.me/ws?collection=dsquares', authProtocols);

			socket.addEventListener('error', e => {
				debug('WebSocket failed. Checking health.', e);
			});

			socket.addEventListener('close', e => {
				debug('WebSocket closed. Checking health.', e);
			});

			const _shareDbConnection = new ShareDb.Connection(socket);
			_shareDbConnection.debug = true;
			setShareDbConnection(_shareDbConnection);

			const squaresDoc = _shareDbConnection.get('dsquares', session.account.id);
			const initData = {
				idps: [],
				collections: []
			};

			const squaresDocPromises = ShareDbPromises.doc(squaresDoc);
			await squaresDocPromises.fetchOrCreate(initData);
			await squaresDocPromises.subscribe();
			debug('squares', squaresDoc);
			setSquaresProxy(new ShareDbJSProxy(squaresDoc));
		}
		initShareDb();
	}, []);

	return <DSquares />;
}

