<?xml version="1.0"?>
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:result="https://production.bbc.co.uk/isite2/contentreader/xml/result"
	xmlns:card="https://production.bbc.co.uk/isite2/project/education/card"
	xmlns:term="https://production.bbc.co.uk/isite2/project/education/sg-glossary-term"
	xmlns:html="https://production.bbc.co.uk/isite2/project/education/sg-glossary-term"
	exclude-result-prefixes="xsl result card term"
	version="1.0">

<xsl:output method="html" version="4.0"
encoding="UTF-8" indent="yes"/>

<xsl:template match="/result:result">
<p>iSite2fileId = <strong><xsl:value-of select="result:metadata/result:fileId" /></strong>.</p>
<xsl:apply-templates select="result:document/card:card" />
</xsl:template>


<xsl:template match="card:card">
	<p>found a card with id <strong><xsl:value-of select="card:basic-information/card:id" /></strong>
	and type <strong><xsl:value-of select="card:basic-information/card:type" /></strong>.</p>

	<xsl:if test="card:basic-information/card:type/text() ">
		<xsl:apply-templates select="card:glossary-term/card:glossary/result:result/result:document/term:glossary-term" />
	</xsl:if>
</xsl:template>


<xsl:template match="term:glossary-term">
	<p>The meaning of <strong><xsl:value-of select="term:term" /></strong> is <strong><xsl:value-of select="term:description" /></strong>.</p>
</xsl:template>


<!-- https://api.live.bbc.co.uk/isite2-content-reader/content/file?id=zxdsdmn&project=education&allowNonLive=true&depth=1 -->

</xsl:stylesheet>


