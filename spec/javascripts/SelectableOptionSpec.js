describe("SelectableOption", function() {
  var option;
  var handler;

  beforeEach(function() {
    option = new SelectableOption();
    handler = jasmine.createSpy('handler');
  });

  // initialization

  it("should set 'selected' to false by default", function() {
    expect(option.selected).toEqual(false);
  });

  it("should set 'selectable' to false by default", function() {
    expect(option.selectable).toEqual(false);
  });

  it("intializes with empty lists of method handlers for methods", function() {
    expect(option.methodHandlers["select"]).toEqual([]);
    expect(option.methodHandlers["deselect"]).toEqual([]);
  });

  // selection

  it("should set 'selected' to 'true' when 'select()' called", function() {
    // sanity check
    expect(option.selected).toEqual(false);

    option.select();
    expect(option.selected).toEqual(true);
  });

  it("should set 'selected' to 'false' when 'deselect()' called", function() {
    option.select();
    // sanity check
    expect(option.selected).toEqual(true);

    option.deselect();
    expect(option.selected).toEqual(false);
  });

  it("should flip selected from false to true when 'invertSelection' called", function() {
    // sanity check
    expect(option.selected).toEqual(false);

    option.invertSelection();
    expect(option.selected).toEqual(true);
  });

  it("should flip selected from true to false when 'invertSelection' called", function() {
    // sanity check
    expect(option.selected).toEqual(false);

    option.invertSelection();
    expect(option.selected).toEqual(true);
  });

  // selectable

  it("should set 'selectable' to 'true' when 'makeSelectable()' called", function() {
    option.makeSelectable();
    expect(option.selectable).toEqual(true);
  });

  it("should set 'selectable' to 'false' when 'makeUnselectable()' called", function() {
    option.makeSelectable();
    expect(option.selectable).toEqual(true); // sanity check

    option.makeUnselectable();
    expect(option.selectable).toEqual(false);
  });

  it("should call 'deselect()' when 'makeUnselectable()' called, if selected is true", function() {
    option.makeSelectable();
    option.select();
    option.addMethodHandler("deselect", handler);

    expect(option.selected).toEqual(true);

    option.makeUnselectable();
    expect(option.selected).toEqual(false);
    expect(handler).toHaveBeenCalledWith(option);
  });

  // method handlers

  // select
  it("registers a handler on 'select' method", function() {
    option.addMethodHandler("select", handler);
    expect(option.methodHandlers["select"]).toEqual([handler]);
  });

  it("calls 'select' handler when 'select()' called", function() {
    option.addMethodHandler("select", handler);
    option.select();
    expect(handler).toHaveBeenCalledWith(option);
  });

  it("calls 'select' handler when 'invertSelection' makes 'selected' true", function() {
    option.deselect();

    option.addMethodHandler("select", handler);
    option.invertSelection();
    expect(handler).toHaveBeenCalledWith(option);
  });

  // deselect
  it("registers a handler on 'deselect' method", function() {
    option.addMethodHandler("deselect", handler);
    expect(option.methodHandlers["deselect"]).toEqual([handler]);
  });

  it("calls 'deselect' handler when 'deselect()' called", function() {
    option.addMethodHandler("deselect", handler);
    option.deselect();
    expect(handler).toHaveBeenCalledWith(option);
  });

  it("calls 'deselect' handler when 'invertSelection' makes 'selected' false", function() {
    option.select();
    option.addMethodHandler("deselect", handler);
    option.invertSelection();
    expect(handler).toHaveBeenCalledWith(option);
  });

});
