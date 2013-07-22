describe("ShowingOption", function() {
  var timeOption;
  var showOption;

  beforeEach(function() {
    showOption = jasmine.createSpyObj('showOption', ['canSelect']);
    timeOption = jasmine.createSpyObj('timeOption', ['canSelect']);
    showingOption = new ShowingOption(showOption, timeOption);
  });

  it("should accept a show option and time option on initialization", function() {
    expect(showingOption.showOption).toEqual(showOption);
    expect(showingOption.timeOption).toEqual(timeOption);
  });

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

  it("should have 'selected' as false by default", function() {
    expect(showingOption.selected).toEqual(false);
  });

  it("should have 'selected' as true when 'select()' called", function() {
    // sanity check
    expect(showingOption.selected).toEqual(false);

    showingOption.select();
    expect(showingOption.selected).toEqual(true);
  });

  it("should call 'select()' when selected is false and 'changeSelection()' called", function() {
    spyOn(showingOption, "select");
    // sanity check
    expect(showingOption.selected).toEqual(false);

    showingOption.changeSelection();
    expect(showingOption.select).toHaveBeenCalled();
  });

  it("should set 'selected' to false when 'deselect()' called", function() {
    showingOption.selected = true;
    // sanity check
    expect(showingOption.selected).toEqual(true);

    showingOption.deselect();
    expect(showingOption.selected).toEqual(false);
  });

  it("should call 'deselect()' when selected is true and 'changeSelection()' called", function() {
    spyOn(showingOption, "deselect");
    showingOption.selected = true;
    // sanity check
    expect(showingOption.selected).toEqual(true);

    showingOption.changeSelection();
    expect(showingOption.deselect).toHaveBeenCalled();
  });

});
