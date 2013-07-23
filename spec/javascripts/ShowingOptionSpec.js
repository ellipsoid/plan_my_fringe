describe("ShowingOption", function() {
  var id;
  var timeOption;
  var showOption;

  beforeEach(function() {
    id = 567;
    showOption = jasmine.createSpyObj('showOption', ['canSelect','addShowing']);
    timeOption = jasmine.createSpyObj('timeOption', ['canSelect','addShowing']);
    showingOption = new ShowingOption(id, showOption, timeOption);
  });

  it("should accept an id, show option, and time option on initialization", function() {
    expect(showingOption.id).toEqual(id);
    expect(showingOption.showOption).toEqual(showOption);
    expect(showingOption.timeOption).toEqual(timeOption);
  });

  it("should register itself with show and time on initialization", function() {
    expect(showOption.addShowing).toHaveBeenCalledWith(showingOption);
    expect(timeOption.addShowing).toHaveBeenCalledWith(showingOption);
  });

  // quick test to make sure SelectableOption properties are available

  it("should respond to 'select()'", function() {
    // sanity check
    expect(showingOption.selected).toEqual(false);

    showingOption.select();
    expect(showingOption.selected).toEqual(true);    
  });

  // updateSelectable

  it("should set 'selectable' to 'true' on 'updateSelectable()' when showOption.canSelect() and timeOption.canSelect() both return false", function() {
    showOption.canSelect.andCallFake(function(showing) {
      return true;
    });
    timeOption.canSelect.andCallFake(function(showing) {
      return true;
    });
    showingOption.updateSelectable();
    expect(showOption.canSelect).toHaveBeenCalledWith(showingOption);
    expect(timeOption.canSelect).toHaveBeenCalledWith(showingOption);
    expect(showingOption.selectable).toEqual(true);
  });

  it("should set 'selectable' to 'false' on 'updateSelectable()' when showOption.canSelect returns false", function() {
    showOption.canSelect.andCallFake(function(showing) {
      return false;
    });
    timeOption.canSelect.andCallFake(function(showing) {
      return true;
    });
    showingOption.updateSelectable();
    expect(showOption.canSelect).toHaveBeenCalledWith(showingOption);
    // timeOption not called due to short-circuiting
    expect(showingOption.selectable).toEqual(false);
  });

  it("should set 'selectable' to 'false' on 'updateSelectable()' when timeOption.canSelect returns false", function() {
    showOption.canSelect.andCallFake(function(showing) {
      return true;
    });
    timeOption.canSelect.andCallFake(function(showing) {
      return false;
    });
    showingOption.updateSelectable();
    expect(showOption.canSelect).toHaveBeenCalledWith(showingOption);
    expect(timeOption.canSelect).toHaveBeenCalledWith(showingOption);
    expect(showingOption.selectable).toEqual(false);
  });

  it("should set 'selectable' to 'false' on 'updateSelectable()' when canSelect returns false for both options", function() {
    showOption.canSelect.andCallFake(function(showing) {
      return false;
    });
    timeOption.canSelect.andCallFake(function(showing) {
      return false;
    });
    showingOption.updateSelectable();
    expect(showOption.canSelect).toHaveBeenCalledWith(showingOption);
    // timeOption not called due to short-circuiting
    expect(showingOption.selectable).toEqual(false);
  });

});
