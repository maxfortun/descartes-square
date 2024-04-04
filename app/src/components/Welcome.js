import Debug from 'debug';
import React, { useState, useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw';

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
	Table, TableContainer, TableCell, TableRow, TableHead, TableBody,
	Typography
} from '@mui/material';

const debug = Debug('dsquares:Welcome');

import { state as _s } from './utils';
import { AppContext } from './AppContext';

export default function () {
	const {
		state, setState
	} = useContext(AppContext);

	useEffect(() => {
		debug('mounted');
	}, []);

	const handleLoginClick = () => setState(_s({should_login: true}));

	const border = '1px solid rgba(224, 224, 224, 1)';
	return (
		<>
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				sx={{ mt: '24px', mb: '8px' }}
			>
				<TableContainer component={Paper} >
					<Table sx={{ height: '100px' }}>
						<TableBody>
							<TableRow>
								<TableCell style={{ width: '50%', height: '50%', borderRight: border, textAlign: 'center' }}>
									What <Typography display='inline' sx={{ color: 'green' }}>will</Typography> happen if I <Typography display='inline' sx={{ color: 'green' }}>do</Typography> this?
								</TableCell>
								<TableCell style={{ textAlign: 'center' }}>
									What <Typography display='inline' sx={{ color: 'green' }}>will</Typography> happen if I <Typography display='inline' sx={{ color: 'red' }}>do not</Typography> do this?
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell style={{ width: '50%', height: '50%', borderRight: border, textAlign: 'center' }}>
									What <Typography display='inline' sx={{ color: 'red' }}>will not</Typography> happen if I <Typography display='inline' sx={{ color: 'green' }}>do</Typography> this?
								</TableCell>
								<TableCell style={{ textAlign: 'center' }}>
									What <Typography display='inline' sx={{ color: 'red' }}>will not</Typography> happen if I <Typography display='inline' sx={{ color: 'red' }}>do not</Typography> do this?
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<Box>
				<Typography>
A Descartes' Square is a decision making technique, invention of which is attributed to <Link href="https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes">René Descartes</Link>, a French philosopher, scientist, and mathematician, widely considered a seminal figure in the emergence of modern philosophy and science. It is an enhanced approach to its more familiar relative <Link href="https://en.wikipedia.org/wiki/Decisional_balance_sheet">Pros/Cons list</Link>. Instead of creating two lists of advantages and disadvantages of a decision, a two by two grid is created and each resulting quadrant is populated accordingly. A completed Descartes` Square provides a deeper insight into the consequences of a decision. This tools aims to take the Descartes` Square technique further, by allowing sharing and collaborating on a decision across multiple contributors. It just may be the best decision you'll ever make.
				</Typography>
			</Box>
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<Button variant="outlined" onClick={handleLoginClick}>Try it.</Button>
			</Box>
		</>
	);
}

