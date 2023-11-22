const debug = require('debug')('dsquares:lib:dsquares');

const crypto = require('crypto');

const { atob, btoa } = require('./utils');

async function account(req, res, next) {
	const { options } = req.app.settings;
	let signature = null;
	try {
		const [ head, payload, sig ] = req.oidc.access_token.split('.');
		const decoded_head = JSON.parse(atob(head));
		// debug('decoded_head.typ', decoded_head.typ);
		if(decoded_head.typ == 'JWT') {
			req.oidc.decoded_access_token = JSON.parse(atob(payload));
			signature = sig;
		} else {
			signature = req.oidc.access_token;
		}
	} catch(e) {
		debug(req.id, "Could not decode access token", req.oidc.access_token, e);
		signature = req.oidc.access_token;
	}

	try {
		req.oidc.decoded_id_token = JSON.parse(atob(req.oidc.id_token.split('.')[1]));
	} catch(e) {
		debug(req.id, "Could not decode id token", req.oidc.id_token);
	}

	try {
		req.oidc.decoded_user_info = JSON.parse(atob(req.oidc.user_info));
	} catch(e) {
		debug(req.id, "Could not decode user info", req.oidc.user_info);
	}

	// debug(req.id, "getOrCreate", req.oidc);
	const email = getClaim(req.oidc, 'email');

	// req.account = await options.accounts[email];
	// debug(req.id, "account", email, req.account);

	if(req.account) {
		return next();
	}

	req.account = Object.assign({}, {
		email,
		name:			getClaim(req.oidc, 'name'),
		given_name:		getClaim(req.oidc, 'given_name'),
		family_name:	getClaim(req.oidc, 'family_name'),
		picture:		getClaim(req.oidc, 'picture')
	});

	// options.accounts[email] = req.account;
	// await options.accounts[email];

	return next();
}

function getClaim(oidc, key) {
	const types = [ "decoded_user_info", "decoded_id_token", "decoded_access_token" ];
	for(let i = 0; i < types.length; i++) {
		let type = types[i];
		try {
			const value = oidc[type][key];
			if(value) {
				return value;
			}
		} catch(e) {}
	}
	return null;
}
	
async function listSquares(req) {
	const { options } = req.app.settings;
	const email = getClaim(req.oidc, 'email');
	const mongoose = await options.dsquaresMongoose();

	const dsquares = [];

	const dsquaresCursor = await mongoose.connection.collection('dsquares').find({ accounts: email }, { projection: { _id: 0 } });
	for await (const dsquare of dsquaresCursor) {
		dsquares.push(dsquare);	
	}

	debug(req.id, "listSquares", dsquares);

	return dsquares;
}

async function canCreateSquare(req, res, next) {
	next();
}

async function createSquare(req) {
	const { options } = req.app.settings;
	
	const dsquares = {
		id: crypto.randomUUID(),
		accounts: [ req.account.id ],
		concerns: []
	};

	debug(req.id, "dsquares", dsquares);

	options.dsquares[dsquares.id] = dsquares;
	return await options.dsquares[dsquares.id];
}

async function deleteSquare(req) {
	const { options } = req.app.settings;
	
	delete options.dsquares[req.params.square];
	return await options.dsquares[dsquares.id];
}

async function createConcern(req) {
	const { options } = req.app.settings;

	const concern = { 
		id: crypto.randomUUID(),
		account: getClaim(req.oidc, 'email'),
		cause: req.body.cause,
		effect: req.body.effect,
		desc: req.body.body
	};

	debug(req.id, 'createConcern', concern);

	const mongoose = await options.dsquaresMongoose();

	const result = await mongoose.connection.collection('dsquares').findOneAndUpdate(
									{ id: req.params.square },
									{ $push: { concerns: concern }}
					);
	debug(req.id, 'createConcern result', result);
	
	return concern;
}

async function updateConcern(req) {
	const { options } = req.app.settings;

	const concern = { 
		id: req.body.id,
		account: getClaim(req.oidc, 'email'),
		cause: req.body.cause,
		effect: req.body.effect,
		desc: req.body.body
	};

	debug(req.id, 'updateConcern', concern);

	const mongoose = await options.dsquaresMongoose();

	const result = await mongoose.connection.collection('dsquares').findOneAndUpdate(
																{ id: req.params.square },
																{ $set: { 'concerns.$[i]': concern } },
																{ arrayFilters: [ { 'i.id': req.params.concern } ] }
	);
	
	debug(req.id, 'updateConcern result', result);

	return concern;
}
	
module.exports = {
	account,
	listSquares,
	createSquare,
	createConcern,
	updateConcern
};
