#!/bin/bash -ex

question="get a cat"

questions=$( cat <<_EOT_
	Respond in JSON.
	Each question with its answer in its own array element.
	What will happen if I do $question?
	What will happen if I do not $question?
	What will not happen if I do $question?
	What will not happen if I do not $question?
_EOT_)

request=$( cat <<_EOT_
{
  "contents": {
    "role": "user",
    "parts": {
        "text": "$questions"
    },
  },
  "safety_settings": {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_LOW_AND_ABOVE"
  },
  "generation_config": {
    "temperature": 0.9,
    "topP": 1.0,
    "maxOutputTokens": 2048
  }
}
_EOT_)

curl -v \
    -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d "$request" \
    "https://us-central1-aiplatform.googleapis.com/v1/projects/$GOOGLE_PROJECT_ID/locations/us-central1/publishers/google/models/gemini-pro:streamGenerateContent"
