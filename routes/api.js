const debug = require('debug')('dsquares:routes:api');

const express = require('express');
const router = express.Router();

const dsquares = require('../lib/dsquares');
const ai = require('../lib/ai');

router.get('/session', function(req, res, next) {
	res.json({ account: req.account });
});

router.get('/redirect', function(req, res, next) {
	res.redirect(decodeURIComponent(req.query.url));
});

router.get('/appinfo', async (req, res) => {
	res.json(await dsquares.appInfo(req));
});

router.get('/squares', async (req, res) => {
	res.json(await dsquares.listSquares(req));
});

router.post('/squares', async function(req, res, next) {
	res.json(await dsquares.createSquare(req));
});

router.get('/squares/:square', async function(req, res, next) {
	res.json(await dsquares.findSquare(req));
});

router.delete('/squares/:square', async function(req, res, next) {
	res.json(await dsquares.deleteSquare(req));
});

router.post('/squares/:square/decision', async function(req, res, next) {
	res.json(await dsquares.updateDecision(req));
});

router.post('/squares/:square/considerations', async function(req, res, next) {
	res.json(await dsquares.createConsideration(req));
});

router.post('/squares/:square/invite', async function(req, res, next) {
	res.json(await dsquares.invite(req));
});

router.post('/squares/:square/considerations/:consideration', async function(req, res, next) {
	res.json(await dsquares.updateConsideration(req));
});

router.delete('/squares/:square/considerations/:consideration', async function(req, res, next) {
	res.json(await dsquares.deleteConsideration(req));
});

router.get('/ai/openai/:square', async function(req, res, next) {
	res.json(await ai.openai(req));
});

router.get('/ai/vertex/:square', async function(req, res, next) {
	res.json(await ai.vertex(req));
});

module.exports = router;

