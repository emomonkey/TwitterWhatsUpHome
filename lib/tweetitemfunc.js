var tweetModel  = require('../models/TweetHashTag'),
    weatherReading  = require('../models/WeatherReading'),
    weatherDesc = require('../models/WeatherDescription'),
    async = require('async'),
    piglow = require('piglow'),
    animation = piglow.animation,
    pi = piglow.piGlowInterface,
    request = require('request'),
    Quiche = require('quiche');
    



function calculategraph(callbackitm)
{
  try {

    weatherReading.aggregate(
      { $match : {'curdate': 1}},
      {
        $group : {
          _id : { weathertype : "$dayweathertypetext"},
          count : { $sum: 1}
        }
      }, 
      { $project: { _id: 1, count: 1 }}, // you can only project fields from 'group'}
      function (err, results){
        if (err) {
         
          callbackitm(null);
        }
        else 
        {

          if (results != null)
          {
         
            var pie = new Quiche('pie'); 
            pie.setTransparentBackground(); 

            results.forEach(function(item){
              pie.addData(item.count,item._id.weathertype);
            })

            var imageUrl = pie.getUrl(true); // First param controls http vs. http
            callbackitm(imageUrl);
          }
          else {
            console.log('graph not found');
            callbackitm(null);
          }
        }
      }
    );

   

  } catch (exception){
    console.log(exception.message);
  }
}
 
function fncgrpweather(callbackitm)
{
  try {
    
     weatherReading.aggregate(
      { $match : {'curdate': 1}},
      {
        $group : {
          _id : { weathertype : "$dayweathertypetext"},
          count : { $sum: 1}
        }
      }, 
      { $project: { _id: 1, count: 1 }}, // you can only project fields from 'group'}
      function (err, results){
        if (err) {
         
          callbackitm(null);
        }
        else {
          
          callbackitm(results);
        }
      }
    );

  }
  catch (ex)
  {
     console.log(ex.message);
  };    
}; 

function fnccounttweet(tweetsrcitm, callback){

                        tweetModel.findOne({tweethashtag: tweetsrcitm},function (err,tweets){
                      if (err) {
                         console.log(err);
                      }

                      if (tweets) {
                          
                          var updateData = {
                            count: tweets.count + 1
                          };
                          
                            tweetModel.update({tweethashtag: tweets.tweethashtag},updateData, function(err,affected) {
                            
                              return(callback());   
                            });


                      } else {
                    
                          var newTweetHash = new tweetModel({tweethashtag:tweetsrcitm , count: 1});
                          newTweetHash.save();
                          return(callback());
                          
                      }

          
                    })

};


function getweather( datenow, callbckitem)
{
  // , callbckitem
    try 
      {
     
      var vcol = "white";
      var ssnow = "snow, Sleet shower (day), Sleet, Hail shower (day), Hail, Light snow shower (day), Light snow, Heavy snow, Heavy snow shower (day)";
      var srain = "Light rain shower (day), Drizzle, Light rain, Heavy rain shower (day), Heavy rain";
      var sfog = "foggy, Mist, Fog";
      var scloud = "Partly cloudy (day), Cloudy,  Overcast";
      var sthunder = "thunder, Thunder shower (day), Thunder";
      var ssun = "Sunny day";

      weatherReading.find({'datelog' : datenow}, 'dayweathertypetext datelogged',
             function (err,readings){
              var sweather;

               if (readings[0] == null)
               {
                  sweather = 'Not Found';
                  console.log('weather not found');
                  callbckitem(null);
               }

               if (readings[0] != null) {
              
                
                  if (readings[1] != null) {

                    sweather = readings[1].dayweathertypetext;
                    if (ssnow.indexOf(sweather) != -1){
                      vcol = "white";
                    }
                    else if (srain.indexOf(sweather) != -1){
                      vcol = "blue";
                    }
                    else if (sfog.indexOf(sweather) != -1){
                      vcol = "green";
                    }
                    else if (ssun.indexOf(sweather) != -1){
                      vcol = "yellow";
                    }
                    else if (scloud.indexOf(sweather) != -1){
                      vcol = "orange";
                    }
                    else if (ssun.indexOf(sweather) != -1){
                      vcol = "red";
                    }

                  
       
                    animation({interval:10, debug: true})
                             //   .set().to(pi([vcol])).after('0.7s')
                             //   .set().to(pi([vcol])).after('0.8s')
                                .set().to(pi([vcol])).after('0.9s')
                                .repeat(1)
                                .start(function() {
                                  console.log(vcol);
                                  console.log('animate');
                                  callbckitem(sweather);  
                                  
                                });
                  }

      }

      
      })
        

     }
        catch (ex)
        {
          console.log(ex.message);
        }      
}


