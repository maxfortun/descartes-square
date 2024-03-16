const debug = require('debug')('dsquares:lib:ai');

const OpenAI = require('openai');
const openAI = new OpenAI({ organization: process.env.OPENAI_ORG });

const { GoogleAuth } = require('google-auth-library');

const dsquares = require('./dsquares');

const tokens = {};

async function openai(req) {
	const square = await dsquares.findSquare(req);
	const prompt = `Respond to each of the following questions in JSON. What will happen if I do ${square.decision}? What will happen if I do not ${square.decision}? What will not happen if I do ${square.decision}? What will not happen if I do not ${square.decision}? Do not include negations of previously given answers.`;

	const aiRequest = {
		model: "gpt-3.5-turbo",
		messages: [
			{
				role: 'user',
				content: prompt
			}
		]
	};

	debug(req.id, 'openai >', prompt);

	const aiResponse = await openAI.chat.completions.create(aiRequest);

	debug(req.id, 'openai <', aiResponse);

	return aiResponse;
}

async function googleAuth(req) {
	const googleAuth = new GoogleAuth({
		scopes: 'https://www.googleapis.com/auth/cloud-platform'
	});

	tokens.google_access_token = await googleAuth.getAccessToken();
}

async function vertex(req) {
	const square = await dsquares.findSquare(req);
	debug(req.id, 'vertex', square);

	const prompt = `
		Respond in JSON.
		Each question with its respective answer in its own array element.
		List 5 answers per question.
		Phrase answers from first person perspective.
		Add a sentiment to every answer.

		What will happen if I do ${square.decision}?
		What will happen if I do not ${square.decision}?
		What will not happen if I do ${square.decision}?
		What will not happen if I do not ${square.decision}?
	`;

	debug(req.id, 'googleai >', prompt);

	const url = `https://${process.env.GOOGLE_LOCATION}-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_CLOUD_PROJECT}/locations/${process.env.GOOGLE_LOCATION}/publishers/google/models/${process.env.GOOGLE_AI_MODEL_ID}:predict`;

	const aiRequest = {
		instances: [
			{ prompt }
		],
		parameters: {
			temperature: 0.2,
			maxOutputTokens: 1024,
			topK: 40,
			topP: 0.95
		}
	};

	if(!tokens.google_access_token) {
		await googleAuth(req);
	}

	const options = {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${tokens.google_access_token}`,
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(aiRequest)
	};

	debug(req.id, 'googleai >>', url, options);
	const fetchResponse = await fetch(url, options)
	.catch(async e => {
		debug(req.id, 'googleai !!', e);
		await googleAuth(req);
		options.headers.Authorization = `Bearer ${tokens.google_access_token}`;
		return await fetch(url, options);
	})
	.then(response => response.json());

	debug(req.id, 'googleai <<', fetchResponse);
	let aiResponse = {};
	try {
		let textResponse = fetchResponse.predictions[0].content.replaceAll(/^[^{]+/g,'').replaceAll(/[^}]+$/g,'');
		debug(req.id, 'googleai <<', textResponse);
		aiResponse = JSON.parse(textResponse);
	} catch(e) {
		debug(req.id, 'googleai !!', e);
	}
	debug(req.id, 'googleai <', aiResponse);

	return aiResponse;
}

module.exports = {
	openai,
	vertex
};
