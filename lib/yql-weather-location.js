var _ = require("underscore"),
  Q = require("q"),
  superagent = require("superagent");

/*
 * @ yql-weather-location
 * ----------------------------------
 * - TODO: add support for promise; unit test
 */

var YQL = exports;

YQL.config = {
  ENDPOINT: "query.yahooapis.com/v1/public/yql",
    ENV: "http://datatables.org/alltables.env"
};

/**
 * @method exec(query, [params, httpOptions], callback)
 * @description
 * @param {}
 * @returns
 * @example
 */
YQL.exec = function (/*query, [params, httpOptions], callback*/) {
  var args = Array.prototype.slice.call(arguments),
    query = args.shift(), //first -> query
//    callback = args.pop(), //last -> callback
    params = args.shift() || {},
    httpOptions = args.shift() || {ssl: false};
  // Validate
  if (!query) throw new Error("query is not set");
//  if (!callback) throw new Error("callback is not set");

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

  // Run YQL with promise
  var deferred = Q.defer();
  superagent
    .get(url)
    .end(function (err, res) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(res);
//        callback(err, res);
      }
    });

  return deferred.promise;
};

/**
 * @method location(city, callback)
 * @description get location info from city
 * @param {string} city
 * @param {function} callback
 * @returns {array/object} can be array if find mulitple match, based on .count
 */
YQL.location = function (city, callback) {
  // Validate
  if (!city) throw new Error("city is not set");
  if (!callback) throw new Error("callback is not set");

  // Run YQL
  YQL.exec("SELECT * FROM geo.placefinder WHERE text=@city ", {city: city}, function (err, res) {
    callback(err, res);
  });
};

/**
 * @method weather
 * @description get yahoo weather forcast based on givin city (first call location service to get woeid then call weather service), if woeid if given, then directly call weather service
 * @param {object} options : city, [unit]
 * @returns
 */
YQL.weather = function (options, callback) {
  // Validate
  if (!options) throw new Error("params is not set");
  if (!callback) throw new Error("callback is not set");
  if (!_.has(options, "city")) throw new Error("city is not set");

  var city = options.city,
    unit = options.unit ? options.unit : "u";

  var woeid = options.woeid ? options.woeid : "";

  // cache woeid code?
  YQL.location(city, function (err, res) {
    if (err) throw new Error(err);

    var location;
    res = res.body.query;
    if (res.count > 1) {
      location = _.first(res.results.Result)
    } else {
      location = res.results.Result;
    }

    var woeid = location.woeid;

    if (woeid) {
      YQL.exec("SELECT * FROM weather.forecast WHERE woeid=@woeid AND u=@unit", {woeid: woeid, unit: unit}, function (err, res) {
        if (!err) {
          callback(err, res.body.query.results);
        }
      });
    }
  });
};
