'use strict';

var mongoose = require('mongoose');

var WeatherReading = function() {

	var WeatherReadingSchema = mongoose.Schema({
		datelog: String,
		datelogged: Date,
		dateweather: Date,
		daytemp: Number,
		dayprecip: Number,
		dayweathertype: String,
		dayweathertypetext: String,
		nighttemp: Number,
		nightprecip: Number,
		nightweathertype:String,
		nightweathertypetext:String,
		curdate:Number

	});

	WeatherReadingSchema
		.index({datelog:1, datelogged:1})
		
						
	return mongoose.model('WeatherReading', WeatherReadingSchema);

};

module.exports = new WeatherReading();