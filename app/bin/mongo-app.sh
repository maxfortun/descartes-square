#!/bin/bash -e

app=$1

if [ -z "$app" ]; then
	echo "Usage: $0 <app> [options]"
	echo " e.g.: $0 dsquares"
	ls -1 $EZSSO_HOME/rc/secrets/
	exit 1
fi

shift

. $DPSRV_HOME/rc/bin/dpsrv.sh

WD=$( cd $(dirname $0)/../..; pwd )
. $WD/secrets/.env.local

app_var=${app^^}_MONGODB
app_var=${app_var//-/_}
app_uri=${!app_var}

params=()
if [ "$1" = "-" ]; then
        params+=( -i )
else
        params+=( -it )
fi

container=$(dpsrv-list | grep ' dpsrv-mongo-' | awk '{ print $3 }')

docker exec ${params[@]} $container mongosh "$app_uri" "$@"


