import Debug from 'debug';
import React, {
	useContext,
	useState,
	useEffect,
	useRef
} from 'react';

import {
	Button,
	Tooltip
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import { AppContext } from './AppContext';

export default function (props) {
	const { session, setSession } = useContext(AppContext);
	const [ decision, setDecision ] = useState(props.dSquare.decision);

	const debug = Debug('descartes-dSquares:DSButton:'+session.account.email);
	const sx={ mr: '4px' };

	const theme = useTheme();

	if(props.dSquare.id == props.selectedDSquare.id) {
		sx.color = theme.palette.secondary.main;
	}

	return <Button variant='outlined' sx={sx} 
		onClick={() => props.setDSquare(Object.assign({ setDecision }, props.dSquare))}
	>{decision}</Button>;
}

