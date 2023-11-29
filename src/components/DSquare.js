import Debug from 'debug';
import React, { useContext, useState, useEffect, useRef } from 'react';

import {
	Box,
	Chip,
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	Icon,
	IconButton,
	InputAdornment,
	Paper,
	Radio,
	RadioGroup,
	Switch,
	Table, TableContainer, TableCell, TableRow, TableHead, TableBody,
	TextField,
	Typography
} from '@mui/material';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { ArrowForwardOutlined as ArrowForwardOutlinedIcon } from '@mui/icons-material';
import {
	Add as AddIcon,
	KeyboardReturn as KeyboardReturnIcon
} from '@mui/icons-material';

import { AppContext } from './AppContext';
import Loader from './Loader';

export default function (props) {
	const { session, setSession } = useContext(AppContext);
	const [ id, setId ] = useState(props.dSquareId);

	const [ decision, setDecision ] = useState(null);
	const [ decisionChanged, setDecisionChanged ] = useState(false);
	const decisionRef = useRef('');

	const descKey = (cause, effect) => {
		return cause+':'+effect;
	}

	const descs = {};
	const descsRefs = {};

	for(const cause of [ 'Done', 'Not done' ]) {
		for(const effect of [ 'Will', 'Will not' ]) {
			const key = descKey(cause, effect);
			descs[key] = useState('');
			descsRefs[key] = useRef(null);
		}
	}

	const [ considerations, setConsiderations ] = useState([]);

	const [ shouldStore, setShouldStore ] = useState(false);

	const border = '1px solid rgba(224, 224, 224, 1)';

	const debug = Debug('descartes-dSquares:DSquare:'+session.account.email);

	debug("DSquare");

	const fetchDSquare = async () => {
		debug('fetchDSquare');
		return fetch(`/api/squares/${id}`, { credentials: 'include' })
		.then(response => response.json())
		.then(square => {
			debug('fetchDSquare', square);
			setId(square.id);
			setDecision(square.decision);
			if(decisionRef.current) {
				decisionRef.current.value = square.decision;
			}
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

	const updateDecision = async () => {
		if(!decisionChanged) {
			return;
		}
		debug('updateDecision', decision);
		const body = JSON.stringify({
			decision
		});

		const fetchOptions = {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-type': 'application/json'
			},
			body
		};

		return fetch(`/api/squares/${id}/decision`, fetchOptions)
		.then(response => response.json())
		.then(decision => {
			debug('updateDecision', decision);
			setDecisionChanged(false);
			return decision;
		});

	};

	const handleDecisionChange = async (event) => {
		setDecision(event.target.value);
		setDecisionChanged(true);
	};

	const handleDecisionBlur = async (event) => {
		if(!decisionChanged) {
			return;
		}
		await updateDecision();
	};

	const handleDecisionKeyDown = async (event) => {
		if(event.keyCode != 13) {
			return;
		}

		await updateDecision();
	};

	const deleteConsideration = async (considerationId) => {
		debug('deleteConsideration', considerationId);
		const fetchOptions = {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-type': 'application/json'
			}
		};

		return fetch(`/api/squares/${id}/considerations/${considerationId}`, fetchOptions)
		.then(response => response.json())
		.then(consideration => {
			debug('deleteConsideration', consideration);
			setConsiderations(considerations.filter(_consideration => _consideration.id != consideration.id));
			return consideration;
		});
	};

	const createConsideration = async (cause, effect, desc) => {
		debug('createConsideration', cause, effect);
		const body = JSON.stringify({
			cause,
			effect,
			desc
		});

		const fetchOptions = {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-type': 'application/json'
			},
			body
		};

		return fetch(`/api/squares/${id}/considerations`, fetchOptions)
		.then(response => response.json())
		.then(consideration => {
			debug('createConsideration', consideration);
			setConsiderations(considerations.concat([consideration]));
			return consideration;
		});

	};

	const handleConsiderationChange = (cause, effect, event) => {
		const [ desc, setDesc ] = descs[descKey(cause, effect)];

		setDesc(event.target.value);
	};

	const handleConsiderationKeyDown = (cause, effect, event) => {
		if(event.keyCode != 13) {
			return;
		}

		storeConsideration(cause, effect);
	};

	const handleConsiderationBlur = (cause, effect, event) => {
		storeConsideration(cause, effect);
	};

	const storeConsideration = async (cause, effect) => {
		const inputRef = descsRefs[descKey(cause,effect)];

		if( ! inputRef.current ) {
			return;
		}

		if( ! inputRef.current.value ) {
			return;
		}

		const [ desc, setDesc ] = descs[descKey(cause, effect)];
		debug('storeConsideration', cause, effect, desc);

		await createConsideration(cause, effect, inputRef.current.value);

		inputRef.current.value = '';
	};

	const renderConsiderations = (cause, effect) => {
		const inputRef = descsRefs[descKey(cause,effect)];
		const considerationElements = considerations
					.filter(consideration => consideration.cause == cause && consideration.effect == effect)
					.map((consideration, i) => 
			 			<Chip key={i} label={consideration.desc || consideration.id} variant="outlined" onDelete={() => deleteConsideration(consideration.id)} />
					);

		return <Box style={{ height: '100%', width: '100%' }}>
			<Box style={{ display: 'flex' }}>
				<Box sx={{ margin: 'auto', flexGrow: 1 }} >
					<TextField
						inputRef={inputRef}
						label={effect + ' happen if ' + cause.toLowerCase()}
						size='small'
						fullWidth={true}
						inputProps={{ style: { textAlign: 'center' } }}
						defaultValue={''}
						onChange={() => handleConsiderationChange(cause, effect, event)}
						onKeyDown={() => handleConsiderationKeyDown(cause, effect, event)}
						onBlur={() => handleConsiderationBlur(cause, effect, event)}
						InputProps={{
							endAdornment: ( 
								<InputAdornment position="end">
									<KeyboardReturnIcon onClick={() => storeConsideration(cause, effect)} />
								</InputAdornment>
							)
						}}
					/>
				</Box>
			</Box>
			<Box>
				{considerationElements}
			</Box>
		</Box>;
	};

	return	<Box sx={{ mt: '16px', mb: '4px' }} >
				<Box style={{ display: 'flex' }}>
					<Box sx={{ margin: 'auto', flexGrow: 1 }} >
						<TextField
							inputRef={decisionRef}
							label='Decision'
							size='small'
							fullWidth={true}
							inputProps={{ style: { textAlign: 'center' } }}
							defaultValue={decision}
							onChange={handleDecisionChange}
							onKeyDown={handleDecisionKeyDown}
							onBlur={handleDecisionBlur}
							InputProps={{
								endAdornment: ( 
									<InputAdornment position="end">
										<KeyboardReturnIcon onClick={updateDecision} />
									</InputAdornment>
								)
							}}
						/>
					</Box>
				</Box>
				<TableContainer component={Paper} >
					<Table sx={{ height: '80vh' }}>
						<TableBody>
							<TableRow>
								<TableCell style={{ width: '50%', height: '50%', borderRight: border }}>
									{renderConsiderations('Done', 'Will')}
								</TableCell>
								<TableCell>
									{renderConsiderations('Done', "Will not")}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell style={{ width: '50%', height: '50%', borderRight: border }}>
									{renderConsiderations('Not done', 'Will')}
								</TableCell>
								<TableCell>
									{renderConsiderations('Not done', 'Will not')}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Box>;

}

