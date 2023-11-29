import Debug from 'debug';
import React, { useContext, useState, useEffect, useRef } from 'react';

import {
	Box,
	Button,
	Grid,
	FormControl,
	FormControlLabel,
	FormLabel,
	Icon,
	Paper,
	Radio,
	RadioGroup,
	Switch
} from '@mui/material';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { ArrowForwardOutlined as ArrowForwardOutlinedIcon } from '@mui/icons-material';

import { AppContext } from './AppContext';
import Loader from './Loader';
import DSquare from './DSquare';

export default function () {
	const { session, setSession } = useContext(AppContext);
	const [ dSquares, setDSquares ] = useState(null);

	const debug = Debug('descartes-dSquares:DSquares:'+session.account.email);

	debug("DSquares");

	const fetchDSquares = async () => {
		debug('fetchDSquares');
		return fetch('/api/squares', { credentials: 'include' })
		.then(response => response.json())
		.then(dSquares => {
			debug('fetchDSquares', dSquares);
			setDSquares(dSquares);
			return dSquares;
		});
	};

	const didMount = useRef(false); 
	useEffect(() => {
		if(!didMount.current) { 
			didMount.current = true;
			debug('useEffect', 'mounted');
			if(!status) { 
				fetchDSquares();
			}
			return;
		} 
	});

	if(!dSquares) {
		return <Loader />;
	}

	const buttons = dSquares.map((dSquare, i) => <Button key={i} variant='outlined'>{dSquare.decision}</Button>);
	const dSquareElements = dSquares.map((dSquare, i) => <DSquare key={i} dSquareId={dSquare.id} />);
	if(dSquareElements.length == 0) {
		dSquareElements.push(<DSquare key='0' />);
	}

	return	<Box sx={{ mt: '4px' }}>
				<Box>
					{buttons}
				</Box>
				<Box>
					{dSquareElements}
				</Box>
			</Box>;

}

