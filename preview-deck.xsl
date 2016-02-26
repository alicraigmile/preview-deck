<?xml version="1.0"?>
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:result="https://production.bbc.co.uk/isite2/contentreader/xml/result"
  xmlns:deck="https://production.bbc.co.uk/isite2/project/education/deck"
	xmlns:card="https://production.bbc.co.uk/isite2/project/education/card"
	xmlns:term="https://production.bbc.co.uk/isite2/project/education/sg-glossary-term"
	xmlns:html="https://production.bbc.co.uk/isite2/project/education/sg-glossary-term"
	exclude-result-prefixes="xsl result deck card term"
	version="1.0">

<xsl:output method="html" version="4.0"
encoding="UTF-8" indent="yes"/>

<xsl:template match="/result:result">
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta content="width=device-width,initial-scale=1" name="viewport"/>
    <link rel="stylesheet" href="http://static.bbci.co.uk/modules/share/1.5.1/style/share.css"/>
    <link rel="stylesheet" href="http://static.bbci.co.uk/gelstyles/0.10.0/style/core.css"/>
    <link href="http://stuartmemo.github.io/bbc-cards/stylesheets/application.css" rel="stylesheet" type="text/css" />
    <style>
    .c-Card {width: 360px; }	
    .term {color: orange}
    </style>
    <title>Deck <xsl:value-of select="result:metadata/result:fileId" /> (preview)</title>
  </head>
<body class="cards cards_index">
  <h1>Deck <xsl:value-of select="result:metadata/result:fileId" /> (preview)</h1>

<xsl:apply-templates select="result:document/deck:deck//card:card" />
<script src="http://stuartmemo.github.io/bbc-cards/javascripts/application.js" type="text/javascript"><xsl:comment>null</xsl:comment></script>
</body>
</html>
</xsl:template>


<xsl:template match="card:card">

<h2>Card <xsl:value-of select="card:basic-information/card:id" /></h2>
	<p>A <strong><xsl:value-of 
	select="card:basic-information/card:type" /></strong> card.</p>


	  <div class="c-Article c-Card">
    <div class="c-Article-body c-Card-body">
      <div class="">
        <div class="c-Text gel-long-primer">
           
            		<xsl:if test="card:basic-information/card:type/text() ">
		<xsl:apply-templates select="card:glossary-term/card:glossary/result:result/result:document" />
	</xsl:if>
 
        </div>
        <p class="c-Card-brand c-Brand c-Brand--bitesize gel-minion">BBC Bitesize (preview)</p>
      </div>
    </div>
    <div class="c-Toolbar gel-brevier u-cf">
      <ul class="c-Toolbar-actionGroup">
        <li class="c-Toolbar-action">
          <span class="c-Share c-Share--shortText js-share"></span>
        </li>
      </ul>
    </div>
  </div>
</xsl:template>


<xsl:template match="result:document/term:glossary-term">
	<p>The meaning of <strong class="term"><xsl:value-of select="term:term" /></strong> is <strong><xsl:value-of select="term:description" /></strong>.</p>
</xsl:template>


<!-- https://api.live.bbc.co.uk/isite2-content-reader/content/file?id=zxdsdmn&project=education&allowNonLive=true&depth=1 -->

</xsl:stylesheet>


