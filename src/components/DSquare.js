import Debug from 'debug';
import React, { useContext, useState, useEffect, useRef } from 'react';

import {
	Autocomplete,
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

import { 
	fetchDSquare,
	createConsideration,
	deleteConsideration
} from './api';

import { AppContext } from './AppContext';
import Loader from './Loader';

export default function (props) {

	const {
		selectedDSquare
	} = props;

	const {
		considerations,
		setConsiderations,
		decision,
		setDecision,
		error,
		setError,
		session,
		setSession
	} = useContext(AppContext);

	const [ shouldStore, setShouldStore ] = useState(false);

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

	const border = '1px solid rgba(224, 224, 224, 1)';

	const debug = Debug('descartes-squares:DSquare:'+session.account.email);

	if(!selectedDSquare?.id) {
		return <Loader />;
	}

	useEffect(() => {
		fetchDSquare({
			selectedDSquare,
			setConsiderations
		});
	}, [selectedDSquare.id]);

	if(!considerations) {
		return <Loader />;
	}

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

	const handleConsiderationsAdd = (cause, effect, event, options, reason, detail) => {
		debug('handleConsiderationsAdd', cause, effect, event, options, reason);
	};

	const handleConsiderationsChange = (cause, effect, event, options, reason, detail) => {
		if(reason == 'createOption') {
			return handleConsiderationsAdd(cause, effect, event, options, reason, detail);
		}

		if(reason == 'removeOption') {
			debug('handleConsiderationsChange', cause, effect, event, options, reason, detail, detail.option, detail.option?.props);
			return deleteConsideration({
				selectedDSquare,
				considerationId: detail.option.props.consideration_id,
				setConsiderations
			});
		}
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

		await createConsideration({
			cause,
			effect,
			desc: inputRef.current.value,
			selectedDSquare,
			setConsiderations
		});

		inputRef.current.value = '';
	};

	const renderConsiderations = (cause, effect) => {
		const inputRef = descsRefs[descKey(cause,effect)];
		const considerationElements = considerations
					.filter(consideration => consideration.cause == cause && consideration.effect == effect)
					.map((consideration, i) => {
						const label = <Box key={i} consideration_id={consideration.id}>
							{consideration.desc || consideration.id}
						</Box>;
						return label;
					});

		const label = ('What '+effect + ' happen if I ' + cause.toLowerCase()+' '+decision?.toLowerCase()).replaceAll(/[ .!?]+$/g, '')+'?';

		return <Box style={{ height: '100%', width: '100%' }}>
			<Box style={{ display: 'flex' }}>
				<Box sx={{ margin: 'auto', flexGrow: 1 }} >
					<Autocomplete
						clearIcon={false}
						options={[]}
						multiple
						freeSolo
						value={ considerationElements }
						renderInput={(params) => <TextField label={label} {...params} />}
						onChange={ ( event, options, reason, detail ) => handleConsiderationsChange( cause, effect, event, options, reason, detail ) }
					/>
				</Box>
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

