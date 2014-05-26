var _ = require("underscore"),
  Q = require("q"),
  superagent = require("superagent");

/*
 * @ yql-weather-location
 * ----------------------------------
 * TODO: add Redis cache option
 */
var YQL = exports;
YQL.config = {
  ENDPOINT: "query.yahooapis.com/v1/public/yql",
    ENV: "http://datatables.org/alltables.env"
};

/**
 * @method exec(query, [params, httpOptions])
 * @description run YQL with promise
 * @param {string} query
 * @param {object} [params]
 * @param {object} [httpOptions]
 */
YQL.exec = function (/*query, [params, httpOptions]*/) {
  var args = Array.prototype.slice.call(arguments),
    query = args.shift(), //first -> query
    params = args.shift() || {},
    httpOptions = args.shift() || {ssl: false};
  // Validate
  if (!query) throw new Error("query is not set");

  // YQL required params
  params.q = query;
  params.env = YQL.config.ENV;
  params.format = "json"; //set json as default

  // Construct url
  var url = (httpOptions.ssl ? "https" : "http") + "://" + YQL.config.ENDPOINT + "?";
  query = "";
  _.each(params, function (value, key) {
    query += key + "=" + encodeURIComponent(value) + "&";
  });
  url += query;
  url = url.substring(0, url.length - 1);

  // Run YQL w promise
  var deferred = Q.defer();
  superagent
    .get(url)
    .end(function (err, res) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(res.body); //return body
      }
    });

  return deferred.promise;
};

/**
 * @method location(city)
 * @description get location info from city w promise
 * @param {string} city
 */
YQL.location = function (city) {
  // Validate
  if (!city) throw new Error("city is not set");

  // Run YQL w promise
  var deferred = Q.defer();
  YQL.exec("SELECT * FROM geo.placefinder WHERE text=@city ", {city: city})
    .then(function (res) {
      deferred.resolve(res);
    }, function (err) {
      deferred.reject(err);
    });
  return deferred.promise;
};

/**
 * @method weather(options)
 * @description get yahoo weather forcast based on givin city w promise(first call location service to get woeid then call weather service), if woeid if given, then directly call weather service
 * @param {object} options : city, [unit]
 */
YQL.weather = function (options) {
  // Validate
  if (!options) throw new Error("params is not set");
  if (!_.has(options, "city") && !_.has(options, "woeid")) throw new Error("city or woeid is not set");

  var city = options.city,
    woeid = options.woeid,
    unit = options.unit ? options.unit : "u",
    deferred = Q.defer();
  if (woeid) {
    _getWeather(woeid, unit);
  } else {
    // get woeid
    YQL.location(city)
      .then(function (res) {
        res = res.query;
        if (res.count > 1) {
          res = _.first(res.results.Result);
        } else {
          res = res.results.Result;
        }
        var woeid = res.woeid;
        if (woeid) {
          _getWeather(woeid, unit);
        }
      }, function (err) {
        throw new Error(err);
      });
  }

  function _getWeather(woeid, unit) {
    YQL.exec("SELECT * FROM weather.forecast WHERE woeid=@woeid AND u=@unit", {woeid: woeid, unit: unit})
      .then(function (res) {
        deferred.resolve(res);
      }, function (err) {
        deferred.reject(err);
      });
  };

  return deferred.promise;
};


