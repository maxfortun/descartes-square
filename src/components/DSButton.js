import Debug from 'debug';
import React, { useContext, useState, useEffect, useRef } from 'react';

import {
	Button,
	Tooltip
} from '@mui/material';

import { AppContext } from './AppContext';

export default function (props) {
	const { session, setSession } = useContext(AppContext);
	const [ decision, setDecision ] = useState(props.dSquare.decision);

	const debug = Debug('descartes-dSquares:DSButton:'+session.account.email);

	return <Button variant='outlined' sx={{ mr: '4px' }} 
		onClick={() => props.setDSquare(Object.assign({ setDecision }, props.dSquare))}
	>{decision}</Button>;
}

