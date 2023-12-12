import Debug from 'debug';
import React, { useState, useContext, useEffect } from 'react';
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
	Link,
	Paper,
	Radio,
	RadioGroup,
	Switch,
	Typography
} from '@mui/material';

const debug = Debug('descartes-squares:Welcome');

import { AppContext } from './AppContext';

export default function () {
	const { session, setSession } = useContext(AppContext);

	useEffect(() => {
		debug('mounted');
	}, []);

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
A Descartes' Square is a decision making technique, invention of which is attributed to <Link href="https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes">René Descartes</Link>, a French philosopher, scientist, and mathematician, widely considered a seminal figure in the emergence of modern philosophy and science. It is an enhanced approach to its more familiar relative <Link href="https://en.wikipedia.org/wiki/Decisional_balance_sheet">Pros/Cons lists</Link>. Instead of creating two lists of advantages and disadvantages of a decision, a two by two grid is created and each resulting quadrant is populated accordingly:
				</Typography>
			</Box>
		</>
	);
}

