describe("ShowingOption", function() {
  var id;
  var timeSlot;
  var showOption;

  beforeEach(function() {
    id = 567;
    showOption = jasmine.createSpyObj('showOption', ['canSelect','addShowing','addMethodHandler']);
    timeSlot = jasmine.createSpyObj('timeSlot', ['canSelect','addShowing','addMethodHandler']);
    showingOption = new ShowingOption(id, showOption, timeSlot);
  });

  it("should accept an id, show option, and time option on initialization", function() {
    expect(showingOption.id).toEqual(id);
    expect(showingOption.showOption).toEqual(showOption);
    expect(showingOption.timeSlot).toEqual(timeSlot);
  });

  it("should register itself with show and time on initialization", function() {
    expect(showOption.addShowing).toHaveBeenCalledWith(showingOption);
    expect(timeSlot.addShowing).toHaveBeenCalledWith(showingOption);
  });

  // quick test to make sure SelectableOption properties are available

  it("should respond to 'select()'", function() {
    // sanity check
    expect(showingOption.selected).toEqual(false);

    showingOption.select();
    expect(showingOption.selected).toEqual(true);    
  });

  it("should default 'selectable' to false", function() {
    expect(showingOption.selectable).toEqual(false);
  });

  // updateSelectable

  it("should set 'selectable' to 'true' on 'updateSelectable()' when showOption.canSelect() and timeSlot.canSelect() both return false", function() {
    showOption.canSelect.andCallFake(function(showing) {
      return true;
    });
    timeSlot.canSelect.andCallFake(function(showing) {
      return true;
    });
    showingOption.updateSelectable();
    expect(showOption.canSelect).toHaveBeenCalledWith(showingOption);
    expect(timeSlot.canSelect).toHaveBeenCalledWith(showingOption);
    expect(showingOption.selectable).toEqual(true);
  });

  it("should set 'selectable' to 'false' on 'updateSelectable()' when showOption.canSelect returns false", function() {
    showOption.canSelect.andCallFake(function(showing) {
      return false;
    });
    timeSlot.canSelect.andCallFake(function(showing) {
      return true;
    });
    showingOption.updateSelectable();
    expect(showOption.canSelect).toHaveBeenCalledWith(showingOption);
    // timeSlot not called due to short-circuiting
    expect(showingOption.selectable).toEqual(false);
  });

  it("should set 'selectable' to 'false' on 'updateSelectable()' when timeSlot.canSelect returns false", function() {
    showOption.canSelect.andCallFake(function(showing) {
      return true;
    });
    timeSlot.canSelect.andCallFake(function(showing) {
      return false;
    });
    showingOption.updateSelectable();
    expect(showOption.canSelect).toHaveBeenCalledWith(showingOption);
    expect(timeSlot.canSelect).toHaveBeenCalledWith(showingOption);
    expect(showingOption.selectable).toEqual(false);
  });

  it("should set 'selectable' to 'false' on 'updateSelectable()' when canSelect returns false for both options", function() {
    showOption.canSelect.andCallFake(function(showing) {
      return false;
    });
    timeSlot.canSelect.andCallFake(function(showing) {
      return false;
    });
    showingOption.updateSelectable();
    expect(showOption.canSelect).toHaveBeenCalledWith(showingOption);
    // timeSlot not called due to short-circuiting
    expect(showingOption.selectable).toEqual(false);
  });

  // method handlers

  it("should add select and deselect handlers to show on initialization", function() {
    expect(showOption.addMethodHandler).toHaveBeenCalled();
    expect(showOption.addMethodHandler).toHaveBeenCalled();
  }); 

  it("should add select and deselect handlers to timeSlot on initialization", function() {
    expect(showOption.addMethodHandler).toHaveBeenCalled();
    expect(showOption.addMethodHandler).toHaveBeenCalled();
  }); 

});
