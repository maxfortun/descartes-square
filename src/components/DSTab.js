import Debug from 'debug';

import React, {
	useContext,
	useState
} from 'react';

import {
	Box,
	IconButton,
	InputAdornment,
	TextField,
	Tooltip
} from '@mui/material';

import {
	DeleteForever as DeleteForeverIcon,
	Download as DownloadIcon,
	Edit as EditIcon,
	IosShare as IosShareIcon
} from '@mui/icons-material';

import { AppContext } from './AppContext';
import { refetch } from './utils';

export default function (props) {
	const { decison, setDecision, session, setSession } = useContext(AppContext);
	const [ decisionChanged, setDecisionChanged ] = useState(false);

	const debug = Debug('descartes-squares:DSTab:'+session.account.email);

	const handleDecisionChange = (event) => {
		debug('handleDecisionChange', event.target.value);
		setDecision(event.target.value);
		props.selectedDSquare.decision = event.target.value;
		setDecisionChanged(true);
	};

	const updateDecision = async () => {
		if(!decisionChanged) {
			return;
		}

		debug('updateDecision', decision);
		const body = JSON.stringify({
			decision
		});
	
		const fetchOptions = {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-type': 'application/json'
			},
			body
		};
		
		return refetch(`/api/squares/${props.selectedDSquare.id}/decision`, fetchOptions)
		.then(response => response.json())
		.then(decision => {
			debug('updateDecision', decision);
			setDecisionChanged(false);
		}); 
				
	};	  

	const handleDecisionBlur = (event) => {
		debug('handleDecisionBlur');
		updateDecision();
	};


	const handleShareSquare = (event) => {
		debug('handleShareSquare');
	};

	const handleDeleteSquare = async (event) => {
		debug('deleteDSquare >', props.selectedDSquare.id);
		return refetch(`/api/squares/${props.selectedDSquare.id}`, { method: 'DELETE', credentials: 'include' })
		.then(response => response.json())
		.then(square => {
			debug('deleteDSquare <', square);
/*
			let nextDSquare = {};
			if(props.selectedDSquare.position) {
				nextDSquare = props.dSquares[props.selectedDSquare.position + 1] || props.dSquares[props.selectedDSquare.position - 1];
			}
			props.setSelectedDSquare(nextDSquare);
			props.setDSquares(props.dSquares.filter( _square => _square.id != id ));
*/
			return square;
		});
	};

	return <Box
		display='flex'
		justifyContent='center'
		alignItems='center'
	>
		<Box sx={{ margin: 'auto', flexGrow: 1 }} >
			<TextField
				label='Should I ...'
				size='small'
				fullWidth={true}
				inputProps={{ style: { textAlign: 'center' } }}
				value={decision}
				onChange={handleDecisionChange}
				onBlur={handleDecisionBlur}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<Tooltip placement="top-start" title="Share this sqaure">
								<IosShareIcon onClick={handleShareSquare} />
							</Tooltip>
							<Tooltip placement="top-start" title="Delete this square">
								<DeleteForeverIcon onClick={handleDeleteSquare} />
							</Tooltip>
						</InputAdornment>
					)
				}}
			/>
		</Box>
	</Box>;
}

