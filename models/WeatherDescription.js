'use strict';

var mongoose = require('mongoose');

var WeatherDescription = function() {

	var WeatherDescSchema = mongoose.Schema({
		Type: String,
		WeatherDescription: String
	});

	
	return mongoose.model('WeatherDescription', WeatherDescSchema);

};

module.exports = new WeatherDescription();