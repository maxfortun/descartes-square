import Debug from 'debug';
import React, { useContext, useState, useEffect, useRef } from 'react';

import { Box, Button, Grid, FormControl, FormControlLabel, FormLabel, Icon, Paper, Radio, RadioGroup, Switch, Table } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { ArrowForwardOutlined as ArrowForwardOutlinedIcon } from '@mui/icons-material';

import { AppContext } from './AppContext';
import Loader from './Loader';

export default function (props) {
	const { session, setSession } = useContext(AppContext);
	const [ id, setId ] = useState(props.dSquareId);
	const [ considerations, setConsiderations ] = useState();

	const debug = Debug('descartes-dSquares:DSquare:'+session.email);

	debug("DSquare");

	const fetchDSquare = async () => {
		debug('fetchDSquare');
		return fetch(`/api/squares/${id}`, { credentials: 'include' })
		.then(response => response.json())
		.then(square => {
			debug('fetchDSquare', square);
			setId(square.id);
			setConsiderations(square.considerations);
			return square;
		});
	};

	const createDSquare = async () => {
		debug('createDSquare');
		return fetch(`/api/squares`, { method: 'POST', credentials: 'include' })
		.then(response => response.json())
		.then(square => {
			debug('createDSquare', square);
			setId(square.id);
			setConsiderations(square.considerations);
			return square;
		});
	};

	const didMount = useRef(false);
	useEffect(() => {
		if(!didMount.current) {
			didMount.current = true;
			debug('useEffect', 'mounted');
			if(!status) {
				if(id) {
					fetchDSquare();
				} else {
					createDSquare();
				}
			}
			return;
		}
	});

	if(!id) {
		return <Loader />;
	}

	return  <Box>
			</Box>;

}

