var kraken = require('kraken-js'),
 app = {},
 tweetitemlib = require('../lib/tweetitemfunc'),
 mongoose = require("mongoose"),
 should = require('chai').should(),
 weatherReading  = require('../models/WeatherReading');



var expect = require('chai').expect;

var weatheritem, weatheritem2; 


describe("First Run DB Tests", function() {
    // Connect to mongodb here before you start testing
    this.timeout(42000);
  before(function (done) {
    mongoose.connect('mongodb://localhost/mytwit', function (error) {
      if (error) throw error; // Handle failed connection
      console.log('conn ready:  '+mongoose.connection.readyState);
      var ddate = new Date(2011,01,28);

      weatheritem = new weatherReading({datelogged: ddate, datelog: '28/01/2011' , dateweather: ddate , daytemp: 12, dayprecip: 12, 
        dayweathertypetext: 'Light rain shower (day)', nighttemp: 1 ,  nightprecip: 1,   nightweathertypetext: 'Light rain', curdate : 1 });
      weatheritem.save();

      var ddate2 = new Date(2011,01,28);
       weatheritem2 = new weatherReading({datelogged: ddate2, datelog: '28/01/2011' , dateweather: ddate2 , daytemp: 12, dayprecip: 12, 
        dayweathertypetext: 'Light rain shower (day)', nighttemp: 1 ,  nightprecip: 1,   nightweathertypetext: 'Light rain', curdate : 1 });
      weatheritem2.save();

      done();
    });
  });

  // And include disconnect afterwards
  after(function (done) {
    weatheritem.remove();
    weatheritem2.remove();
    mongoose.disconnect(done);
  }); 



  it('Should connect to MongoDB', function(done) {
     mongoose.connection.readyState === 1 ? done(): done(false);
  });

  it('Should Find a Result for Date MongoDB', function(done) {
      tweetitemlib.getweathering('28/01/2011', function(result){
        
       // should.exist(result);
        expect(result).to.exist ? done(): done(false);
      });
  });

  it('The Grouping Function should return some data', function(done){
      tweetitemlib.getgrpweather(function(result){

        expect(result).to.exist ? done(): done(false);
      })
  })

  it('This function should call webservice', function(done){
       var today = new Date();
       var dd = today.getDate(); 
       var mm = today.getMonth()+1;
       var yyyy = today.getFullYear(); 
       var datenow = dd + '/' + mm + '/' + yyyy;

      tweetitemlib.retrieveweather(datenow,function(result){
                console.log('retrieve');
                expect(result).to.exist ? done(): done(false);
              });

      });
   });

