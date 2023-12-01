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

const self = {};
export default function (props) {
	const { session, setSession } = useContext(AppContext);
	const [ buttons, setButtons ] = useState([]);

	const debug = Debug('descartes-squares:DSButtons:'+session.account.email);

	useEffect(() => {
		debug('mounted', props);
	}, []);

	useEffect(() => {
		debug('updated', props);
		Object.assign(self, props);
	});

	useEffect(() => {
		if(!self.parent.ready) {
			return;
		}

		debug("Parent ready");
		self.parent.setDSButtons(self);
	}, [ self.parent?.ready ]);

	useEffect(() => {
		if(!self.parent.dSquares) {
			return;
		}

		debug("Rendering", self.parent.dSquares);
		const _buttons = self.parent.dSquares.map((dSquare, i) => <DSButton key={i} parent={self} dSquare={dSquare} />); 
	
		_buttons.push(
			<IconButton
				key={_buttons.length}
				size="large"
				edge="end"
				color="inherit"
				aria-label="Menu"
				onClick={() => self.parent.setDSquare({ id: '' })}
			>	   
				<AddIcon />
			</IconButton>
		);
		
		setButtons(_buttons);

	}, [ self.parent?.dSquares ]);

	useEffect(() => {
		if(!self.parent?.dSquare.id) {
			return;
		}
	
		debug('useEffect self.parent?.dSquare', self.parent?.dSquare.id);
		localStorage.dSquareId = self.parent?.dSquare.id;
	}, [self.parent?.dSquare.id]);

	useEffect(() => {
		if(!buttons.length) {
			return;
		}

		debug('useEffect buttons');

		if(localStorage.dSquareId && self.parent.dSquares.filter(square => square.id == localStorage.dSquareId).length > 0) {
			self.parent.setDSquare({ id: localStorage.dSquareId } );
		} else if(dSquares.length > 0) {
			self.parent.setDSquare({ id: dSquares[0].id });
		} else {
			self.parent.setDSquare({ id: '' });
		}

	}, [ buttons ]);
	return buttons;
}

