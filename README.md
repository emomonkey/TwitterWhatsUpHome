# TwitterWhatsUpHome

Nodejs application built on the Krakenjs Suite using a MongoDB database. This application requires a Twitter API key that you need to enter in the index.js in the root.

In addition you need a key for the UK Met Office as this routine also displays the weather for your location. The key needs updated in the file tweetitemfunc.js in the lib folder. Format is below

http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/yyyyy?res=daily&key=xxxxxxx

yyyy is the location and xxxxx is the datapoint key

The Twitter API can be retrieved from this location https://dev.twitter.com/

The Met Office DataPoint Login can be found at http://datapoint.metoffice.gov.uk

It also requires a PiGlow as the Raspberry PI glows according to the weather e.g. blue for rain, white for snow and orange for cloudy as well



