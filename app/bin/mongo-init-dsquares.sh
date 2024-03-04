#!/bin/bash -e

SWD=$( cd $(dirname $0) ; pwd )

. $DPSRV_HOME/rc/bin/dpsrv.sh
. $EZSSO_HOME/rc/secrets/ezsso-admin/.env.local
. $SWD/../../secrets/.env.local

app_db=${EZSSO_ADMIN_MONGODB##*/}

script=/tmp/$(basename $0).$$
cat > $script <<_EOT_

db.invites.createIndex( { square_id: 1, invited: 1 }, { unique: true } );

db.authN.deleteMany( { id: '$EZSSO_OIDC_AUTH_ID' } );

db.authN.insertOne({
	id: '$EZSSO_OIDC_AUTH_ID',
	accounts: [
		'max@maxf.net'
	],
	password: '$EZSSO_OIDC_AUTH_PASSWORD',
	status: 'available',
	cookie_name: 'ezsso_sid',
	cache_session: true,
	appinfo_endpoints: [ 'https://descartes-squares.com/api/appinfo' ],
	idps: [
		{
			id: 'google',
			issuer: '$(jq -r .issuer $EZSSO_HOME/rc/secrets/ezsso-admin/google-oidc-client.json)',
			client_id: '$(jq -r .client_id $EZSSO_HOME/rc/secrets/ezsso-admin/google-oidc-client.json)',
			client_secret: '$(jq -r .client_secret $EZSSO_HOME/rc/secrets/ezsso-admin/google-oidc-client.json)',
		}
	]
});

db.authZ.deleteMany({ authN: '$EZSSO_OIDC_AUTH_ID' });

db.authZ.insertMany([
	{
		authN: '$EZSSO_OIDC_AUTH_ID',
		id: UUID().toString('hex').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/).slice(1,6).join('-'),
		rules: [ 
			{
				engine: 'jmespathts',
				expr: 'req.url.pathname == \`/api/redirect\`'
			}
		]
	},
	{
		authN: '$EZSSO_OIDC_AUTH_ID',
		id: UUID().toString('hex').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/).slice(1,6).join('-'),
		rules: [ 
			{
				engine: 'jmespathts',
				expr: 'req.url.pathname == \`/api/session\`'
			}
		]
	},
	{
		authN: '$EZSSO_OIDC_AUTH_ID',
		id: UUID().toString('hex').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/).slice(1,6).join('-'),
		rules: [ 
			{
				engine: 'jmespathts',
				expr: 'req.url.pathname == \`/api/logout\`'
			}
		]
	},
	{
		authN: '$EZSSO_OIDC_AUTH_ID',
		id: UUID().toString('hex').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/).slice(1,6).join('-'),
		rules: [ 
			{
				engine: 'jmespathts',
				expr: 'req.url.pathname == \`/api/appinfo\`'
			}
		]
	},
	{
		authN: '$EZSSO_OIDC_AUTH_ID',
		id: UUID().toString('hex').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/).slice(1,6).join('-'),
		rules: [ 
			{
				engine: 'jmespathts',
				expr: 'req.url.pathname == \`/api/invites\`'
			}
		]
	},
	{
		authN: '$EZSSO_OIDC_AUTH_ID',
		id: UUID().toString('hex').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/).slice(1,6).join('-'),
		rules: [ 
			{
				engine: 'jmespathts',
				expr: 'req.url.pathname == \`/api/squares\`'
			}
		]
	},
	{
		authN: '$EZSSO_OIDC_AUTH_ID',
		id: UUID().toString('hex').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/).slice(1,6).join('-'),
		rules: [ 
			{
				engine: 'jmespathts',
				expr: 'starts_with(req.url.pathname, \`/api/squares\`)'
			},
			{
				engine: 'jmespathts',
				expr: 'app.squares[? @ == $.req.url.pathsegs[2] ]'
			}
		]
	},
	{
		authN: '$EZSSO_OIDC_AUTH_ID',
		id: UUID().toString('hex').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/).slice(1,6).join('-'),
		rules: [ 
			{
				engine: 'jmespathts',
				expr: 'starts_with(req.url.pathname, \`/api/ai\`)'
			},
			{
				engine: 'jmespathts',
				expr: 'app.squares[? @ == $.req.url.pathsegs[3] ]'
			}
		]
	},
	{
		authN: '$EZSSO_OIDC_AUTH_ID',
		id: UUID().toString('hex').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/).slice(1,6).join('-'),
		priority: 5,
		access: 'deny',
		rules: [ 
			{
				engine: 'jmespathts',
				expr: 'req.method == \`POST\`'
			},
			{
				engine: 'jmespathts',
				expr: 'req.url.pathname == \`/api/squares\`'
			},
			{
				engine: 'jmespathts',
				expr: 'app.squares | length(@) >= $.app.limits.squares'
			}
		]
	}
]);

_EOT_

container=$(dpsrv-list | grep ' dpsrv-mongo-' | awk '{ print $3 }')
docker exec -i $container mongosh "$EZSSO_ADMIN_MONGODB" --quiet < $script

rm $script
