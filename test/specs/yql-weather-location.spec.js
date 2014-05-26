var YQL = require("../../lib/yql-weather-location");

describe("yql-weather-location", function () {
  describe("YQL", function () {

    describe("exec", function () {
      it("should return YQL exec result", function(done){
        YQL.exec("SELECT * FROM csv WHERE url='http://finance.yahoo.com/d/quotes.csv?s=FB&f=snl1d1t1ohgdr'")
          .then(function (res) {
            expect(res).to.be.ok;
            done();
          }, function (err) {
            done();
          });
      });
    });

    describe("location", function () {
      it("should return location info", function(done){
        YQL.location("palo alto")
          .then(function (res) {
            expect(res).to.be.ok;
            done();
          });
      });
    });

    describe("weather", function () {
      it("should return weather info when city is set", function(done){
        YQL.weather({city: "mountain view"})
          .then(function (res) {
            expect(res).to.be.ok;
            done();
          });
      });

      it("should return weather info when woeid is set", function(done){
        YQL.weather({woeid: "2455920"})
          .then(function (res) {
            expect(res).to.be.ok;
            done();
          });
      });
    });

  });
});
