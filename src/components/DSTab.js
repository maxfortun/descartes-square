import Debug from 'debug';

import React, {
	useContext
} from 'react';

import {
	Box,
	Tab,
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

	const debug = Debug('descartes-squares:DSTab:'+session.account.email);

	const label = <Box
		display='flex'
		justifyContent='center'
		alignItems='center'
	>
		{props.dSquare.decision}
		{ props.dSquare.id && props.dSquare.id == props.selectedDSquare.id &&
			<Box>
				<EditIcon />
				<IosShareIcon />
				<DeleteForeverIcon />
			</Box>
		}
	</Box>;
	return <Tab id={props.id} label={label} />;
}

