const debug = require('debug')('dsquares:lib:ai');

const fetch = require('node-fetch');

const OpenAI = require('openai');
const openAI = new OpenAI({ organization: process.env.OPENAI_ORG });

const {VertexAI, HarmCategory, HarmBlockThreshold} = require('@google-cloud/vertexai');
const vertexAI = new VertexAI({ project: process.env.GOOGLE_PROJECT_ID, location: process.env.GOOGLE_LOCATION });

const vertexAIGenerativeModel = vertexAI.preview.getGenerativeModel({
    model: 'gemini-pro',
    // The following parameters are optional
    // They can also be passed to individual content generation requests
    safety_settings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
    generation_config: {max_output_tokens: 256},
  });

const dsquares = require('./dsquares');

async function openai(req) {
	const square = await dsquares.findSquare(req);
	const prompt = `Respond to each of the following questions in JSON. What will happen if I do ${square.decision}? What will happen if I do not ${square.decision}? What will not happen if I do ${square.decision}? What will not happen if I do not ${square.decision}?`;

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

async function vertex(req) {
	const square = await dsquares.findSquare(req);
	const prompt = `
		Respond to each question individually,
			in JSON format,
			include the question being asked in the JSON structure,
			itemize by category,
			list each category separately with a label, a description, and a sentiment.
		What will happen if I do ${square.decision}?
		What will happen if I do not ${square.decision}?
		What will not happen if I do ${square.decision}?
		What will not happen if I do not ${square.decision}?
	`;

	debug(req.id, 'googleai >', prompt, process.env);

	const aiRequest = {
		contents: [{role: 'user', parts: [ { text: prompt }]}],
	};

	const aiResponse = await vertexAIGenerativeModel.generateContent(aiRequest);

	debug(req.id, 'googleai <', aiResponse);

	return aiResponse;
}

/*
	const aiRequest = {
		contents: {
			role: 'user',
			parts: {
				text: prompt
			}
		},
		safety_settings: {
			category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
			threshold: 'BLOCK_LOW_AND_ABOVE'
		},
		generation_config: {
			temperature: 0.9,
			topP: 1.0,
			maxOutputTokens: 2048
		}
	};

	const url = `https://${process.env.GOOGLE_LOCATION}-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/${process.env.GOOGLE_LOCATION}/publishers/google/models/gemini-pro:streamGenerateContent`;
	const options = {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`,
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(aiRequest)
	};

	debug(req.id, 'googleai >>', url, options);
	const fetchResponse = await fetch(url, options)
	.then(response => response.json());

	let aiResponse = {};
	try {
		let textResponse = fetchResponse.map(chunk => chunk.candidates[0].content.parts[0].text).join('').replaceAll(/^[^{]+/g,'').replaceAll(/[^}]+$/g,'');
		debug(req.id, 'googleai <<', textResponse, fetchResponse);
		aiResponse = JSON.parse(textResponse);
	} catch(e) {
		debug(req.id, 'googleai !!', e);
	}
}
*/


module.exports = {
	openai,
	vertex
};
