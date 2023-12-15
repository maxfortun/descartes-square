const debug = require('debug')('dsquares:lib:ai');

const OpenAI = require('openai');
const openai = new OpenAI({ organization: process.env.OPENAI_ORG });

const {VertexAI, HarmCategory, HarmBlockThreshold} = require('@google-cloud/vertexai');
const vertexAI = new VertexAI({project: process.env.GCLOUD_PROJECT_ID, location: process.env.GCLOUD_LOCATION});
const vertexAIGenerativeModel = vertexAI.preview.getGenerativeModel({
	model: 'gemini-pro',
	// The following parameters are optional
	// They can also be passed to individual content generation requests
	safety_settings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
	generation_config: {max_output_tokens: 256},
});

async function openai(req) {
	const square = await findSquare(req);
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

	const aiResponse = await openai.chat.completions.create(aiRequest);

	debug(req.id, 'openai <', aiResponse);

	return aiResponse;
}

async function vertex(req) {
	const square = await findSquare(req);
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

	debug(req.id, 'googleai >', prompt);

	const aiRequest = {
		contents: [
			{
				role: 'user',
				parts: [
					{ text: prompt }
				]
			}
		]
	};

	const aiResponse = {};

	const streamingResp = await vertexAIGenerativeModel.generateContentStream(aiRequest);
	for await (const item of streamingResp.stream) {
		debug(req.id, 'googleai <<', JSON.stringify(item));
	}

	debug(req.id, 'googleai <', aiResponse);

	return completion;
}
module.exports = {
	openai,
	vertex
};
