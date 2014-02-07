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
                
                // key needs set
                request.get("http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/351048?res=daily&key=", 
                function (err, res, body) {
                  if (!err) 
                  {
                   
                    var resultsObj = JSON.parse(body);
                    
                   

                   tweetitemlib.saveweather(resultsObj.SiteRep.DV.Location, function(err){
                         
                     
                        
                    });    
                              
                  }
                  else {
                    console.log('errorconnecting');
                  };
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