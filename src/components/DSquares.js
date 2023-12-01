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

import { refetch } from './utils';

import { AppContext } from './AppContext';
import Loader from './Loader';
import DSButtons from './DSButtons';
import DSquare from './DSquare';

export default function (props) {
	const { session, setSession } = useContext(AppContext);
	const [ dSquares, setDSquares ] = useState(null);
	const [ dSquare, setDSquare ] = useState({});

	const debug = Debug('descartes-squares:DSquares:'+session.account.email);

	debug("DSquares", props);

	const fetchDSquares = async () => {
		debug('fetchDSquares');
		return refetch('/api/squares', { credentials: 'include' })
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
			fetchDSquares();
			return;
		} 
	});

	useEffect(() => {
		if(!dSquare.id) {
			return;
		}

		debug('useEffect dSquare', dSquare.id);
		localStorage.dSquareId = dSquare.id;
	}, [dSquare.id]);

	useEffect(() => {
		if(!dSquares) {
			return;
		}

		debug('useEffect dSquares');
		if(localStorage.dSquareId && dSquares.filter(square => square.id == localStorage.dSquareId).length > 0) {
			setDSquare({ id: localStorage.dSquareId } );
		} else if(dSquares.length > 0) {
			setDSquare({ id: dSquares[0].id });
		} else {
			setDSquare({ id: '' });
		}

	}, [dSquares]);

	if(!dSquares) {
		return <Loader />;
	}

	return	<Box sx={{ mt: '4px' }}>
				<Box>
					<DSButtons dSquares={dSquares} setDSquares={setDSquares} dSquare={dSquare} setDSquare={setDSquare} />
				</Box>
				<Box>
					{ null != dSquare.id 
						? <DSquare dSquares={dSquares} setDSquares={setDSquares} dSquare={dSquare} />
						: <Loader />
					}
				</Box>
			</Box>;

}

