import Debug from 'debug';
import React, {
	useContext,
	useState,
	useEffect,
	useRef
} from 'react';

import {
	IconButton,
	Tooltip
} from '@mui/material';

import {
	Add as AddIcon,
	ArrowForwardOutlined as ArrowForwardOutlinedIcon
} from '@mui/icons-material';

import { AppContext } from './AppContext';
import DSButton from './DSButton';

export default function (props) {
	const self = Object.assign({}, props);

	self.parent.dSButtons = self;

	const { session, setSession } = useContext(AppContext);

	const debug = Debug('descartes-squares:DSButtons:'+session.account.email);

	const buttons = self.parent.dSquares.map((dSquare, i) => <DSButton key={i} parent={self} dSquare={dSquare} />); 
	
	buttons.push(
		<IconButton
			key={buttons.length}
			size="large"
			edge="end"
			color="inherit"
			aria-label="Menu"
			onClick={() => self.parent.setDSquare({ id: '' })}
		>	   
			<AddIcon />
		</IconButton>
	);
		

	return buttons;
}

