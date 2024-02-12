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
import { refetch } from './utils';
import DSTab from './DSTab';

export default function (props) {
	const {
		selectedSquare, setSelectedSquare,
		selectedDecision, setSelectedDecision,
		selectedConsiderations, setSelectedConsiderations,
		selectedMembers, setSelectedMembers,
		selectedInvites, setSelectedInvites,
		squares, setSquares,
		invites, setInvites,
		error, setError,
		session, setSession
	} = useContext(AppContext);

	const debug = Debug('descartes-squares:DSTabs:'+session.account.email);

	if(!squares) {
		return;
	}

	useEffect(() => {
		if(squares.length) {
			return;
		}
		createDSquare({
			setSquares,
			setConsiderations,
			setSelectedSquare,
			setError
		});
	}, [squares]);

	useEffect(() => {
		if(selectedSquare?.id !== undefined) {
			return;
		}

		if(localStorage.dSquareId) {
			const selectedSquare = squares.some(square => square.id == localStorage.dSquareId)[0];
			debug('useEffect', 'selectedSquare.id localStorage.dSquareId', 'selectedSquare', squares, localStorage.dSquareId, selectedSquare);
			if(selectedSquare) {
				setSelectedSquare(selectedSquare);
				return;
			}
		}

		if(squares.length > 0) {
			const selectedSquare = squares[0];
			debug('useEffect', 'selectedSquare.id 0', 'selectedSquare', squares, selectedSquare);
			setSelectedSquare(selectedSquare);
			return;
		}

	}, [selectedSquare?.id]);


	if(!selectedSquare?.id) {
		return;
	}

	const handleAdd = async (event) => {
		createDSquare({
			setSquares,
			setConsiderations,
			setSelectedSquare,
			setError
		});
	};

	const handleChange = (event, i) => {
		const selectedSquare = squares[i];
		debug('handleChange', i, selectedSquare);
		setConsiderations(null);
		setSelectedSquare(selectedSquare);
	};

	const handleShowInvites = (event) => {
	};

	const handleShowOwn = (event) => {
	};

	debug("Rendering", squares);
	const tabs = squares.map((dSquare, i) => {
		if(dSquare.id && dSquare.id == selectedSquare.id) {
			return <DSTab key={i} {...props} dSquare={dSquare} />
		}
		return <Tab key={i} label={dSquare.decision || 'Empty' } />
	}); 
	
	const value = squares.map(dSquare => dSquare.id).indexOf(selectedSquare.id);
	debug("selectedSquare", value, selectedSquare);

	const buttons = [];
	buttons.push(
		<IconButton
			key={buttons.length}
			size="small"
			onClick={handleAdd}
		>
			<Tooltip placement="top-start" title="Add a square">
				<AddIcon />
			</Tooltip>
		</IconButton>
	);

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
	
	return <Box
		display='flex'
		justifyContent='center'
		sx={{ mt: '16px' }}
	>
		<Box
			justifyContent='center'
			sx={{ width:'100%' }}
		>
			<Tabs
				value={value}
				onChange={handleChange}
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

