'use strict';

const btoa = (data) => Buffer.from(data).toString('base64');
const atob = (base64) => Buffer.from(base64, 'base64').toString('binary');

module.exports = {
	atob,
	btoa
};


