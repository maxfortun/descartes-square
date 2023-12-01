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

	const debug = Debug('descartes-squares:DSButtons:'+session.account.email);

	useEffect(() => {
		if(props.selectedDSquare.id !== undefined) {
			return;
		}

		if(localStorage.dSquareId && props.dSquares.filter(square => square.id == localStorage.dSquareId).length > 0) {
			const button = document.getElementById('dsbutton:'+localStorage.dSquareId);
			if(button) {
				button.click();
				return;
			}
		}

		if(props.dSquares.length > 0) {
			const button = document.getElementById('dsbutton:'+props.dSquares[0].id);
			if(button) {
				button.click();
				return;
			}
		}

		props.setSelectedDSquare({ id: '' });
	}, [props.selectedDSquare.id]);


	if(!props.dSquares) {
		return;
	}

	debug("Rendering", props.dSquares);
	const buttons = props.dSquares.map((dSquare, i) => <DSButton key={i} {...props} id={'dsbutton:'+dSquare.id} dSquare={dSquare} />); 
	
	buttons.push(
		<IconButton
			key={buttons.length}
			size="large"
			edge="end"
			color="inherit"
			aria-label="Menu"
			onClick={() => props.setSelectedDSquare({ id: '' })}
		>	   
			<AddIcon />
		</IconButton>
	);
	return buttons;
}

