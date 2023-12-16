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
	ArrowForwardOutlined as ArrowForwardOutlinedIcon
} from '@mui/icons-material';

import { AppContext } from './AppContext';
import { refetch } from './utils';
import DSTab from './DSTab';

export default function (props) {
	const {
		error,
		setError,
		session,
		setSession
	} = useContext(AppContext);

	const debug = Debug('descartes-squares:DSTabs:'+session.account.email);

	if(!props.dSquares) {
		return;
	}

	const createDSquare = async () => {
		debug('createDSquare >');
		return refetch(`/api/squares`, { method: 'POST', credentials: 'include' })
		.then(async response => {
			if(response.status < 400) {
				return response.json();
			}
			throw await response.json();
		})
		.then(square => {
			debug('createDSquare <', square);
			localStorage.dSquareId = square.id;
			props.setDSquares(props.dSquares.concat([square]));
			props.setSelectedDSquare(square);
		})
		.catch(e => { 
			debug('createDSquare !', e);
			setError(e.error+'. '+(e.detail?.description || ''));
		}); 
	};

	useEffect(() => {
		if(props.dSquares.length) {
			return;
		}
		createDSquare();
	}, [props.dSquares]);

	useEffect(() => {
		if(props.selectedDSquare.id !== undefined) {
			return;
		}

		if(localStorage.dSquareId) {
			const selectedSquare = props.dSquares.some(square => square.id == localStorage.dSquareId)[0];
			debug('useEffect', 'props.selectedDSquare.id localStorage.dSquareId', 'selectedSquare', props.dSquares, localStorage.dSquareId, selectedSquare);
			if(selectedSquare) {
				props.setSelectedDSquare(selectedSquare);
				return;
			}
		}

		if(props.dSquares.length > 0) {
			const selectedSquare = props.dSquares[0];
			debug('useEffect', 'props.selectedDSquare.id 0', 'selectedSquare', props.dSquares, selectedSquare);
			props.setSelectedDSquare(selectedSquare);
			return;
		}

	}, [props.selectedDSquare.id]);


	if(!props.selectedDSquare.id) {
		return;
	}

	const handleAdd = async (event) => {
		createDSquare();
	};

	const handleChange = (event, i) => {
		const selectedSquare = props.dSquares[i];
		debug('handleChange', i, selectedSquare);
		props.setSelectedDSquare(selectedSquare);
	};

	debug("Rendering", props.dSquares);
	const tabs = props.dSquares.map((dSquare, i) => {
		if(dSquare.id && dSquare.id == props.selectedDSquare.id) {
			return <DSTab key={i} {...props} dSquare={dSquare} />
		}
		return <Tab key={i} label={dSquare.decision} />
	}); 
	
	const value = props.dSquares.map(dSquare => dSquare.id).indexOf(props.selectedDSquare.id);
	debug("props.selectedDSquare", value, props.selectedDSquare);

	return <Box
		display='flex'
		justifyContent='center'
		alignItems='center'
		sx={{ mt: '16px' }}
	>
		<Tabs
				value={value}
				onChange={handleChange}
				variant="scrollable"
  				scrollButtons={false}
		>
			{tabs}
		</Tabs>
		<IconButton
			size="small"
			onClick={handleAdd}
		>
			<Tooltip placement="top-start" title="Add a square">
				<AddIcon />
			</Tooltip>
		</IconButton>
	</Box>;
}

