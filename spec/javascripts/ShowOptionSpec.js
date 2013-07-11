describe("ShowOption", function() {
  var id;
  var title;
  var showOption;

  beforeEach(function() {
    id = 123;
    title = "Some show title";
    showOption = new ShowOption(id, title);
  });

  it("should accept a title and id on initialization", function() {
    expect(showOption.title).toEqual(title);
    expect(showOption.id).toEqual(id);
  });

  it("should set 'selected' to false by default", function() {
    expect(showOption.selected).toEqual(false);
  });

  it("should set 'selected' to true when 'select()' called", function() {
    // sanity check
    expect(showOption.selected).toEqual(false);

    showOption.select();
    expect(showOption.selected).toEqual(true);
  });

  it("should call 'select' when selected is false and 'changeSelection' called", function() {
    spyOn(showOption, "select");
    // sanity check
    expect(showOption.selected).toEqual(false);

    showOption.changeSelection();
    expect(showOption.select).toHaveBeenCalled();
  });

  it("intializes with no select handlers", function() {
    expect(showOption.selectHandlers).toEqual([]);
  });

  it("registers a select handler", function() {
    var handler = "dummy";
    showOption.registerSelectHandler(handler);
    expect(showOption.selectHandlers).toEqual([handler]);
  });

  it("calls select handlers when 'select' called", function() {
    var functionCalled = false;
    var handler = function(option) {
      if (option) {
        functionCalled = true;
      };
    };
    showOption.registerSelectHandler(handler);
    showOption.select();
    expect(functionCalled).toEqual(true);
  });

  it("should set 'selected' to false when 'deselect()' called", function() {
    showOption.selected = true;
    // sanity check
    expect(showOption.selected).toEqual(true);

    showOption.deselect();
    expect(showOption.selected).toEqual(false);
  });

  it("should call 'deselect' when selected is true and 'changeSelection' called", function() {
    spyOn(showOption, "deselect");
    showOption.selected = true;
    // sanity check
    expect(showOption.selected).toEqual(true);

    showOption.changeSelection();
    expect(showOption.deselect).toHaveBeenCalled();
  });

  it("intializes with no deselect handlers", function() {
    expect(showOption.deselectHandlers).toEqual([]);
  });

  it("registers a deselect handler", function() {
    var handler = "dummy";
    showOption.registerDeselectHandler(handler);
    expect(showOption.deselectHandlers).toEqual([handler]);
  });

  it("calls deselect handlers when 'deselect' called", function() {
    var functionCalled = false;
    var handler = function(option) {
      if (option) {
        functionCalled = true;
      };
    };
    showOption.registerDeselectHandler(handler);
    showOption.deselect();
    expect(functionCalled).toEqual(true);
  });

});
