const debug = require('debug')('dsquares:routes:api');

var express = require('express');
var router = express.Router();

var dsquares = require('../lib/dsquares');

router.get('/session', function(req, res, next) {
	const { options } = req.app.settings;
	res.json({ account: req.account });
});

router.get('/redirect', function(req, res, next) {
	const { options } = req.app.settings;
	res.redirect(decodeURIComponent(req.query.url));
});

router.get('/appinfo', async (req, res) => {
	const app_info = {
	};

	// debug(req.id, 'appinfo',app_info);
	res.json(app_info);
});

router.get('/squares', async (req, res) => {
	res.json(await dsquares.listSquares(req));
});

router.post('/squares', async function(req, res, next) {
	res.json(await dsquares.createSquare(req));
});

router.delete('/squares/:square', async function(req, res, next) {
	res.json(await dsquare.deleteSquare(req));
});

router.post('/squares/:square', async function(req, res, next) {
	res.json(await dsquare.createConcern(req));
});

router.post('/squares/:square/:concern', async function(req, res, next) {
	res.json(await dsquare.updateConcern(req));
});

router.delete('/squares/:square/:concern', async function(req, res, next) {
	res.json(await dsquare.deleteConcern(req));
});

module.exports = router;

