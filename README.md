# Preview a deck of cards from the Bitesize app in a web page #

All you need is the deckId e.g. zgyng82

## Installation ##
```
npm install
```

## Starting the web service ##

To access the raw decks in preview mode, you'll need a BBC developer certificate.

```
export PREVIEW_CERT=/path/to/your/certificate.pem
export PREVIEW_PORT=8888 (optional, default=8888)
npm start
```

## Previewing ##

There's a nice simple webform for you to enter your deckId into here:

```
http://localhost:8888/decks/
```

## Some examples to try ##

```
http://localhost:8888/decks/zgc6cwx/preview
http://localhost:8888/decks/zpvscwx/preview
http://localhost:8888/decks/zgyng82/preview
```

## Check the version ##

```
http://localhost:8888/version
