#!/bin/bash -e
app=$1

if [ -z "$app" ]; then
	echo "Usage: $0 <app> [options]"
	echo " e.g.: $0 dsquares"
	exit 1
fi

. $DPSRV_HOME/rc/bin/dpsrv.sh

SWD=$( cd $(dirname $0) ; pwd )
MONGO_INITDB_ROOT_USERNAME_FILE=$DPSRV_HOME/rc/secrets/mongo/conf/admin-username
MONGO_INITDB_ROOT_PASSWORD_FILE=$DPSRV_HOME/rc/secrets/mongo/conf/admin-password

if [ -z "$MONGO_INITDB_ROOT_USERNAME" ] && [ -f "$MONGO_INITDB_ROOT_USERNAME_FILE" ]; then
	MONGO_INITDB_ROOT_USERNAME=$(cat $MONGO_INITDB_ROOT_USERNAME_FILE)
fi

if [ -z "$MONGO_INITDB_ROOT_PASSWORD" ] && [ -f "$MONGO_INITDB_ROOT_PASSWORD_FILE" ]; then
	MONGO_INITDB_ROOT_PASSWORD=$(cat $MONGO_INITDB_ROOT_PASSWORD_FILE)
fi

admin_uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/admin?tls=true&tlsInsecure=true&tlsCertificateKeyFile=/etc/mongo/cert.pem"

. $SWD/../../secrets/.env.local
app_var=${app^^}_MONGODB
app_uri=${!app_var}
app_uri=${app_uri%%\?*}
app_db=${app_uri##*/}
app_uri=${app_uri##*//}
app_uri=${app_uri%%@*}
app_username=${app_uri%:*}
app_password=${app_uri##*:}


script=/tmp/$(basename $0).$$
cat > $script <<_EOT_
use $app_db;

db.dropUser("$app_username");

db.createUser(
   {
	 user: "$app_username",
	 pwd: "$app_password",
	 roles:
	   [
		 { role: "readWrite", db: "$app_db" }
	   ]
   }
);

_EOT_

container=$(dpsrv-list | grep ' dpsrv-mongo-' | awk '{ print $3 }')
docker exec -i $container mongosh "$admin_uri" --quiet < "$script"

rm "$script"

