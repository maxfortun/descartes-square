#!/opt/local/bin/bash -e

app=$1

if [ -z "$app" ]; then
	echo "Usage: $0 <app> [options]"
	echo " e.g.: $0 auth"
	exit 1
fi

shift

WD=$( cd $(dirname $0)/..; pwd )
. $WD/secrets/.env.local
app_var=${app^^}_MONGODB
app_uri=${!app_var}

params=()
if [ "$1" = "-" ]; then
        params+=( -i )
else
        params+=( -it )
fi

docker exec ${params[@]} mongo mongosh "$app_uri" "$@"


