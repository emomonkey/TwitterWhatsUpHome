/**
* A custom library to establish a database connection
*/
'use strict';
var mongoose = require('mongoose'),
    weatherDesc = require('../models/WeatherDescription'),
    tweetitemlib = require('../lib/tweetitemfunc'),
    request = require("request");

var db = function () {
    return {

        /**
* Open a connection to the database
* @param conf
*/
        config: function (conf) {
            mongoose.connect('mongodb://' + conf.host + '/' + conf.database);
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function (arg) {
              console.log('database opened');
              var today = new Date();
       
               var dd = today.getDate(); 
               var mm = today.getMonth()+1;
               var yyyy = today.getFullYear(); 
               var datenow = dd + '/' + mm + '/' + yyyy;
              
                tweetitemlib.retrieveweather(datenow,function(result){
                     console.log('retrieved weather'); 
          
          });
        
            }
            
            );
        }}
};

exports.findbyKeyword = function (arrkey) {
    var results = new Array();

    return results;
}

module.exports = db();