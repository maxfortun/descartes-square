import Debug from 'debug';
import React, {
	useContext,
	useState,
	useEffect,
	useRef
} from 'react';

import {
	Box,
	IconButton,
	Tab,
	Tabs,
	Tooltip
} from '@mui/material';

import {
	Add as AddIcon,
	ArrowForwardOutlined as ArrowForwardOutlinedIcon,
	PlaylistAddCheckOutlined as PlaylistAddCheckOutlinedIcon,
	PlaylistAddOutlined as PlaylistAddOutlinedIcon
} from '@mui/icons-material';

import {
	createDSquare
} from './api';

import { AppContext } from './AppContext';
import { state as _s } from './utils';
import DSTab from './DSTab';

export default function (props) {
	const {
		state, setState
	} = useContext(AppContext);

	const { selectedSquare, accountProxy } = state;

	const debug = Debug('dsquares:DSTabs:'+state.account.email);

	useEffect(() => {
		if(!accountProxy.squares?.length) {
			debug('useEffect', 'selectedSquare._id', 'no squares');
			return;
		}

		if(selectedSquare._id) {
			debug('useEffect', 'selectedSquare._id', 'already selected', selectedSquare._id);
			return;
		}

		if(localStorage.dSquareId) {
			selectedSquare._id = accountProxy.squares.some(square => square._id == localStorage.dSquareId)?.[0]?._id;
			if(selectedSquare._id) {
				debug('useEffect', 'selectedSquare._id', 'from localStore.dSquareId', selectedSquare._id);
				return;
			}
		}

		selectedSquare._id = accountProxy.squares[accountProxy.squares.length - 1]._id;
		debug('useEffect', 'selectedSquare._id', 'last one', accountProxy.squares.length - 1, selectedSquare._id);
	}, [selectedSquare?._id]);


	const handleAddSquare = (event) => {
		accountProxy.squares.push({ _id: crypto.randomUUID() });
	};

	const handleChangeSquare = (event, i) => {
		const selectedSquare = accountProxy.squares[i];
		debug('handleChange', i, selectedSquare);
		// setSelectedConsiderations(null);
		// setSelectedSquare(selectedSquare);
	};

	const handleShowInvites = (event) => {
	};

	const handleShowOwn = (event) => {
	};

	debug("Rendering", accountProxy.squares);
	const tabs = accountProxy.squares?.map((dSquare, i) => {
		if(dSquare._id && dSquare._id == selectedSquare._id) {
			return <DSTab key={i} {...props} dSquare={dSquare} />
		}
		return <Tab key={i} label={dSquare.decision || 'Empty' } />
	}) || []; 
	
	const value = accountProxy.squares?.map(dSquare => dSquare._id).indexOf(selectedSquare._id);
	debug("selectedSquare", value, selectedSquare);

	const buttons = [];
	buttons.push(
		<IconButton
			key={buttons.length}
			size="small"
			onClick={handleAddSquare}
		>
			<Tooltip placement="top-start" title="Add a square">
				<AddIcon />
			</Tooltip>
		</IconButton>
	);

/*
	if(selectedInvites?.length) {
		buttons.push(
			<IconButton
				key={buttons.length}
				size="small"
				onClick={handleShowInvites}
			>
				<Tooltip placement="top-start" title="Show selectedInvites">
					<PlaylistAddOutlinedIcon />
				</Tooltip>
			</IconButton>
		);
	}
*/

	return <Box
		display='flex'
		justifyContent='center'
		sx={{ mt: '16px' }}
	>
		<Box
			justifyContent='center'
		>
			<Tabs
				value={value}
				onChange={handleChangeSquare}
				variant="scrollable"
  				scrollButtons={false}
			>
				{tabs}
			</Tabs>
		</Box>
		<Box 
			display='flex'
			justifyContent='center'
			sx={{ ml: '4px', mr: '4px' }}
		>
			{buttons}
		</Box>
	</Box>;
}

