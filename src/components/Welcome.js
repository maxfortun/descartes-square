import Debug from 'debug';
import React, { useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";

import { Box, Button, Grid, FormControl, FormControlLabel, FormLabel, Icon, Paper, Radio, RadioGroup, Switch, Typography } from '@mui/material';

const debug = Debug('accounts:Welcome');

import { AppContext } from './AppContext';

export default function () {
	const { session, setSession } = useContext(AppContext);

	debug("Welcome");

	const handleClick = () => setSession(Object.assign({}, session, {login: true}));

	const markdown = `
Square away your uncertainty with Descartes Squares!  
Best decisions you'll ever make!  
You don't have to do it alone - invite others now!  
`;

	return (
		<>
			<ReactMarkdown linkTarget="_blank" children={markdown} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="Welcome" />
			<br/>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flexDirection="column"
			>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					<Button className="pulse" color="inherit" variant="contained" onClick={handleClick}>more</Button>
				</Typography>
			</Box>
		</>
	);
}

