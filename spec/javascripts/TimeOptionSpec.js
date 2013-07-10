describe("TimeOption", function() {
  var datetime;
  var timeOption;
  var timeUtility;

  beforeEach(function() {
    datetime = new Date(2012, 11, 9, 4, 5, 36, 314);
    timeUtility = new TimeUtility();
    timeOption = new TimeOption(datetime, timeUtility);
  });

  it("should accept a datetime on initialization", function() {
    expect(timeOption.datetime).toEqual(datetime);
  });

  it("should accept a timeUtility on initialization", function() {
    expect(timeOption.timeUtility).toEqual(timeUtility);
  });

  it("should return time string", function() {
    expect(timeOption.timeString()).toEqual("04:05");
  });

  it("should return datetime string", function() {
    expect(timeOption.datetimeString()).toEqual("Sun Dec 09 2012 04:05");
  });

});
