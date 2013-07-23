describe("ShowOption", function() {
  var id;
  var title;
  var showOption;
  var firstShowing;
  var secondShowing;
  var thirdShowing;
  var newShowing;

  var mockShowing = function(name) {
    return jasmine.createSpyObj(name, ['addMethodHandler','updateSelectable']);
  };

  var createAndAddMockShowings = function() {
    firstShowing = mockShowing('firstShowing');
    secondShowing = mockShowing('secondShowing');
    thirdShowing = mockShowing('thirdShowing');

    showOption.addShowing(firstShowing);
    showOption.addShowing(secondShowing);
    showOption.addShowing(thirdShowing);

    expect(showOption.showings.length).toBe(3); // sanity check
  };

  beforeEach(function() {
    id = 123;
    title = "Some show title";
    venue = "Some venue";
    showOption = new ShowOption(id, title, venue);
    newShowing = mockShowing('newShowing');
  });

  it("should accept a title, id, and venue on initialization", function() {
    expect(showOption.title).toEqual(title);
    expect(showOption.id).toEqual(id);
    expect(showOption.venue).toEqual(venue);
  });

  it("should have an empty array as 'showings' by default", function() {
    expect(showOption.showings).toEqual([]);
  });

  it("should accept a showing with 'addShowing'", function() {
    showOption.addShowing(newShowing);
    expect(showOption.showings).toEqual([newShowing]);
  });

  // quick test to make sure SelectableOption properties are available

  it("should respond to 'select()'", function() {
    // sanity check
    expect(showOption.selected).toEqual(false);

    showOption.select();
    expect(showOption.selected).toEqual(true);    
  });

  // event handlers

  it("should add select and deselect handlers to showing on 'addShowing'", function() {
    showOption.addShowing(newShowing);

    expect(newShowing.addMethodHandler).toHaveBeenCalledWith("select", showOption.showingSelected);
    expect(newShowing.addMethodHandler).toHaveBeenCalledWith("deselect", showOption.showingDeselected);
  }); 

  // showing selection

  it("defaults to having no selected showing", function() {
    createAndAddMockShowings();
    expect(showOption.selectedShowing).toBe(null);
  });

  it("keeps record of the selected showing", function() {
    createAndAddMockShowings();
    showOption.showingSelected(secondShowing);
    expect(showOption.selectedShowing).toBe(secondShowing);
  });

  it("clears selected showing when selected showing deselected", function() {
    createAndAddMockShowings();
    showOption.showingSelected(secondShowing);
    expect(showOption.selectedShowing).toBe(secondShowing); // sanity check

    showOption.showingDeselected(secondShowing);
    expect(showOption.selectedShowing).toBe(null);
  });

  it("does not clear selected showing when different showing deselected", function() {
    createAndAddMockShowings();
    showOption.showingSelected(secondShowing);
    expect(showOption.selectedShowing).toBe(secondShowing); // sanity check

    showOption.showingDeselected(thirdShowing);
    expect(showOption.selectedShowing).toBe(secondShowing); // selected showing unchanged
  });

  // update Showings

  it("tells showings to updateSelectable when showing selected", function() {
    createAndAddMockShowings();
    showOption.showingSelected(secondShowing);

    expect(firstShowing.updateSelectable).toHaveBeenCalled();    
    // ignore whether second showing is updated, since it's still selectable
    expect(thirdShowing.updateSelectable).toHaveBeenCalled();    
  });

  it("tells showings to updateSelectable when selected showing deselected", function() {
    createAndAddMockShowings();
    showOption.showingSelected(secondShowing);

    showOption.showingDeselected(secondShowing);
    expect(firstShowing.updateSelectable).toHaveBeenCalled();    
    // ignore whether second showing is updated, since it's still selectable
    expect(thirdShowing.updateSelectable).toHaveBeenCalled();    
  });

  // canSelect

  it("returns true for 'canSelect' when showing passed as arg is the selected showing", function() {
    createAndAddMockShowings();
    showOption.showingSelected(secondShowing);

    var result = showOption.canSelect(secondShowing);
    expect(result).toBe(true);
  });

  it("returns false for 'canSelect' when the selected showing does not match argument", function() {
    createAndAddMockShowings();
    showOption.showingSelected(secondShowing);

    var result = showOption.canSelect(thirdShowing);
    expect(result).toBe(false);
  });

  it("returns true for 'canSelect' when no selected showing exists", function() {
    createAndAddMockShowings();
    expect(showOption.selectedShowing).toBe(null); // sanity check

    var result = showOption.canSelect(thirdShowing);
    expect(result).toBe(true);
  });

});
