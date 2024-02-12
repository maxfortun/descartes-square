 
const refetch = async (url, options) => {
	return fetch(url, options)
	.catch(e => {
		return refetchIframe(url, options);
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

module.exports = {
	refetch
};
