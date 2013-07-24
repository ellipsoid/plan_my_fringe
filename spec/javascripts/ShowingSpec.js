describe("Showing", function() {
  var id;
  var timeSlot;
  var show;

  beforeEach(function() {
    id = 567;
    show = jasmine.createSpyObj('show', ['canSelect','addShowing','addMethodHandler']);
    timeSlot = jasmine.createSpyObj('timeSlot', ['canSelect','addShowing','addMethodHandler']);
    showing = new Showing(id, show, timeSlot);
  });

  it("should accept an id, show option, and time option on initialization", function() {
    expect(showing.id).toEqual(id);
    expect(showing.show).toEqual(show);
    expect(showing.timeSlot).toEqual(timeSlot);
  });

  it("should register itself with show and time on initialization", function() {
    expect(show.addShowing).toHaveBeenCalledWith(showing);
    expect(timeSlot.addShowing).toHaveBeenCalledWith(showing);
  });

  // quick test to make sure Selectable properties are available

  it("should respond to 'select()'", function() {
    // sanity check
    expect(showing.selected).toEqual(false);

    showing.select();
    expect(showing.selected).toEqual(true);    
  });

  it("should default 'selectable' to false", function() {
    expect(showing.selectable).toEqual(false);
  });

  // updateSelectable

  it("should set 'selectable' to 'true' on 'updateSelectable()' when show.canSelect() and timeSlot.canSelect() both return false", function() {
    show.canSelect.andCallFake(function(showing) {
      return true;
    });
    timeSlot.canSelect.andCallFake(function(showing) {
      return true;
    });
    showing.updateSelectable();
    expect(show.canSelect).toHaveBeenCalledWith(showing);
    expect(timeSlot.canSelect).toHaveBeenCalledWith(showing);
    expect(showing.selectable).toEqual(true);
  });

  it("should set 'selectable' to 'false' on 'updateSelectable()' when show.canSelect returns false", function() {
    show.canSelect.andCallFake(function(showing) {
      return false;
    });
    timeSlot.canSelect.andCallFake(function(showing) {
      return true;
    });
    showing.updateSelectable();
    expect(show.canSelect).toHaveBeenCalledWith(showing);
    // timeSlot not called due to short-circuiting
    expect(showing.selectable).toEqual(false);
  });

  it("should set 'selectable' to 'false' on 'updateSelectable()' when timeSlot.canSelect returns false", function() {
    show.canSelect.andCallFake(function(showing) {
      return true;
    });
    timeSlot.canSelect.andCallFake(function(showing) {
      return false;
    });
    showing.updateSelectable();
    expect(show.canSelect).toHaveBeenCalledWith(showing);
    expect(timeSlot.canSelect).toHaveBeenCalledWith(showing);
    expect(showing.selectable).toEqual(false);
  });

  it("should set 'selectable' to 'false' on 'updateSelectable()' when canSelect returns false for both options", function() {
    show.canSelect.andCallFake(function(showing) {
      return false;
    });
    timeSlot.canSelect.andCallFake(function(showing) {
      return false;
    });
    showing.updateSelectable();
    expect(show.canSelect).toHaveBeenCalledWith(showing);
    // timeSlot not called due to short-circuiting
    expect(showing.selectable).toEqual(false);
  });

  // method handlers

  it("should add select and deselect handlers to show on initialization", function() {
    expect(show.addMethodHandler).toHaveBeenCalled();
    expect(show.addMethodHandler).toHaveBeenCalled();
  }); 

  it("should add select and deselect handlers to timeSlot on initialization", function() {
    expect(show.addMethodHandler).toHaveBeenCalled();
    expect(show.addMethodHandler).toHaveBeenCalled();
  }); 

});
