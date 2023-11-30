import Debug from 'debug';
import React, { useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";

import {
	Box,
	Button,
	Divider,
	Grid,
	FormControl,
	FormControlLabel,
	FormLabel,
	Icon,
	Paper,
	Radio,
	RadioGroup,
	Switch,
	Typography
} from '@mui/material';

const debug = Debug('accounts:Welcome');

import { AppContext } from './AppContext';

export default function () {
	const { session, setSession } = useContext(AppContext);

	debug("Welcome");

	const handleLoginClick = () => setSession(Object.assign({}, session, {login: true}));

	return (
		<>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				sx={{ mt: '24px' }}
			>
				<Box>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Best decision you'll ever make.
					</Typography>
				</Box>
				<Box sx={{ ml: '24px' }}>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						<Button className="pulse" color="inherit" variant="contained" onClick={handleLoginClick}>more</Button>
					</Typography>
				</Box>
			</Box>
			<Box sx={{ mt: '24px', mb: '8px' }}><Divider/></Box>
			<Box>
				<Typography>
				</Typography>
			</Box>
		</>
	);
}

