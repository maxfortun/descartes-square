#!/opt/local/bin/bash -e

SWD=$( cd $(dirname $0) ; pwd )

. $EZSSO_HOME/rc/secrets/accounts-app/.env.local
. $SWD/../secrets/.env.local

app_db=${ACCOUNTS_MONGODB##*/}

script=/tmp/$(basename $0).$$
cat > $script <<_EOT_

db.authN.deleteMany( { id: '$EZSSO_OIDC_AUTH_ID' } );

db.authN.insertOne({
	id: '$EZSSO_OIDC_AUTH_ID',
	password: '$EZSSO_OIDC_AUTH_PASSWORD',
	status: 'available',
	cookie_name: 'ezsso_sid',
	cache_session: true,
	appinfo_endpoints: [ 'https://descartes-squares.com/api/appinfo' ],
	idps: [
		{
			id: 'google',
			issuer: '$(jq -r .issuer $EZSSO_HOME/rc/secrets/accounts-app/google-oidc-client.json)',
			client_id: '$(jq -r .client_id $EZSSO_HOME/rc/secrets/accounts-app/google-oidc-client.json)',
			client_secret: '$(jq -r .client_secret $EZSSO_HOME/rc/secrets/accounts-app/google-oidc-client.json)',
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

docker exec -i dpsrv-mongo mongosh "$ACCOUNTS_MONGODB" --quiet < $script

rm $script
