describe("ShowingOption", function() {
  var timeOption;
  var showOption;

  beforeEach(function() {
    showOption = "dummy show option";
    timeOption = "dummy time option";
    showingOption = new ShowingOption(showOption, timeOption);
  });

  it("should accept a show option and time option on initialization", function() {
    expect(showingOption.showOption).toEqual(showOption);
    expect(showingOption.timeOption).toEqual(timeOption);
  });

  it("should set 'selected' to false by default", function() {
    expect(showingOption.selected).toEqual(false);
  });

  it("should set 'selected' to true when 'select()' called", function() {
    // sanity check
    expect(showingOption.selected).toEqual(false);

    showingOption.select();
    expect(showingOption.selected).toEqual(true);
  });

  it("should call 'select' when selected is false and 'changeSelection' called", function() {
    spyOn(showingOption, "select");
    // sanity check
    expect(showingOption.selected).toEqual(false);

    showingOption.changeSelection();
    expect(showingOption.select).toHaveBeenCalled();
  });

  it("intializes with no select handlers", function() {
    expect(showingOption.selectHandlers).toEqual([]);
  });

  it("registers a select handler", function() {
    var handler = "dummy";
    showingOption.registerSelectHandler(handler);
    expect(showingOption.selectHandlers).toEqual([handler]);
  });

  it("calls select handlers when 'select' called", function() {
    var functionCalled = false;
    var handler = function(option) {
      if (option) {
        functionCalled = true;
      };
    };
    showingOption.registerSelectHandler(handler);
    showingOption.select();
    expect(functionCalled).toEqual(true);
  });

  it("should set 'selected' to false when 'deselect()' called", function() {
    showingOption.selected = true;
    // sanity check
    expect(showingOption.selected).toEqual(true);

    showingOption.deselect();
    expect(showingOption.selected).toEqual(false);
  });

  it("should call 'deselect' when selected is true and 'changeSelection' called", function() {
    spyOn(showingOption, "deselect");
    showingOption.selected = true;
    // sanity check
    expect(showingOption.selected).toEqual(true);

    showingOption.changeSelection();
    expect(showingOption.deselect).toHaveBeenCalled();
  });

  it("intializes with no deselect handlers", function() {
    expect(showingOption.deselectHandlers).toEqual([]);
  });

  it("registers a deselect handler", function() {
    var handler = "dummy";
    showingOption.registerDeselectHandler(handler);
    expect(showingOption.deselectHandlers).toEqual([handler]);
  });

  it("calls deselect handlers when 'deselect' called", function() {
    var functionCalled = false;
    var handler = function(option) {
      if (option) {
        functionCalled = true;
      };
    };
    showingOption.registerDeselectHandler(handler);
    showingOption.deselect();
    expect(functionCalled).toEqual(true);
  });

});
