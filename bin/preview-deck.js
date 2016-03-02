#!/usr/bin/env node

var express = require('express');
var libxslt = require('libxslt');
var fs = require('fs');
var path = require('path');
var http = require("http");
var https = require("https");

var pathToThisScript = path.dirname(__dirname);
process.chdir(pathToThisScript);

var port = process.env.PREVIEW_PORT || 8888;
var cert = process.env.PREVIEW_CERT;

function returnFromCache( deckId ) {
	var outputPath = 'output/' + deckId + '.html';
	var html = fs.readFileSync(outputPath, { encoding: 'utf8' });
	return html;
}

function transformAndCache( deckId ) {

  var libxmljs = libxslt.libxmljs;

	var stylesheetPath = 'preview-deck.xsl';
	var documentPath = 'output/' + deckId + '.xml';
	var outputPath = 'output/' + deckId + '.html';
 
	var stylesheetString = fs.readFileSync(stylesheetPath, { encoding: 'utf8' });
	var stylesheetObj = libxmljs.parseXml(stylesheetString, { nocdata: true });
	var stylesheet = libxslt.parse(stylesheetObj);
 
	var documentString = fs.readFileSync(documentPath, { encoding: 'utf8' });
	var document = libxmljs.parseXml(documentString);
	stylesheet.apply(document, function(err, result) {

		// result is now a libxmljs document containing the result of the transformation 
		fs.writeFileSync(outputPath, result.toString(), { encoding: 'utf8' });

	});

}

console.log('Listening on port ' + port);
console.log('Using cert file: ' + cert);

var app = express();
app.listen(port)

app.get('/', function(req, res) {
  res.send('<a href="/decks/">Get started</a> <a href="/version">Version info</a>');
});

app.get('/version', function(req, res) {
	var version = getVersion();
  res.send(version);
});

app.get('/decks', function(req, res) {
  var deckId = req.query.deckId;
	if (deckId) {
		res.redirect('/decks/' + deckId + '/preview');
	} else {
		res.send('<h1>Preview a deck</h1> <form method="get" action="/decks"><input name="deckId" value="zxjmrdm"> <input type="submit" name="" value="Preview"></form> <a href="/version">Version info</a>');

	}
});

app.get('/decks/:deckId/preview', function(req, res) {
  var deckId = req.params.deckId;
	if (!isCached( deckId)) {
		getFromServer( deckId );
		transformAndCache( deckId );
	}
	var html = returnFromCache( deckId );
  res.send(html);
});

function isCached( deckId ) {
	return false;
}

function getFromServer( deckId ){
	// save to here
	var documentPath = 'output/' + deckId + '.xml';


var options = {
  hostname: 'api.live.bbc.co.uk',
  port: 443,
  path: '/isite2-content-reader/content/file?id=' + deckId + '&project=education&allowNonLive=true&depth=2',
  method: 'GET',
  key: fs.readFileSync(cert),
  cert: fs.readFileSync(cert)
};
options.agent = new https.Agent(options);

var req = https.request(options, (res) => {
	//console.log('statusCode: ', res.statusCode);
	//console.log('headers: ', res.headers);

 var body = '';

  res.on('data', (chunk) => {
		body += chunk;
	});

  res.on('end', function () {
    //process.stdout.write(body);
		fs.writeFileSync(documentPath, body, { encoding: 'utf8' });
  });
});

req.end();

}

function getVersion() {
	var content = fs.readFileSync('package.json');
	var parsedJSON = JSON.parse(content);
	return parsedJSON.name + '-' + parsedJSON.version;
}
app.get('/decks/:deckId/preview', function(req, res) {
  var deckId = req.params.deckId;
	if (!isCached( deckId)) {
		getFromServer( deckId );
		transformAndCache( deckId );
	}
	var html = returnFromCache( deckId );
  res.send(html);
});

function isCached( deckId ) {
	return false;
}

function getFromServer( deckId ){
	// save to here
	var documentPath = 'output/' + deckId + '.xml';


var options = {
  hostname: 'api.live.bbc.co.uk',
  port: 443,
  path: '/isite2-content-reader/content/file?id=' + deckId + '&project=education&allowNonLive=true&depth=2',
  method: 'GET',
  key: fs.readFileSync(cert),
  cert: fs.readFileSync(cert)
};
options.agent = new https.Agent(options);

var req = https.request(options, (res) => {

 var body = '';

  res.on('data', (chunk) => {
		body += chunk;
	});

  res.on('end', function () {
		fs.writeFileSync(documentPath, body, { encoding: 'utf8' });
  });
});

req.end();

}

function getVersion() {
	var content = fs.readFileSync('package.json');
	var parsedJSON = JSON.parse(content);
	return parsedJSON.name + '-' + parsedJSON.version;
}

