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
	const self = Object.assign({}, props);

	const { session, setSession } = useContext(AppContext);
	const [ decision, setDecision ] = useState(self.dSquare.decision);

	const debug = Debug('descartes-squares:DSButton:'+session.account.email);
	const sx={ mr: '4px' };

	const theme = useTheme();

	if(self.dSquare.id == self.parent.parent.dSquare.id) {
		sx.color = theme.palette.secondary.main;
	}

	return <Button variant='outlined' sx={sx} 
		onClick={() => {
			self.parent.parent.setDSquare(self.dSquare);
			self.parent.setDecision = setDecision;
		}}
	>{decision}</Button>;
}

