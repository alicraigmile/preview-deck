#!node

var libxslt = require('libxslt');
var fs = require('fs');
var path = require('path');
var http = require("http");
require('shelljs/global');

var pathToThisScript = path.dirname(__dirname);
process.chdir(pathToThisScript);

var zid = 'zgyng82';
var stylesheetPath = 'preview-deck.xsl';

var lixslt = require('libxslt');
var libxmljs = libxslt.libxmljs;

//transformAndCache( zid );
//var outputPath = 'output/' + zid + '.html';
//exec('open ' + outputPath);

function returnFromCache( zid ) {
	var outputPath = 'output/' + zid + '.html';
	var html = fs.readFileSync(outputPath, { encoding: 'utf8' });
	return html;
}

function transformAndCache( zid ) {

	var documentPath = 'output/' + zid + '.xml';
	var outputPath = 'output/' + zid + '.html';
 
	var stylesheetString = fs.readFileSync(stylesheetPath, { encoding: 'utf8' });
	var stylesheetObj = libxmljs.parseXml(stylesheetString, { nocdata: true });
	var stylesheet = libxslt.parse(stylesheetObj);
 
	var documentString = fs.readFileSync(documentPath, { encoding: 'utf8' });
	var document = libxmljs.parseXml(documentString);
	stylesheet.apply(document, function(err, result){

		// result is now a libxmljs document containing the result of the transformation 
		// console.log(result.toString());
		fs.writeFileSync(outputPath, result.toString(), { encoding: 'utf8' });

	});

}

	

var handler = function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
	var html = returnFromCache( zid );
	res.write(html);
  res.end('');
};

const port = 8888;
console.log('Listening on port ' + port);
var server = http.createServer();
server.addListener("request", handler);
server.listen(port);


/*
zid="$1"
output="../output/"

curl="/usr/local/Cellar/curl/7.46.0/bin/curl --cert /Users/craiga01/workspace/dev.bbc.co.uk.pem --cacert ../ca-bundle.pem"
$curl -o $output/$zid.xml "https://api.live.bbc.co.uk/isite2-content-reader/content/file?id=$zid&project=education&allowNonLive=true&depth=2"

xsltproc ../preview-deck.xsl $output/$zid.xml > $output/$zid.html && open $output/$zid.html
*/
