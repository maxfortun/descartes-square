import Debug from 'debug';

import { refetch } from './utils';

const debug = Debug('dsquares:api');

const fetchDSquares = async (props) => {
	const {
		setSquares
	} = props;

	debug('fetchDSquares');
	return refetch('/api/squares', { credentials: 'include' })
		.then(response => response.json())
		.then(squares => {
			debug('fetchDSquares', squares);
			setSquares(squares);
			return squares;
		});
};

const fetchInvites = async (props) => {
	const {
		setInvites
	} = props;

	debug('fetchInvites');
	return refetch('/api/invites', { credentials: 'include' })
		.then(response => response.json())
		.then(invites => {
			debug('fetchInvites', invites);
			setInvites(invites);
			return invites;
		});
};

const fetchDSquare = async (props) => {
	const {
		selectedSquare,
		setSelectedConsiderations,
		setSelectedMembers,
		setSelectedInvites,
	} = props;

	debug('fetchDSquare >', selectedSquare._id);
	return refetch(`/api/squares/${selectedSquare._id}`, { credentials: 'include' })
	.then(response => response.json())
	.then(square => {
		debug('fetchDSquare <', square);
		localStorage.dSquareId = square.id;
		setSelectedConsiderations(square.considerations);
		setSelectedMembers(square.members);
		setSelectedInvites(square.invites);
		return square;
	});
};

const createDSquare = async (props) => {
	const {
		state, setState
	} = props;

	debug('createDSquare >');
	return refetch(`/api/squares`, { method: 'POST', credentials: 'include' })
	.then(async response => {
		if(response.status < 400) {
			return response.json();
		}
		throw await response.json();
	})
	.then(square => {
		debug('createDSquare <', square);
		localStorage.dSquareId = square.id;
		setSquares( prev => prev.concat([square]) );
		setSelectedConsiderations(null);
		setSelectedSquare(square);
	})
	.catch(e => {
		debug('createDSquare !', e);
		setError(e.error+'. '+(e.detail?.description || ''));
	});
};

const createConsideration = async (props) => {
	const {
		cause,
		effect,
		desc,
		selectedSquare,
		setSelectedConsiderations
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

	return refetch(`/api/squares/${selectedSquare._id}/considerations`, fetchOptions)
	.then(response => response.json())
	.then(consideration => {
		debug('createConsideration', consideration);
		setSelectedConsiderations(prev => {
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
		selectedSquare,
		setSelectedConsiderations,
	} = props;

	debug('addAIConsiderations >');
	setSelectedConsiderations(null);
	await refetch(`/api/ai/vertex/${selectedSquare._id}`, { credentials: 'include' })
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
					selectedSquare,
					setSelectedConsiderations
				});
			}));
		}));
	});
};

const deleteConsideration = async (props) => {
	const {
		selectedSquare,
		considerationId,
		setSelectedConsiderations
	} = props;

	debug('deleteConsideration', considerationId);
	const fetchOptions = {
		method: 'DELETE',
		credentials: 'include',
		headers: {
			'Content-type': 'application/json'
		}
	};

	return refetch(`/api/squares/${selectedSquare._id}/considerations/${considerationId}`, fetchOptions)
	.then(response => response.json())
	.then(consideration => {
		debug('deleteConsideration', consideration);
		setSelectedConsiderations(prev => prev.filter(_consideration => _consideration.id != consideration.id));
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
		selectedSquare,
		decisionChanged,
		setDecisionChanged
	} = props;

	if(!decisionChanged) {
		return;
	}

	const { decision } = selectedSquare;

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
		
	return refetch(`/api/squares/${selectedSquare._id}/decision`, fetchOptions)
	.then(response => response.json())
	.then(decision => {
		debug('updateDecision', decision);
		setDecisionChanged(false);
	}); 
};				  

const inviteMember = async (props) => {
	const {
		selectedSquare,
		email,
		setSelectedInvites,
	} = props;
	debug('inviteMember', selectedSquare, email);

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
		
	return refetch(`/api/squares/${selectedSquare._id}/members/invite`, fetchOptions)
	.then(response => response.json())
	.then(invited => {
		debug('inviteMember', invited);
		if(invited.email) {
			setSelectedInvites(prev => prev.concat([{ invited: invited.email }]));
		}
	}); 
}

const removeMember = async (props) => {
	const {
		selectedSquare,
		email,
		setSelectedInvites,
		setSelectedMembers
	} = props;
	debug('removeMember', selectedSquare, email);

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
		
	return refetch(`/api/squares/${selectedSquare._id}/members/remove`, fetchOptions)
	.then(response => response.json())
	.then(invited => {
		debug('removeMember', invited);
		if(invited.email) {
			setSelectedInvites(prev => prev.concat([invited.email]));
		}
	}); 
}

module.exports = {
	fetchDSquares,
	createDSquare,
	fetchDSquare,
	createConsideration,
	deleteConsideration,
	addAIConsiderations,
	logout,
	updateDecision,
	inviteMember,
	removeMember,
	fetchInvites
};
