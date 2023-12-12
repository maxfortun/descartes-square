import Debug from 'debug';
import React, {
	useContext,
	useState,
	useEffect,
	useRef
} from 'react';

import {
	Box,
	Tabs,
	Tab,
	Tooltip
} from '@mui/material';

import {
	Add as AddIcon,
	ArrowForwardOutlined as ArrowForwardOutlinedIcon
} from '@mui/icons-material';

import { AppContext } from './AppContext';

import DSTab from './DSTab';

export default function (props) {
	const { session, setSession } = useContext(AppContext);

	const debug = Debug('descartes-squares:DSTabs:'+session.account.email);

	if(!props.dSquares) {
		return;
	}

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

	const handleChange = (event, newValue) => {
		debug("Tab change:", newValue);
		// setValue(newValue);
	};

	debug("Rendering", props.dSquares);
	const tabs = props.dSquares.map((dSquare, i) => <DSTab key={i} {...props} id={'dstab:'+dSquare.id} dSquare={dSquare} />); 
	
	debug("props.selectedDSquare", props.selectedDSquare);
	const value = props.dSquares.map(dSquare => dSquare.id).indexOf(props.selectedDSquare.id) || 0;

	return <Box display='flex'>
		<Tabs
				value={value}
				onChange={handleChange}
				variant="scrollable"
  				scrollButtons={false}
		>
			{tabs}
		</Tabs>
		<AddIcon />
	</Box>;
}

