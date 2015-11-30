'use strict';

var expect = require('chai').expect;
var jsonfile = require('jsonfile');
var jsonT = require('../lib/jsont').jsonT;

describe('cities-jsont', function() {
  var jsonCitiesFileName = null;

  var transformRules = {
    'self': '{ "cities": [{cities}] }',
    'cities[*]': '{ "id": "{$.id}", "name": "{$.name}", ' +
      '"weather": { "currentTemp": {$.main.temp}, "lowTemp": {$.main.temp_min}, ' +
      '"hiTemp": {$.main.temp_max}, "humidity": {$.main.humidity}, ' +
      '"windSpeed": {$.wind.speed}, "summary": "{$.weather[0].main}", ' +
      '"description": "{$.weather[0].description}" } },'
  };

  function repairJson(jsonStr) {
    var repairedJsonStr = jsonStr;

    var repairs = [
      [/,\s*}/gi, ' }'],
      [/,\s*\]/gi, ' ]']
    ];

    for (var i = 0, len = repairs.length; i < len; ++i) {
      repairedJsonStr = repairedJsonStr.replace(repairs[i][0], repairs[i][1]);
    }

    return repairedJsonStr;
  }

  beforeEach(function() {
    var baseDir = __dirname + '/../../data';

    jsonCitiesFileName = baseDir + '/cities-weather-short.json';
  });

  it('should transform cities JSON data', function(done) {
    jsonfile.readFile(jsonCitiesFileName, function(readFileError,
      jsonObj) {
      if (!readFileError) {
        var jsonStr = jsonT(jsonObj, transformRules);

        //console.log(jsonStr);
        jsonStr = repairJson(jsonStr);
        //console.log(repairJson(jsonStr));
        console.log(JSON.stringify(JSON.parse(jsonStr), null, 2));
      } else {
        throw (readFileError);
      }

      done();
    });
  });
});