import Debug from 'debug';
import React, { useContext, useState, useEffect } from 'react';

import { AppBar, Avatar, Box, Button, Icon, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import { AppContext } from './AppContext';
import AppBarMenuNoAuth from './AppBarMenuNoAuth';
import AppBarMenuAuth from './AppBarMenuAuth';

const debug = Debug('accounts:AppBar');

import { refetch } from './utils';

export default function () {
	const { session, setSession } = useContext(AppContext);

	debug("AppBar");

	const fetchSession = async () => {
        debug('fetchSession>');
        refetch('/api/session', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            debug('fetchSession<', data);
            setSession(Object.assign({}, data, {loaded: true}));
        })
		.catch(e => {
            setSession(Object.assign({}, session, {loaded: true, logged_out: true}));
			debug('fetchSession!', e);
		});
    };

    useEffect(() => {
        fetchSession();
    }, []);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Descartes Squares - square away the uncertainty.
					</Typography>
					{session?.account?.email?<AppBarMenuAuth/>:<AppBarMenuNoAuth/>}
				</Toolbar>
			</AppBar>
		</Box>
	);
}

