#!/bin/bash

#get-with-ssl-cert "https://api.live.bbc.co.uk/isite2-content-reader/content/file?id=zwc6cwx&project=education&allowNonLive=true&depth=2" > result.xml

xsltproc preview-deck.xsl result.xml > out.html && open out.html
