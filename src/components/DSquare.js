import Debug from 'debug';
import React, { useContext, useState, useEffect, useRef } from 'react';

import {
	Box,
	Button,
	Chip,
	Divider,
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
	Tooltip,
	Typography
} from '@mui/material';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { ArrowForwardOutlined as ArrowForwardOutlinedIcon } from '@mui/icons-material';
import {
	Add as AddIcon,
	DeleteForever as DeleteForeverIcon,
	Download as DownloadIcon,
	InvertColors as InvertColorsIcon,
	IosShare as IosShareIcon,
	KeyboardReturn as KeyboardReturnIcon
} from '@mui/icons-material';

import { refetch } from './utils';

import { AppContext } from './AppContext';
import Loader from './Loader';

export default function (props) {

	const {
		decision,
		setDecision,
		error,
		setError,
		session,
		setSession
	} = useContext(AppContext);

	const [ id, setId ] = useState(props.selectedDSquare?.id);

	const descKey = (cause, effect) => {
		return cause+':'+effect;
	}

	const descs = {};
	const descsRefs = {};

	const causes = [ 'do', 'do not' ];
	const effects = [ 'will', 'will not' ];

	for(const cause of causes) {
		for(const effect of effects) {
			const key = descKey(cause, effect);
			descs[key] = useState('');
			descsRefs[key] = useRef(null);
		}
	}

	const [ considerations, setConsiderations ] = useState([]);

	const [ shouldStore, setShouldStore ] = useState(false);

	const border = '1px solid rgba(224, 224, 224, 1)';

	const debug = Debug('descartes-squares:DSquare:'+session.account.email);

	const fetchDSquare = async () => {
		debug('fetchDSquare >', id);
		return refetch(`/api/squares/${id}`, { credentials: 'include' })
		.then(response => response.json())
		.then(square => {
			debug('fetchDSquare <', square);
			localStorage.dSquareId = square.id;
			setConsiderations(square.considerations);
			return square;
		});
	};

    useEffect(() => {
		debug('mounted', props);
	}, []);

	useEffect(() => {
		if(props.selectedDSquare?.id === undefined) {
			return;
		}
		debug('useEffect props.selectedDSquare.id', props.selectedDSquare?.id);
		setId(props.selectedDSquare.id);
	}, [props.selectedDSquare?.id]);

	useEffect(() => {
		if(id === undefined) {
			return;
		}
		debug('useEffect id', id);
		if(id) {
			fetchDSquare();
		}
	}, [id]);

	if(!id) {
		if(error) {
			return <Typography color='red'>{error}</Typography>;
		}
		return <Loader />;
	}

	const deleteConsideration = async (considerationId) => {
		debug('deleteConsideration', considerationId);
		const fetchOptions = {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-type': 'application/json'
			}
		};

		return refetch(`/api/squares/${id}/considerations/${considerationId}`, fetchOptions)
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

		return refetch(`/api/squares/${id}/considerations`, fetchOptions)
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
					.map((consideration, i) => {
						const label = <Box>
							{consideration.desc || consideration.id}
						</Box>;
			 			return <Chip key={i} label={label} variant="outlined" sx={{ mt: '4px' }} onDelete={() => deleteConsideration(consideration.id)} />;
					});

		const label = ('What '+effect + ' happen if I ' + cause.toLowerCase()+' '+decision.toLowerCase()).replaceAll(/[ .!?]+$/g, '')+'?';

		return <Box style={{ height: '100%', width: '100%' }}>
			<Box style={{ display: 'flex' }}>
				<Box sx={{ margin: 'auto', flexGrow: 1 }} >
					<TextField
						inputRef={inputRef}
						label={label}
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
				<TableContainer component={Paper} >
					<Table sx={{ height: '75vh' }}>
						<TableBody>
							<TableRow>
								<TableCell style={{ width: '50%', height: '50%', borderRight: border }}>
									{renderConsiderations(causes[0], effects[0])}
								</TableCell>
								<TableCell>
									{renderConsiderations(causes[1], effects[0])}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell style={{ width: '50%', height: '50%', borderRight: border }}>
									{renderConsiderations(causes[0], effects[1])}
								</TableCell>
								<TableCell>
									{renderConsiderations(causes[1], effects[1])}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Box>;
}

