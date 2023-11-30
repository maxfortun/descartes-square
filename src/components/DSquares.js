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
	IconButton,
	Paper,
	Radio,
	RadioGroup,
	Switch
} from '@mui/material';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
	Add as AddIcon,
	ArrowForwardOutlined as ArrowForwardOutlinedIcon
} from '@mui/icons-material';

import { AppContext } from './AppContext';
import Loader from './Loader';
import DSquare from './DSquare';

export default function (props) {
	const { session, setSession } = useContext(AppContext);
	const [ dSquares, setDSquares ] = useState(null);
	const [ dSquareId, setDSquareId ] = useState(null);

	const debug = Debug('descartes-dSquares:DSquares:'+session.account.email);

	debug("DSquares", props);

	const fetchDSquares = async () => {
		debug('fetchDSquares');
		return fetch('/api/squares', { credentials: 'include' })
		.then(response => response.json())
		.then(dSquares => {
			debug('fetchDSquares', dSquares);
			setDSquares(dSquares);
			if(dSquares.length > 0) {
				setDSquareId(dSquares[0].id);
			}
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

	const buttons = dSquares.map((dSquare, i) => <Button key={i} variant='outlined' sx={{ mr: '4px' }} onClick={() => setDSquareId(dSquare.id)}>{dSquare.decision}</Button>);
	buttons.push(
		<IconButton
			key={buttons.length}
			size="large"
			edge="end"
			color="inherit"
			aria-label="Menu"
			onClick={() => setDSquareId(null)}
		>
			<AddIcon />
		</IconButton>
	);

	return	<Box sx={{ mt: '4px' }}>
				<Box>
					{buttons}
				</Box>
				<Box>
					{<DSquare dSquareId={dSquareId} />}
				</Box>
			</Box>;

}

