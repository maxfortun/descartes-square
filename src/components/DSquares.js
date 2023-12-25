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

import { refetch } from './utils';
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
		dSquares,
		setDSquares,
		invites,
		setInvites,
		session,
		setSession
	} = useContext(AppContext);

	const [ ready, setReady ] = useState(false);
	const [ selectedDSquare, setSelectedDSquare ] = useState({});

	const debug = Debug('descartes-squares:DSquares:'+session.account.email);

	useEffect(() => {
		debug('mounted');
		fetchInvites({
			setInvites
		})
		.then(() => {
			setReady(true);
		});
	}, []);

	useEffect(() => {
		if(!ready) {
			return;
		}

		fetchDSquares({
			setDSquares
		});
	}, [ready]);

	useEffect(() => {
		if(!dSquares) {
			return;
		}
		dSquares.forEach((dSquare, i) => dSquare.position = i);
	}, [dSquares]);

	if(!dSquares) {
		return <Loader />;
	}

	const childProps = Object.assign({}, props, 
            			{
            				dSquares,
            				setDSquares,
            				selectedDSquare,
            				setSelectedDSquare
       					}
	);

	return	<Box sx={{ mt: '4px' }}>
				<Box>
					<DSTabs {...childProps} />
				</Box>
				<Box>
					{ null != selectedDSquare.id 
						? <DSquare {...childProps} />
						: <Loader />
					}
				</Box>
			</Box>;

}

