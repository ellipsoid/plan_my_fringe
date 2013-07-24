describe("Selectable", function() {
  var object;
  var handler;

  beforeEach(function() {
    object = new Selectable();
    handler = jasmine.createSpy('handler');
  });

  // initialization

  it("should set 'selected' to false by default", function() {
    expect(object.selected).toEqual(false);
  });

  it("should set 'selectable' to false by default", function() {
    expect(object.selectable).toEqual(false);
  });

  it("intializes with empty lists of method handlers for methods", function() {
    expect(object.methodHandlers["select"]).toEqual([]);
    expect(object.methodHandlers["deselect"]).toEqual([]);
  });

  // selection

  it("should set 'selected' to 'true' when 'select()' called", function() {
    // sanity check
    expect(object.selected).toEqual(false);

    object.select();
    expect(object.selected).toEqual(true);
  });

  it("should set 'selected' to 'false' when 'deselect()' called", function() {
    object.select();
    // sanity check
    expect(object.selected).toEqual(true);

    object.deselect();
    expect(object.selected).toEqual(false);
  });

  it("should flip selected from false to true when 'invertSelection' called", function() {
    // sanity check
    expect(object.selected).toEqual(false);

    object.invertSelection();
    expect(object.selected).toEqual(true);
  });

  it("should flip selected from true to false when 'invertSelection' called", function() {
    // sanity check
    expect(object.selected).toEqual(false);

    object.invertSelection();
    expect(object.selected).toEqual(true);
  });

  // selectable

  it("should set 'selectable' to 'true' when 'makeSelectable()' called", function() {
    object.makeSelectable();
    expect(object.selectable).toEqual(true);
  });

  it("should set 'selectable' to 'false' when 'makeUnselectable()' called", function() {
    object.makeSelectable();
    expect(object.selectable).toEqual(true); // sanity check

    object.makeUnselectable();
    expect(object.selectable).toEqual(false);
  });

  it("should call 'deselect()' when 'makeUnselectable()' called, if selected is true", function() {
    object.makeSelectable();
    object.select();
    object.addMethodHandler("deselect", handler);

    expect(object.selected).toEqual(true);

    object.makeUnselectable();
    expect(object.selected).toEqual(false);
    expect(handler).toHaveBeenCalledWith(object);
  });

  // method handlers

  // select
  it("registers a handler on 'select' method", function() {
    object.addMethodHandler("select", handler);
    expect(object.methodHandlers["select"]).toEqual([handler]);
  });

  it("calls 'select' handler when 'select()' called", function() {
    object.addMethodHandler("select", handler);
    object.select();
    expect(handler).toHaveBeenCalledWith(object);
  });

  it("calls 'select' handler when 'invertSelection' makes 'selected' true", function() {
    object.deselect();

    object.addMethodHandler("select", handler);
    object.invertSelection();
    expect(handler).toHaveBeenCalledWith(object);
  });

  // deselect
  it("registers a handler on 'deselect' method", function() {
    object.addMethodHandler("deselect", handler);
    expect(object.methodHandlers["deselect"]).toEqual([handler]);
  });

  it("calls 'deselect' handler when 'deselect()' called", function() {
    object.addMethodHandler("deselect", handler);
    object.deselect();
    expect(handler).toHaveBeenCalledWith(object);
  });

  it("calls 'deselect' handler when 'invertSelection' makes 'selected' false", function() {
    object.select();
    object.addMethodHandler("deselect", handler);
    object.invertSelection();
    expect(handler).toHaveBeenCalledWith(object);
  });

});
