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

export default function (props) {
	const { session, setSession } = useContext(AppContext);
	const { decision, setDecision } = useState(props.selectedDSquare.decision);

	const debug = Debug('descartes-squares:DSTab:'+session.account.email);

	const handleDecisionChange = (event) => {
		debug('handleDecisionChange', event.target.value);
	};

	const handleDecisionKeyDown = (event) => {
		debug('handleDecisionKeyDown');
	};

	const handleDecisionBlur = (event) => {
		debug('handleDecisionBlur');
	};

	const handleShareSquare = (event) => {
		debug('handleShareSquare');
	};

	const handleDeleteSquare = (event) => {
		debug('handleDeleteSquare');
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
				onKeyDown={handleDecisionKeyDown}
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

