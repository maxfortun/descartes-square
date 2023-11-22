import Debug from 'debug';
import React, { useContext, useState, useEffect } from 'react';

import { Box, CircularProgress } from '@mui/material';

export default function () {
	return	<Box sx={{ display: 'flex' }} justifyContent='center' alignItems='center' minHeight='80vh'>
				<CircularProgress />
			</Box>;
}

