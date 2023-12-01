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
	const { session, setSession } = useContext(AppContext);
	const [ buttons, setButtons ] = useState([]);

	const debug = Debug('descartes-squares:DSButtons:'+session.account.email);

	useEffect(() => {
		debug('mounted', props);
	}, []);

	useEffect(() => {
		if(!props.dSquares) {
			return;
		}

		debug("Rendering", props.dSquares);
		const _buttons = props.dSquares.map((dSquare, i) => <DSButton key={i} {...props} id={'dsbutton:'+dSquare.id} dSquare={dSquare} />); 
	
		_buttons.push(
			<IconButton
				key={_buttons.length}
				size="large"
				edge="end"
				color="inherit"
				aria-label="Menu"
				onClick={() => props.setSelectedDSquare({ id: '' })}
			>	   
				<AddIcon />
			</IconButton>
		);
		
		setButtons(_buttons);

	}, [ props.dSquares ]);

	useEffect(() => {
		if(!buttons.length) {
			return;
		}

		debug('useEffect buttons');

		if(localStorage.dSquareId && props.dSquares.filter(square => square.id == localStorage.dSquareId).length > 0) {
			const button = document.getElementById('dsbutton:'+localStorage.dSquareId);
			button.click();
		} else if(props.dSquares.length > 0) {
			const button = document.getElementById('dsbutton:'+props.dSquares[0].id);
			button.click();
		} else {
			props.setSelectedDSquare({ id: '' });
		}

	}, [ buttons ]);
	return buttons;
}

