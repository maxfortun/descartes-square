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

export default function DSquares(props) {
	const self = Object.assign({}, props);

	const { session, setSession } = useContext(AppContext);
	const [ ready, setReady ] = useState(false);
	const [ dSButtons, setDSButtons ] = useState(null);
	const [ dSquares, setDSquares ] = useState(null);
	const [ dSquare, setDSquare ] = useState({});

	Object.assign(self, { ready, dSButtons, setDSButtons, dSquares, setDSquares, dSquare, setDSquare });

	const debug = Debug('descartes-squares:DSquares:'+session.account.email);
	debug(self);

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

	useEffect(() => {
		debug('mounted');
		setReady(true);
		fetchDSquares();
	}, []);

	useEffect(() => {
		if(!dSquare.id) {
			return;
		}

		debug('useEffect dSquare', dSquare.id);
		localStorage.dSquareId = dSquare.id;
	}, [dSquare.id]);

	useEffect(() => {
		if(!dSButtons) {
			return;
		}

		debug('useEffect self.dSButtons');
		if(localStorage.dSquareId && dSquares.filter(square => square.id == localStorage.dSquareId).length > 0) {
			setDSquare({ id: localStorage.dSquareId } );
		} else if(dSquares.length > 0) {
			setDSquare({ id: dSquares[0].id });
		} else {
			setDSquare({ id: '' });
		}

	}, [dSButtons]);


	if(!dSquares) {
		return <Loader />;
	}

	return	<Box sx={{ mt: '4px' }}>
				<Box>
					<DSButtons parent={self} />
				</Box>
				<Box>
					{ null != dSquare.id 
						? <DSquare parent={self} />
						: <Loader />
					}
				</Box>
			</Box>;

}

