import Debug from 'debug';
import React, { useContext, useState, useEffect, useRef } from 'react';

import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	Icon,
	IconButton,
	Paper,
	Radio,
	RadioGroup,
	Switch,
	Table,
	TableContainer, TableCell, TableRow, TableHead, TableBody, TextField
} from '@mui/material';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { ArrowForwardOutlined as ArrowForwardOutlinedIcon } from '@mui/icons-material';
import { Add as AddIcon } from '@mui/icons-material';

import { AppContext } from './AppContext';
import Loader from './Loader';

export default function (props) {
	const { session, setSession } = useContext(AppContext);
	const [ id, setId ] = useState(props.dSquareId);

	const [ decision, setDecision ] = useState('');
	const [ decisionChanged, setDecisionChanged ] = useState(false);

	const [ considerations, setConsiderations ] = useState([]);

	const [ shouldStore, setShouldStore ] = useState(false);

	const debug = Debug('descartes-dSquares:DSquare:'+session.account.email);

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

	const handleDecisionChange = async (event) => {
		setDecisionChanged(true);
	};

	const handleDecisionBlur = async (event) => {
		if(!decisionChanged) {
			return;
		}
		setDecisionChanged(false);
		setShouldStore(true);
	};

	return	<Box>
				<Box fullWidth={true}>
					<TextField
						id='decision'
						label='Decision'
						size='small'
						fullWidth={true}
						sx={{ mt: '16px', mb: '4px' }}
						inputProps={{ style: { textAlign: 'center' } }}
						defaultValue={decision || ''}
						onChange={handleDecisionChange}
						onBlur={handleDecisionBlur}
					/>
					<IconButton
						size="large"
						edge="end"
						color="inherit"
						aria-label="Add"
					>
						<AddIcon />
					</IconButton>
				</Box>
				<TableContainer component={Paper} >
					<Table sx={{ height: '80vh' }}>
						<TableBody>
							<TableRow>
								<TableCell align='center'>Will happen if done</TableCell>
								<TableCell align='center'>Won't happen if done</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='center'>Will happen if not done</TableCell>
								<TableCell align='center'>Won't happen if not done</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Box>;

}

