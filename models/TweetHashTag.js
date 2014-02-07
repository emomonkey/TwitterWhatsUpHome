'use strict';

var mongoose = require('mongoose');

var TweetHashTag = function () {

    //Define a super simple schema for our products.
    var tweetSchema = mongoose.Schema({
        tweethashtag: String,
        count: Number
    });

    /**
* Verbose toString method
*/
    
    /**
* Format the price of the product to show a dollar sign, and two decimal places
*/
    

    return mongoose.model('TweetHashTag', tweetSchema);

};

module.exports = new TweetHashTag();