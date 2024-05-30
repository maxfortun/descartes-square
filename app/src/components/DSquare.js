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

import { AppContext } from './AppContext';
import Loader from './Loader';

export default function (props) {

	const {
		state, setState
	} = useContext(AppContext);

	const { selectedSquare, accountProxy } = state;

	const [ dSquare, setDSquare ] = useState(null);

	const causes = [ 'do', 'do not' ];
	const effects = [ 'will', 'will not' ];

	const border = '1px solid rgba(224, 224, 224, 1)';

	const debug = Debug('dsquares:DSquare:'+state.account.email);

	if(!selectedSquare?._id) {
		return <Loader />;
	}

	useEffect(() => {
		(async () => {
			debug('selectedSquare', selectedSquare, accountProxy.squares);

			if(!selectedSquare._id) {
				setDSquare(null);
				return;
			}

			const square = accountProxy.squares.find((square) => square._id == selectedSquare._id);
			debug('selectedSquare square', square);
			setDSquare(square);
		})();
	}, [selectedSquare._id]);

	if(!dSquare) {
		return <Loader />;
	}

	const handleConsiderationsAdd = (cause, effect, event, options, reason, detail) => {
		debug('handleConsiderationsAdd', cause, effect, event, options, reason);
	};

	const handleConsiderationsChange = (cause, effect, event, options, reason, detail) => {
		debug('handleConsiderationsChange', cause, effect, options, reason, detail);

		if(reason == 'createOption') {
			return createConsideration({
				cause,
				effect,
				desc: detail.option,
				selectedSquare,
				setSelectedConsiderations
			});

		}

		if(reason == 'removeOption') {
			return deleteConsideration({
				selectedSquare,
				considerationId: detail.option.props.consideration_id,
				setSelectedConsiderations
			});
		}
	};

	const renderConsiderations = (cause, effect) => {
		debug('renderConsiderations', cause, effect, accountProxy.squares);

		const considerationElements = [];
/*
		const considerationElements = selectedConsiderations
					.filter(consideration => consideration.cause == cause && consideration.effect == effect)
					.map((consideration, i) => {
						const label = <Box key={i} consideration_id={consideration.id}>
							{consideration.desc || consideration.id}
						</Box>;
						return label;
					});
*/

		const label = ('What '+effect + ' happen if I ' + cause.toLowerCase()+' '+dSquare?.decision?.toLowerCase()).replaceAll(/[ .!?]+$/g, '')+'?';

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

