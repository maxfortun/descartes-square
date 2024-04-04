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

	const { selectedSquare, squares } = state;

	const debug = Debug('dsquares:DSTabs:'+state.account.email);

	useEffect(() => {
		if(!squares?.length) {
			debug('useEffect', 'selectedSquare.id', 'no squares');
			return;
		}

		if(selectedSquare.id) {
			debug('useEffect', 'selectedSquare.id', 'already selected', selectedSquare.id);
			return;
		}

		if(localStorage.dSquareId) {
			selectedSquare.id = squares.some(square => square.id == localStorage.dSquareId)?.[0]?.id;
			debug('useEffect', 'selectedSquare.id', 'from localStore.dSquareId', selectedSquare.id);
			return;
		}

		selectedSquare.id = squares[squares.length - 1].id;
		debug('useEffect', 'selectedSquare.id', 'last one', squares.length - 1, selectedSquare.id);
	}, [selectedSquare?.id]);


	const handleAddSquare = (event) => {
	};

	const handleChangeSquare = (event, i) => {
		const selectedSquare = squares[i];
		debug('handleChange', i, selectedSquare);
		setSelectedConsiderations(null);
		setSelectedSquare(selectedSquare);
	};

	const handleShowInvites = (event) => {
	};

	const handleShowOwn = (event) => {
	};

	debug("Rendering", squares);
	const tabs = squares?.map((dSquare, i) => {
		if(dSquare.id && dSquare.id == selectedSquare.id) {
			return <DSTab key={i} {...props} dSquare={dSquare} />
		}
		return <Tab key={i} label={dSquare.decision || 'Empty' } />
	}) || []; 
	
	const value = squares?.map(dSquare => dSquare.id).indexOf(selectedSquare.id);
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

