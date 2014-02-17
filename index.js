'use strict';



var kraken = require('kraken-js'),
 db = require('./lib/database'),
 app = {},
 dust = require('adaro'),
 tweetModel = require('./models/TweetHashTag'),
 async = require('async'),
 tweetitemlib = require('./lib/tweetitemfunc'),

 weatherDesc = require('./models/WeatherDescription'),
 tweethashtag = require('./models/TweetHashTag'),
 piglow = require('piglow'),
 animation = piglow.animation,
 pi = piglow.piGlowInterface,
 Twit = require('twit');




var tweetarrs = new Array();
var tweettext = "";

var template = '<div><ul>{#.}<li>{.}</li>{/.}</ul> </div>';
var compiled ;

var tweetstmpost = new Twit({
      consumer_key: '', // <--- FILL ME IN
      consumer_secret: '', // <--- FILL ME IN
      access_token: '', // <--- FILL ME IN
      access_token_secret: '', secure: true
    });  

var tweetstm = new Twit({
      consumer_key: '', // <--- FILL ME IN
      consumer_secret: '', // <--- FILL ME IN
      access_token: '', // <--- FILL ME IN
      access_token_secret: '', secure: true
    });     

// 'locations':'-6.317165, 54.427918, -6.2896, 54.444092'
  var waringstown = ['-6.317165', '54.427918', '-6.2896', '54.444092']
  var stream = tweetstm.stream('statuses/filter', {locations: waringstown}) 
   var matches = new Array();


   

app.configure = function configure(nconf, next) {
   
   
    //// Fired when an app configures itself
    db.config(nconf.get('databaseConfig'));

    compiled = dust.compile(template, "Tweets");
 

    setInterval(function(){
  
    try{

      console.log('cronning');
       var today = new Date();
       
       var dd = today.getDate(); 
       var mm = today.getMonth()+1;
       var yyyy = today.getFullYear(); 
       var datenow = dd + '/' + mm + '/' + yyyy;
      
        tweetitemlib.retrieveweather(datenow,function(result){
             console.log('retrieved weather'); 
          
          });

          
            tweethashtag.remove({count: {$lte: 4}}, function(err){
                if (err){
                  console.log('error deleteing tweetcount');
                }
                
              }
            );

        var date = new Date();
        var minutes = date.getMinutes();
        var hour = date.getHours();
        var year = date.getFullYear();

        var stime = hour + ":" + minutes + " " + year;   

      
       

        tweetstmpost.post('statuses/update', { status: '#waringstown . Realtime updates ' + stime  + ' from twittersphere in waringstown. http://tinyurl.com/kbdpmeb' }, 
             function (err, data) {
              if (err) console.log('Tweeting failed: ' + err.message);
              else console.log('Success!')
            }
          );
         
         
          
        
           
      } catch (ex){console.log(ex.message);}
      },8 * 60 * 60 * 1000);

  
    next(null);
    
    

    

};


app.requestStart = function requestStart(server) {
    // Fired at the beginning of an incoming request
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Fired before routing occurs
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Fired after routing occurs
};


kraken.create(app).listen(function (err, server) {
    // for test


	var io = require('socket.io').listen(server);
    
  
   stream.on('tweet',   function(data) {
            
              tweetarrs.push(data.text);
              tweettext = data.text;
              
          
              if (tweettext.indexOf('#') > -1)
              {
                // keep count of #tag
                
                matches = tweettext.match(/#\S+/g);              
                var  tweetsrc = matches;
               
                if (tweetsrc != null )
                {  
                 if (tweetsrc.length > 0)
                 {
                 // check to see if hashtag exists
                 async.each(tweetsrc, tweetitemlib.counttweet);
                 }

                }

              }

              if (tweetarrs.length > 100)
              {
                tweetarrs.shift();
              };
             

              
              dust.loadSource(compiled);
            
              var jtweetdata = JSON.stringify(tweetarrs);
            
              dust.render("Tweets", tweetarrs, function(err, out){
             
              io.sockets.emit('twitmessagestream', { tweetmessage: out });
            });
                 
             
            });

            

      }); 

  

module.exports = app;
