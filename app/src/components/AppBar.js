import Debug from 'debug';
import React, { useContext, useState, useEffect } from 'react';

import { AppBar, Avatar, Box, Button, Icon, Toolbar, Tooltip, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import { AppContext } from './AppContext';
import AppBarMenuNoAuth from './AppBarMenuNoAuth';
import AppBarMenuAuth from './AppBarMenuAuth';

const debug = Debug('dsquares:AppBar');

import { refetch, state as _s } from './utils';

export default function () {
	const { 
		state, setState
	} = useContext(AppContext);

	const fetchSession = async () => {
		debug('fetchSession >');
		refetch('/api/session', { credentials: 'include' })
		.then(response => response.json())
		.then(data => {
			debug('fetchSession <', data);
			setState(_s(data));
		})
		.catch(e => {
			setState(_s({should_login: false}));
			debug('fetchSession !', e);
		});
	};

	useEffect(() => {
		debug('mounted');
	}, []);

	useEffect(() => {
		if(!state.should_login) {
			return;
		}
		fetchSession();
	}, [state.should_login]);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Descartes' Squares - square away the uncertainty.
					</Typography>
					{ state?.account?.email
						? <AppBarMenuAuth/>
						: <AppBarMenuNoAuth/>
					}
				</Toolbar>
			</AppBar>
		</Box>
	);
}

