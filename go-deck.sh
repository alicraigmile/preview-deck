#!/bin/bash

#Thx to https://confluence.dev.bbc.co.uk/display/~conor.keegan/Curl+on+OSX+10.9

zid="$1"
curl="/usr/local/Cellar/curl/7.46.0/bin/curl --cert /Users/craiga01/workspace/dev.bbc.co.uk.pem --cacert ./ca-bundle.pem"
#$curl -o result.xml "https://api.live.bbc.co.uk/isite2-content-reader/content/file?id=zwc6cwx&project=education&allowNonLive=true&depth=2"
$curl -o result.xml "https://api.live.bbc.co.uk/isite2-content-reader/content/file?id=$zid&project=education&allowNonLive=true&depth=2"
xsltproc preview-deck.xsl result.xml > out.html && open out.html
