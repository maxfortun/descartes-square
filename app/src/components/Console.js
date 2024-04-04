import Debug from 'debug';
import React, { useState, useContext, useEffect } from 'react';

import { Icon } from '@mui/material';

import { WebSocket } from 'partysocket';
import ShareDb from 'sharedb/lib/client';
import ShareDbJSProxy from 'sharedb-jsproxy';
import ShareDbPromises from 'sharedb-promises';

import { state as _s } from './utils';
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
		state, setState
	} = useContext(AppContext);

	useEffect(() => {
		async function initShareDb() {
			const authProtocols = () => {
				const protocols = [];
				if(state.oidc.access_token) {
					protocols.push(btoa('Authorization: Bearer '+state.oidc.access_token));
				}
				return protocols;
			};

			const socket = new WebSocket(state.options.sharedb_ws_url, authProtocols);

			socket.addEventListener('error', e => {
				debug('WebSocket failed. Checking health.', e);
			});

			socket.addEventListener('close', e => {
				debug('WebSocket closed. Checking health.', e);
			});

			const _shareDbConnection = new ShareDb.Connection(socket);
			_shareDbConnection.debug = true;
			setState(_s( {shareDbConnection: _shareDbConnection} ));

			const accountDoc = _shareDbConnection.get('dsquares', state.account.id);
			const initData = {
				squares: []
			};

			const accountDocPromises = ShareDbPromises.doc(accountDoc);
			await accountDocPromises.fetchOrCreate(initData);
			await accountDocPromises.subscribe();
			debug('account', accountDoc);
			setState(_s({ accountProxy: new ShareDbJSProxy(accountDoc) }));
		}
		initShareDb();
	}, []);

	if(!state.accountProxy) {
		return <Loader />;
	}

	return <DSquares />;
}

