import Debug from 'debug';
import React, { useContext, useState, useEffect } from 'react';

import { AppBar, Avatar, Box, Button, Icon, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import { AppContext } from './AppContext';

const debug = Debug('accounts:AppBarMenuAuth');

export default function () {
	const { session, setSession } = useContext(AppContext);
	const [ anchorEl, setAnchorEl ] = useState(null);

	const handleOpen = (event) => {
		setAnchorEl(event.target);
	};

	const handleClose = (event) => {
		setAnchorEl(null);
	};

	const handleLogoutClick = (event) => {
		window.location.href = '/logout';
	};

	debug("AppBarMenuAuth");

	return (
		<Box onMouseEnter={handleOpen} onMouseLeave={handleClose}>
			<Tooltip title='Menu'>
				<IconButton
					size="large"
					edge="end"
					color="inherit"
					aria-label="Menu"
				>
					<Avatar sx={{ mr: '2px' }} alt={session.account.name} src={session.account.picture} imgProps={{ referrerPolicy: 'no-referrer' }} />
					<MenuIcon />
				</IconButton>
			</Tooltip>
			<Menu
				id='menu-appbar'
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				MenuListProps={{ onMouseLeave: handleClose }}
				sx={{ mt: '45px' }}
			>
				<MenuItem onClick={handleLogoutClick}><Typography textAlign='center'>Logout</Typography></MenuItem>
			</Menu>
		</Box>
	);
}

