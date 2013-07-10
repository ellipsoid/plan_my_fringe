describe("TimeUtility", function() {
  var datetime;
  var timeUtility;

  beforeEach(function() {
    datetime = new Date(2012, 11, 9, 4, 5, 36, 314);
    timeUtility = new TimeUtility();
  });

  it("should format a datetime as a time string", function() {
    var timeString = timeUtility.timeStringFor(datetime);
    var expectedTimeString = "04:05"
    expect(timeString).toEqual(expectedTimeString);
  });

  it("should format a datetime as a datetime string", function() {
    var datetimeString = timeUtility.datetimeStringFor(datetime);
    var expected = "Sun Dec 09 2012 04:05";
    expect(datetimeString).toEqual(expected);
  });

});
