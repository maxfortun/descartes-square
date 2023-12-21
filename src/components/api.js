import Debug from 'debug';

import { refetch } from './utils';

const debug = Debug('descartes-squares:api');

const fetchDSquare = async (props) => {
	const {
		selectedDSquare,
		setConsiderations,
		setAccounts
	} = props;

	debug('fetchDSquare >', selectedDSquare.id);
	return refetch(`/api/squares/${selectedDSquare.id}`, { credentials: 'include' })
	.then(response => response.json())
	.then(square => {
		debug('fetchDSquare <', square);
		localStorage.dSquareId = square.id;
		setConsiderations(square.considerations);
		setAccounts(square.accounts);
		return square;
	});
};

const createConsideration = async (props) => {
	const {
		cause,
		effect,
		desc,
		selectedDSquare,
		setConsiderations
	} = props;

	debug('createConsideration', cause, effect, desc);
	const body = JSON.stringify({
		cause,
		effect,
		desc
	});

	const fetchOptions = {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-type': 'application/json'
		},
		body
	};

	return refetch(`/api/squares/${selectedDSquare.id}/considerations`, fetchOptions)
	.then(response => response.json())
	.then(consideration => {
		debug('createConsideration', consideration);
		setConsiderations(prev => {
			if(!prev) {
				prev = [];
			}
			return prev.concat([consideration]);
		});
		return consideration;
	});
};

const addAIConsiderations = async (props) => {
	const {
		selectedDSquare,
		setConsiderations,
	} = props;

	debug('addAIConsiderations >');
	setConsiderations(null);
	await refetch(`/api/ai/vertex/${selectedDSquare.id}`, { credentials: 'include' })
	.then(response => response.json())
	.then(async questions => {
		debug('addAIConsiderations <', questions);
		return Promise.all(questions.questions.map(async question => {
			let cause = null;
			let effect = null;
			if(question.question.match(/will not happen/i)) {
				effect = 'will not';
			} else {
				effect = 'will';
			}
			if(question.question.match(/if I do not/i)) {
				cause = 'do not';
			} else {
				cause = 'do';
			}

			return Promise.all(question.answers.map(async answer => {
				debug('addAIConsiderations <<', question.question, cause, effect, answer.answer );
				return createConsideration({
					cause,
					effect,
					desc: answer.answer,
					selectedDSquare,
					setConsiderations
				});
			}));
		}));
	});
};

const deleteConsideration = async (props) => {
	const {
		selectedDSquare,
		considerationId,
		setConsiderations
	} = props;

	debug('deleteConsideration', considerationId);
	const fetchOptions = {
		method: 'DELETE',
		credentials: 'include',
		headers: {
			'Content-type': 'application/json'
		}
	};

	return refetch(`/api/squares/${selectedDSquare.id}/considerations/${considerationId}`, fetchOptions)
	.then(response => response.json())
	.then(consideration => {
		debug('deleteConsideration', consideration);
		setConsiderations(prev => prev.filter(_consideration => _consideration.id != consideration.id));
		return consideration;
	});
};

const logout = async () => {
	debug('logout >');
	return refetch(`/api/logout`, { credentials: 'include' })
	.then(response => response.json())
	.then(data => {
		debug('logout <', data);
	})
	.catch(e => {
		debug('logout !', e);
	});
};

const updateDecision = async (props) => {
	const {
		selectedDSquare,
		decisionChanged,
		setDecisionChanged
	} = props;

	if(!decisionChanged) {
		return;
	}

	const { decision } = selectedDSquare;

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
		
	return refetch(`/api/squares/${selectedDSquare.id}/decision`, fetchOptions)
	.then(response => response.json())
	.then(decision => {
		debug('updateDecision', decision);
		setDecisionChanged(false);
	}); 
};				  

const invite = async (props) => {
	const {
		selectedDSquare,
		email,
		setAccounts
	} = props;
	debug('invite', selectedDSquare, email);

	const body = JSON.stringify({
		email
	});
	
	const fetchOptions = {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-type': 'application/json'
		},
		body 
	};
		
	return refetch(`/api/squares/${selectedDSquare.id}/invite`, fetchOptions)
	.then(response => response.json())
	.then(account => {
		debug('invite', account);
		if(account.email) {
			setAccounts(prev => prev.push(account.email));
		}
	}); 
}

module.exports = {
	fetchDSquare,
	createConsideration,
	deleteConsideration,
	addAIConsiderations,
	logout,
	updateDecision,
	invite
};
