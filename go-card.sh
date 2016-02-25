#!/bin/bash
xsltproc preview-glossary.xsl result.xml > out.html && open out.html
