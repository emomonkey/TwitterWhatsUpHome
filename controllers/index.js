'use strict';
var  tweetModel = require('../models/TweetHashTag'),
 weatherReading  = require('../models/WeatherReading'),
 weatherDescription = require('../models/WeatherDescription'),
 piglow = require('piglow'),
 animation = piglow.animation,
 pi = piglow.piGlowInterface,
 tweetitemlib = require('../lib/tweetitemfunc');


module.exports = function (server) {
    
    
    server.get('/', function (req, res) {
     
       	tweetModel.find({"count" : {$gte:1}}, 'tweethashtag count', {limit: 100, sort:{'count': -1}}/*,{limit:100}, sort:{'count': -1}*/ // DESC
       	 ,function (err,tweets){
       		if (err) {
       			console.log(err);
       		}

        
            var today = new Date();
            var dd = today.getDate(); 
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear(); 
            var datenow = dd + '/' + mm + '/' + yyyy;

            weatherReading.find({'datelog' : datenow}, 'datelog dateweather daytemp dayprecip dayweathertypetext nighttemp nightprecip nightweathertypetext',
             function (err,readings){

                 

                  // Get weather type for today and tomorrow

                  var model = 
                  {
                      tweethashs: tweets,
                      tmpreading: readings,
                      home: true,
                      contact: false,
                      about: false
                  };
          
              /*   animation({interval:10, debug: true})
                  .set().to(pi(['ring_0'])).after('0.1s')
                  .set().to(pi(['ring_1'])).after('0.1s')
                  .set().to(pi(['ring_2'])).after('0.1s')
                  .repeat(3)
                  .start(function() {
        console.log('i looped 3 times, now Im done.');
    });*/
                 
                  res.render('index',model);
            
             } )
         

       	
       	})
        
    });

    server.get('/about', function (req, res) {
        weatherReading.find({'datelogged': 'dateweather'}, 'datelogged dateweather daytemp dayprecip dayweathertype nighttemp nightprecip nightweathertype', {limit: 100, sort:{'dateweather': -1}},
             function (err,readings){
                 
                   var model = 
                  {
                    tmpreading: readings,
                    home: false,
                    contact: false,
                    about: true
                  };

                res.render('about', model);
            
             } )
       
    });

    server.get('/weather', function(req,res){

    tweetitemlib.getgrpweather( function(results){
       
          var model = 
          {
            weathervals: results,
            home: false,
            contact: true,
            about: false
          };
        
        res.render('weather', model);

    });
    
    });

};
