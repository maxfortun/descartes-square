import Debug from 'debug';

import React, {
	useContext
} from 'react';

import {
	Box,
	IconButton,
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

	return <Box
		display='flex'
		justifyContent='center'
		alignItems='center'
	>
		{props.dSquare.decision}
		<Box>
			<IconButton
				size="small"
			>
				<Tooltip placement="top-start" title="Edit">
					<EditIcon />
				</Tooltip>
			</IconButton>

			<IconButton
				size="small"
			>
				<Tooltip placement="top-start" title="Share">
					<IosShareIcon />
				</Tooltip>
			</IconButton>

			<IconButton
				size="small"
			>
				<Tooltip placement="top-start" title="Share">
					<DeleteForeverIcon />
				</Tooltip>
			</IconButton>
		</Box>
	</Box>;
}

