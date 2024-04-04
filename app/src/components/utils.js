import Debug from 'debug';
const debug = Debug('dsquares:utils');

const refetch = async (url, options) => {
	return fetch(url, options)
	.catch(e => {
		return refetchIframe(url, options);
	})
	.catch(e => {
		const url = encodeURIComponent(window.location.href);
		window.location.href = '/api/redirect?url='+url;
	});
};


const refetchIframe = async (url, options) => {
	let iframe = null;
	return new Promise((resolve, reject) => {
		iframe = document.createElement("IFRAME");
		iframe.style.display = "none";
		iframe.src = url;
		iframe.onload = function() {
			return resolve(fetch(url, options));
		};
		iframe.onerror = function(e) {
			return reject(e);
		};
		document.body.appendChild(iframe);
	}).finally(() => {
		if(iframe) {
			document.body.removeChild(iframe);
		}
	});
}; 

const state = (newState) => {
	return (prevState) => {
		const changedState = { ...prevState, ...newState };
		debug('state', changedState);
		return changedState;
	};
};

module.exports = {
	refetch,
	state
};
