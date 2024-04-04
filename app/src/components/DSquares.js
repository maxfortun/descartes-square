import Debug from 'debug';
import React, {
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';

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
import {
	Add as AddIcon,
	ArrowForwardOutlined as ArrowForwardOutlinedIcon
} from '@mui/icons-material';

import { state as _s } from './utils';

import { 
	fetchDSquares,
	fetchInvites
} from './api';

import { AppContext } from './AppContext';
import Loader from './Loader';
import DSTabs from './DSTabs';
import DSquare from './DSquare';

export default function (props) {

	const {
		state, setState
	} = useContext(AppContext);

	const debug = Debug('dsquares:DSquares:'+state.account.email);

	const setStateSquaresFromShareDb = async () => {
		const squares = (await state.accountProxy).squares;
		if(!squares) {
			return;
		}
		const change = {
			squares: squares.map(square => ({ _id: square._id, decision: square.decision }))
		};
		setState(_s(change));
	};

	const handleAccountChange = async event => {
		if(event.path?.[0] != 'squares') {
			debug('handleAccountChange', 'ignoring nested event', event);
			return;
		}
	
		setStateSquaresFromShareDb();
	};

	useEffect(() => {
		debug('mounted');
		(async () => {
			state.accountProxy.__proxy__.on('change', handleAccountChange);
			setStateSquaresFromShareDb();
		})();
	}, []);

	return	<Box sx={{ mt: '4px' }}>
				<Box>
					<DSTabs />
				</Box>
				<Box
					display='flex'
					justifyContent='center' 
					sx={{ mt: '16px' }}
				>
					{ null != state.selectedSquare?.id 
						? <DSquare />
						: "No squares yet. Create one?"
					}
				</Box>
			</Box>;

}

