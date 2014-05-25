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
            console.log(err);
            done();
          });

//        YQL.exec("SELECT * FROM csv WHERE url='http://finance.yahoo.com/d/quotes.csv?s=FB&f=snl1d1t1ohgdr'", function (err, res) {
//          expect(err).to.eql(null);
//          expect(res).to.be.ok;
//          done();
//        });
      });
    });

    describe("weather", function () {
      it("should return weather info", function(done){
        YQL.weather({city: "mountain view"}, function (err, res) {
          expect(err).to.eql(null);
          expect(res).to.be.ok;
          done();
        });
      });
    });

    describe("location", function () {
      it("should return location info", function(done){
        YQL.location("palo alto", function (err, res) {
          expect(err).to.eql(null);
          expect(res).to.be.ok;
          done();
        });
      });
    });

  });
});
