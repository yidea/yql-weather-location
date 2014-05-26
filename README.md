yql-weather-location
==================

A NPM util for easier YQL(Yahoo Query Language) with Q Promise in nodejs, also provides helper for getting location and weather.  
- YQL console: https://developer.yahoo.com/yql/console/
- Documentation: http://developer.yahoo.com/yql/guide/

## Dependency

Q, Superagent, Underscore

## Installation

```js
npm install yql-weather-location
```

## TODO

- use redis as option for caching?
- add more docs and tests 
- add CI 

## Usage 

```js
var YQL = require("yql-weather-location");

// YQL.exec(query, [params, httpOptions])
YQL.exec("SELECT * FROM csv WHERE url='http://finance.yahoo.com/d/quotes.csv?s=FB&f=snl1d1t1ohgdr'")
  .then(function (res) {
    expect(res).to.be.ok;
  }, function (err) {
    console.log(err);
  });

// YQL.location(city)
YQL.location("palo alto")
  .then(function (res) {
    expect(res).to.be.ok;
  });
  
// YQL.weather(options)
// - if only knows the city (will first call YQL.location to get woeid, then call weather service)
YQL.weather({city: "mountain view", unit="c"})
  .then(function (res) {
    expect(res).to.be.ok;
  });
  
// - if knows woeid
YQL.weather({woeid: "2455920"})
  .then(function (res) {
    expect(res).to.be.ok;
  });
```

## API
 
Soon.. 

License (MIT)
-------------

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
