var express = require('express');
var libxslt = require('libxslt');
var fs = require('fs');
var path = require('path');
var http = require("http");
var https = require("https");

var pathToThisScript = path.dirname(__dirname);
process.chdir(pathToThisScript);

var deckId = 'zgyng82';
var stylesheetPath = 'preview-deck.xsl';

var lixslt = require('libxslt');
var libxmljs = libxslt.libxmljs;


function returnFromCache( deckId ) {
	var outputPath = 'output/' + deckId + '.html';
	var html = fs.readFileSync(outputPath, { encoding: 'utf8' });
	return html;
}

function transformAndCache( deckId ) {

	var documentPath = 'output/' + deckId + '.xml';
	var outputPath = 'output/' + deckId + '.html';
 
	var stylesheetString = fs.readFileSync(stylesheetPath, { encoding: 'utf8' });
	var stylesheetObj = libxmljs.parseXml(stylesheetString, { nocdata: true });
	var stylesheet = libxslt.parse(stylesheetObj);
 
	var documentString = fs.readFileSync(documentPath, { encoding: 'utf8' });
	var document = libxmljs.parseXml(documentString);
	stylesheet.apply(document, function(err, result){

		// result is now a libxmljs document containing the result of the transformation 
		console.log(result.toString());
		console.log('---> ' + outputPath);
		fs.writeFileSync(outputPath, result.toString(), { encoding: 'utf8' });

	});

}

	

var handler = function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
	var html = returnFromCache( deckId );
	res.write(html);
  res.end('');
};

const port = 8888;

console.log('Listening on port ' + port);
var app = express();
app.listen(port)

app.get('/', function(req, res) {
  res.send('/decks/:deckId/preview');
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

	var cert = '/Users/craiga01/workspace/dev.bbc.co.uk.pem';
	var ca = 'ca-bundle.pem';
	//var deckInIsite2Url = 'https://api.live.bbc.co.uk/isite2-content-reader/content/file?id=' + deckId + '&project=education&allowNonLive=true&depth=2';

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
	console.log('statusCode: ', res.statusCode);
	console.log('headers: ', res.headers);

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


/*
zid="$1"
output="../output/"

curl="/usr/local/Cellar/curl/7.46.0/bin/curl --cert /Users/craiga01/workspace/dev.bbc.co.uk.pem --cacert ../ca-bundle.pem"
$curl -o $output/$zid.xml "https://api.live.bbc.co.uk/isite2-content-reader/content/file?id=$zid&project=education&allowNonLive=true&depth=2"

xsltproc ../preview-deck.xsl $output/$zid.xml > $output/$zid.html && open $output/$zid.html
*/
