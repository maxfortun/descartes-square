import Debug from 'debug';

import React, {
	useContext,
	useEffect,
	useState
} from 'react';

import {
	Autocomplete,
	Box,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	InputAdornment,
	TextField,
	Tooltip
} from '@mui/material';

import {
	DeleteForever as DeleteForeverIcon,
	Download as DownloadIcon,
	Edit as EditIcon,
	HelpOutline as HelpOutlineIcon,
	IosShare as IosShareIcon
} from '@mui/icons-material';

import { AppContext } from './AppContext';
import { refetch } from './utils';
import {
	addAIConsiderations,
	updateDecision,
	invite
} from './api';

export default function (props) {
	const {
		selectedDSquare
	} = props;

	const {
		accounts,
		setAccounts,
		considerations,
		setConsiderations,
		decision,
		setDecision,
		session,
		setSession
	} = useContext(AppContext);

	const [ decisionChanged, setDecisionChanged ] = useState(false);
	const [ openShare, setOpenShare ] = useState(false);
	const [ accountsError, setAccountsError ] = useState(false);
	const [ accountsHelperText, setAccountsHelperText ] = useState(false);

	const debug = Debug('descartes-squares:DSTab:'+session.account.email);

	useEffect(() => {
		setDecision(selectedDSquare.decision);
	}, [selectedDSquare.decision]);


	const handleDecisionChange = (event) => {
		// debug('handleDecisionChange', event.target.value);
		setDecision(event.target.value);
		selectedDSquare.decision = event.target.value;
		setDecisionChanged(true);
	};

	const handleDecisionBlur = (event) => {
		// debug('handleDecisionBlur');
		updateDecision({
			selectedDSquare,
			decisionChanged,
			setDecisionChanged
		});
	};

	const handleDecisionKeyDown = async (event) => {
		// debug('handleDecisionKeyDown');
		if (event.key != 'Enter') {
			return;
		}
		if(!considerations) {
			return;
		}
		if(considerations.length) {
			return;
		}
		await updateDecision({
			selectedDSquare,
			decisionChanged,
			setDecisionChanged
		});
		addAIConsiderations({
			selectedDSquare,
			considerations,
			setConsiderations,
		});
	};

	const handleAIAssist = (event) => {
		debug('handleAIAssist');
		addAIConsiderations({
			selectedDSquare,
			considerations,
			setConsiderations,
		});
	};

	const handleShareSquare = (event) => {
		debug('handleShareSquare');
		setOpenShare(true);
	};

	const placeholders = [
		'get a cat?',
		'buy a car?',
		'look for a new job?'
	];
	const getRandomPlaceHolder = () => {
		const i = Math.floor(Math.random() * (placeholders.length - 1));
		return placeholders[i];
	};

	const handleDeleteSquare = async (event) => {
		debug('deleteDSquare >', selectedDSquare.id);
		return refetch(`/api/squares/${selectedDSquare.id}`, { method: 'DELETE', credentials: 'include' })
		.then(response => response.json())
		.then(square => {
			debug('deleteDSquare <', square);
			let nextDSquare = {};
			const positions = {};
			props.dSquares.forEach((dSquare, i) => positions[dSquare.id] = i);
			const position = positions[selectedDSquare.id];
			if(null != position) {
				nextDSquare = props.dSquares[position + 1] || props.dSquares[position - 1];
			}
			if(nextDSquare) {
				props.setSelectedDSquare(nextDSquare);
			}
			props.setDSquares(props.dSquares.filter( _square => _square.id != selectedDSquare.id ));
			return square;
		});
	};

	const handleCloseShare = async (event) => {
		setOpenShare(false);
	};

	const validEmail = (email) => {
		return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
	};

	const handleAccountsTextKeyDown = async (event) => {
		if(!validEmail(event.target.value)) {
			setAccountsHelperText('Format: username@hostname.tld');
			if(event.key === 'Enter') {
				event.stopPropagation();
				setAccountsError(true);
			}
			return;
		}
		
		if(accounts?.includes(event.target.value)) {
			setAccountsHelperText('Account already has access');
			if(event.key === 'Enter') {
				event.stopPropagation();
				setAccountsError(true);
			}
			return;
		}

		setAccountsError(false);
	};

	const handleAccountsChange = async (event, options, reason, detail) => {
		debug('handleAccountsChange', detail.option);
		if(!validEmail(detail.option)) {
			setAccountsError(true);
			return;
		}
		setAccountsError(false);
		setAccountsHelperText(null);
		await invite({
			selectedDSquare,
			email: detail.option,
			setAccounts
		});
	};

	const accountsElements = accounts?.filter(account => account.email != session.account.email)
						.map((account, i) => {
                        const label = <Box key={i} account={account}>
                            {account}
                        </Box>;
                        return label;
                    });
    
	const aiAssist = considerations && considerations.length == 0 && <Tooltip placement="top-start" title="AI Assist">
						<HelpOutlineIcon onClick={handleAIAssist} />
					</Tooltip>;

	return <Box sx={{ mt: '8px', flexGrow: 1 }} >
			<Dialog open={openShare} onClose={handleCloseShare}>
				<DialogTitle>Sharing as {session.account.email}</DialogTitle>
				<DialogContent>
					<Autocomplete
						clearIcon={false}
						options={[]}
						multiple
						freeSolo
						value={ accountsElements }
						renderInput={params => <TextField 
													sx={{ mt: '16px' }} 
													label='Emails' 
													{...params} 
													onKeyDown={handleAccountsTextKeyDown}
													error={accountsError} 
													helperText={accountsHelperText}
						/>}
						onChange={ handleAccountsChange }
					/>
				</DialogContent>
			</Dialog>
			<TextField
				disabled={ considerations==null || considerations.length > 0 }
				label='Should I ...'
				size='small'
				fullWidth={true}
				inputProps={{ style: { textAlign: 'center' } }}
				value={decision}
				placeholder={getRandomPlaceHolder()}
				onChange={handleDecisionChange}
				onBlur={handleDecisionBlur}
				onKeyDown={handleDecisionKeyDown}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							{aiAssist}
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
	</Box>;
}

