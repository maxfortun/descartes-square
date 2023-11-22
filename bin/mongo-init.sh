#!/opt/local/bin/bash -e

app=$1

if [ -z "$app" ]; then
	echo "Usage: $0 <app> [options]"
	echo " e.g.: $0 auth"
	exit 1
fi

WD=$( cd $(dirname $0)/..; pwd )
. $WD/secrets/.env.local

app_var=${app^^}_MONGODB
app_uri=${!app_var}
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

docker exec -i mongo mongosh "$ADMIN_MONGODB" --quiet < "$script"

rm "$script"

