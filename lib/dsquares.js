const debug = require('debug')('dsquares:lib:dsquares');

const crypto = require('crypto');

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
	listSquares,
	createSquare,
	createConcern,
	updateConcern
};
