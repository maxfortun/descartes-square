import Debug from 'debug';
import React, { useContext, useState, useEffect } from 'react';

import { AppBar, Avatar, Box, Button, Icon, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import { AppContext } from './AppContext';

const debug = Debug('accounts:AppBarMenuAuth');

export default function () {
	const [ anchorEl, setAnchorEl ] = useState(null);

	const handleOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (event) => {
		setAnchorEl(null);
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
				<MenuItem><Typography textAlign='center'>Login</Typography></MenuItem>
			</Menu>
		</Box>
	);
}