/* callvckitem */
function fncweather(weatheritem, cbkfncw)
{
  var retval = -1;

  try {

    
  var today = new Date();
  var dd = today.getDate(); 
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear(); 
  var datenow = dd + '/' + mm + '/' + yyyy;

 
  
  weatherReading.findOne({'datelog': datenow}, function (err, reading){

    if (err) {
      console.log(err);
      cbkfncw(-1);
    }  

    
    if (!reading)
    { 
  
      var weatherarrs = new Array();
      var weatherarrtype = new Array();

      weatherarrs[0] = weatheritem.Period[0].Rep[0].W;
      weatherarrs[1] = weatheritem.Period[0].Rep[1].W;
      weatherarrs[2] = weatheritem.Period[1].Rep[0].W;
      weatherarrs[3] = weatheritem.Period[1].Rep[1].W;



      async.map(weatherarrs,  function (item, callback) {
        weatherDesc.findOne({'Type' : item}, 'Type WeatherDescription',
        function(err, ttype){
          if (ttype != null)
          {  
           
            weatherarrtype.push(ttype.WeatherDescription);
            callback();
          }
          
        });

        }, // 3rd parameter is the function call when everything is done
        function(err, result){
          // All tasks are done now
          if (weatherarrtype != null){
          
          
          var weatheritemdy = new weatherReading({datelogged: weatheritem.Period[0].value, datelog: datenow , dateweather: weatheritem.Period[0].value , daytemp: weatheritem.Period[0].Rep[0].Dm, dayprecip: weatheritem.Period[0].Rep[0].PPd, dayweathertypetext: weatherarrtype[0], nighttemp: weatheritem.Period[0].Rep[1].Nm ,  nightprecip: weatheritem.Period[0].Rep[1].PPn,   nightweathertypetext: weatherarrtype[1], curdate : 1 });
          weatheritemdy.save();

          var weatheritemnt = new weatherReading({datelogged: weatheritem.Period[0].value, datelog: datenow , dateweather: weatheritem.Period[1].value , daytemp: weatheritem.Period[1].Rep[0].Dm, dayprecip: weatheritem.Period[1].Rep[0].PPd, dayweathertypetext: weatherarrtype[2] , 
            nighttemp: weatheritem.Period[1].Rep[1].Nm ,  nightprecip: weatheritem.Period[1].Rep[1].PPn,   
            nightweathertypetext: weatherarrtype[3],  curdate : 0 });

          weatheritemnt.save();
          cbkfncw(1);
          
        }
        }
      );

     
    } else {
      cbkfncw(1);
    }
    
 
    });
     

 
    //return(cbkfncw(1));
} catch (err) {
  console.log(err.message);
  cbkfncw(-1);
 // return(cbkfncw(-1));
}
};

function retrieveweather(pdate, callbckwt)
{
  
  try {
  
  request.get("http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/351048?res=daily&key=", 
                  function (err, res, body) {
                    if (!err) 
                    {
                       
                     var resultsObj = JSON.parse(body);
                   
                      fncweather(resultsObj.SiteRep.DV.Location, function(err){
                         
                       
                        getweather(pdate, function(result){
                            
                            callbckwt(result)
                        });
                      
                      });
                     
                  
                    }
                    else {
                      console.log('errorconnecting');
                  //   return(callbckitm(null));
                      callbckitm(null);
                    };
                });
}
catch (err){;
  console.log('error')
  console.log(err.message);
}

      
  
}


                    

exports.counttweet = fnccounttweet

exports.saveweather = fncweather

exports.getweathering = getweather

exports.getgrpweather = fncgrpweather

exports.retrieveweather = retrieveweather

exports.calculategraph = calculategraph

