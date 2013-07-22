describe("TimeOption", function() {
  var id;
  var datetime;
  var timeOption;
  var timeUtility;

  beforeEach(function() {
    id = 456;
    datetime = new Date(2012, 11, 9, 4, 5, 36, 314);
    timeUtility = new TimeUtility();
    timeOption = new TimeOption(id, datetime, timeUtility);
  });

  it("should accept an id on initialization", function() {
    expect(timeOption.id).toEqual(id);
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

  it("should have an empty array as 'showings' by default", function() {
    expect(timeOption.showings).toEqual([]);
  });

  it("should accept a showing with 'addShowing'", function() {
    var showing = "dummy showing";
    timeOption.addShowing(showing);
    expect(timeOption.showings).toEqual([showing]);
  });

  it("should set 'selected' to false by default", function() {
    expect(timeOption.selected).toEqual(false);
  });

  it("should set 'selected' to true when 'select()' called", function() {
    // sanity check
    expect(timeOption.selected).toEqual(false);

    timeOption.select();
    expect(timeOption.selected).toEqual(true);
  });

  it("should call 'select' when selected is false and 'changeSelection' called", function() {
    spyOn(timeOption, "select");
    // sanity check
    expect(timeOption.selected).toEqual(false);

    timeOption.changeSelection();
    expect(timeOption.select).toHaveBeenCalled();
  });

  it("intializes with no select handlers", function() {
    expect(timeOption.selectHandlers).toEqual([]);
  });

  it("registers a select handler", function() {
    var handler = "dummy";
    timeOption.registerSelectHandler(handler);
    expect(timeOption.selectHandlers).toEqual([handler]);
  });

  it("calls select handlers when 'select' called", function() {
    var functionCalled = false;
    var handler = function(option) {
      if (option) {
        functionCalled = true;
      };
    };
    timeOption.registerSelectHandler(handler);
    timeOption.select();
    expect(functionCalled).toEqual(true);
  });

  it("should set 'selected' to false when 'deselect()' called", function() {
    timeOption.selected = true;
    // sanity check
    expect(timeOption.selected).toEqual(true);

    timeOption.deselect();
    expect(timeOption.selected).toEqual(false);
  });

  it("should call 'deselect' when selected is true and 'changeSelection' called", function() {
    spyOn(timeOption, "deselect");
    timeOption.selected = true;
    // sanity check
    expect(timeOption.selected).toEqual(true);

    timeOption.changeSelection();
    expect(timeOption.deselect).toHaveBeenCalled();
  });

  it("intializes with no deselect handlers", function() {
    expect(timeOption.deselectHandlers).toEqual([]);
  });

  it("registers a deselect handler", function() {
    var handler = "dummy";
    timeOption.registerDeselectHandler(handler);
    expect(timeOption.deselectHandlers).toEqual([handler]);
  });

  it("calls deselect handlers when 'deselect' called", function() {
    var functionCalled = false;
    var handler = function(option) {
      if (option) {
        functionCalled = true;
      };
    };
    timeOption.registerDeselectHandler(handler);
    timeOption.deselect();
    expect(functionCalled).toEqual(true);
  });

});
