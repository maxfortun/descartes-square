#!/bin/bash -ex

question="get a cat"

prompt=$( cat <<_EOT_
	Respond in JSON.
	Each question with its respective answer in its own array element.
	List as many answers per question as you can.
	What will happen if I do $question?
	What will happen if I do not $question?
	What will not happen if I do $question?
	What will not happen if I do not $question?
_EOT_)

request=$( cat <<_EOT_
{
	"instances": [
		{ "prompt": "$prompt" }
	],
	"parameters": {
		"temperature": 0.2,
		"maxOutputTokens": 256,
		"topK": 40,
		"topP": 0.95
	}
}
_EOT_)

MODEL_ID=text-bison
LOCATION=us-east4
URL=https://$LOCATION-aiplatform.googleapis.com/v1/projects/${GOOGLE_PROJECT_ID}/locations/$LOCATION/publishers/google/models/${MODEL_ID}:predict

curl -v \
    -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d "$request" \
	$URL
