import Debug from 'debug';
import React, { useContext, useState, useEffect } from 'react';

import { Typography } from '@mui/material';

const debug = Debug('accounts:LoggedOut');

export default function () {
	const url = encodeURIComponent(window.location.href);
	window.location.href = '/api/redirect?url='+url;
	return	<Box sx={{ display: 'flex' }} justifyContent='center' alignItems='center' minHeight='80vh'>
				<Typography>You are logged out.</Typography>
			</Box>;

}

