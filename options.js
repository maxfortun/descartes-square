const debug = require('debug')('dsquares:options');

const _mongoose = require('mongoose');
_mongoose.set('strictQuery', true);

const MongooseJSProxy = require('@ezsso/mongoose-jsproxy');

require('dotenv').config({ path: '.env.local' });

const options = {
	'dsquares': {
		uri: process.env.DSQUARES_MONGODB,
		options: {
			useNewUrlParser: true
		},
		debug: true
	}
};

const connectPromises = {};
function mongoose(dbId) {
	const dbOptions = options[dbId];
	return async function() {
		if(connectPromises[dbId]) {
			// debug('Reusing connection', dbId);
			return connectPromises[dbId];
		}
		debug('Creating connection', dbId);

		this._mongoose = new _mongoose.Mongoose();
		if(dbOptions.debug) {
			this._mongoose.set('debug', dbOptions.debug);
		}

		return connectPromises[dbId] = this._mongoose.connect(dbOptions.uri, dbOptions.options);
	}
}

const dsquaresMongoose = mongoose('dsquares');
const dsquares	= new MongooseJSProxy({ mongoose: dsquaresMongoose, idField: 'id', options: { collection: 'dsquares' }});

module.exports = {
	dsquaresMongoose,
	dsquares,
	ezsso_oidc_auth_id: process.env.EZSSO_OIDC_AUTH_ID,
    ezsso_oidc_idp_id: process.env.EZSSO_OIDC_IDP_ID,
    ezsso_oidc_authorize_uri: process.env.EZSSO_OIDC_AUTHORIZE_URI,
    ezsso_oidc_redirect_uri: process.env.EZSSO_OIDC_REDIRECT_URI,
	ezsso_oidc_cookie_name: process.env.EZSSO_OIDC_COOKIE_NAME
};

