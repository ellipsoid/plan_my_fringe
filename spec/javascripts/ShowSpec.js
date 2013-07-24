describe("Show", function() {
  var id;
  var title;
  var show;
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

    show.addShowing(firstShowing);
    show.addShowing(secondShowing);
    show.addShowing(thirdShowing);

    expect(show.showings.length).toBe(3); // sanity check
  };

  beforeEach(function() {
    id = 123;
    title = "Some show title";
    venue = "Some venue";
    show = new Show(id, title, venue);
    newShowing = mockShowing('newShowing');
  });

  it("should accept a title, id, and venue on initialization", function() {
    expect(show.title).toEqual(title);
    expect(show.id).toEqual(id);
    expect(show.venue).toEqual(venue);
  });

  it("should have an empty array as 'showings' by default", function() {
    expect(show.showings).toEqual([]);
  });

  it("should accept a showing with 'addShowing'", function() {
    show.addShowing(newShowing);
    expect(show.showings).toEqual([newShowing]);
  });

  // quick test to make sure SelectableOption properties are available

  it("should respond to 'select()'", function() {
    // sanity check
    expect(show.selected).toEqual(false);

    show.select();
    expect(show.selected).toEqual(true);    
  });

  it("should default 'selectable' to 'true'", function() {
    expect(show.selectable).toBe(true);
  });

  // event handlers

  it("should add select and deselect handlers to showing on 'addShowing'", function() {
    show.addShowing(newShowing);

    expect(newShowing.addMethodHandler).toHaveBeenCalled();
    expect(newShowing.addMethodHandler).toHaveBeenCalled();
  }); 

  // showing selection

  it("defaults to having no selected showing", function() {
    createAndAddMockShowings();
    expect(show.selectedShowing).toBe(null);
  });

  it("keeps record of the selected showing", function() {
    createAndAddMockShowings();
    show.showingSelected(secondShowing);
    expect(show.selectedShowing).toBe(secondShowing);
  });

  it("clears selected showing when selected showing deselected", function() {
    createAndAddMockShowings();
    show.showingSelected(secondShowing);
    expect(show.selectedShowing).toBe(secondShowing); // sanity check

    show.showingDeselected(secondShowing);
    expect(show.selectedShowing).toBe(null);
  });

  it("does not clear selected showing when different showing deselected", function() {
    createAndAddMockShowings();
    show.showingSelected(secondShowing);
    expect(show.selectedShowing).toBe(secondShowing); // sanity check

    show.showingDeselected(thirdShowing);
    expect(show.selectedShowing).toBe(secondShowing); // selected showing unchanged
  });

  // update Showings

  it("tells showings to updateSelectable when showing selected", function() {
    createAndAddMockShowings();
    show.showingSelected(secondShowing);

    expect(firstShowing.updateSelectable).toHaveBeenCalled();    
    // ignore whether second showing is updated, since it's still selectable
    expect(thirdShowing.updateSelectable).toHaveBeenCalled();    
  });

  it("tells showings to updateSelectable when selected showing deselected", function() {
    createAndAddMockShowings();
    show.showingSelected(secondShowing);

    show.showingDeselected(secondShowing);
    expect(firstShowing.updateSelectable).toHaveBeenCalled();    
    // ignore whether second showing is updated, since it's still selectable
    expect(thirdShowing.updateSelectable).toHaveBeenCalled();    
  });

  // canSelect

  it("returns 'false' for 'canSelect' when 'selected' is false and showing passed as arg is the selected showing", function() {
    createAndAddMockShowings();
    expect(show.selected).toBe(false); // sanity check
    show.showingSelected(secondShowing);

    var result = show.canSelect(secondShowing);
    expect(result).toBe(false);
  });

  it("returns 'false' for 'canSelect' when 'selected' is false and showing passed as arg is not the selected showing", function() {
    createAndAddMockShowings();
    expect(show.selected).toBe(false); // sanity check
    show.showingSelected(secondShowing);

    var result = show.canSelect(thirdShowing);
    expect(result).toBe(false);
  });

  it("returns 'false' for 'canSelect' when 'selected' is false and selectedShowing null", function() {
    createAndAddMockShowings();
    expect(show.selected).toBe(false); // sanity check
    expect(show.selectedShowing).toBe(null); // sanity check

    var result = show.canSelect(secondShowing);
    expect(result).toBe(false);
  });

  it("returns true for 'canSelect' when show selected and showing passed as arg is the selected showing", function() {
    createAndAddMockShowings();
    show.select();
    show.showingSelected(secondShowing);

    var result = show.canSelect(secondShowing);
    expect(result).toBe(true);
  });

  it("returns false for 'canSelect' when show selected and the selected showing does not match argument", function() {
    createAndAddMockShowings();
    show.select();
    show.showingSelected(secondShowing);

    var result = show.canSelect(thirdShowing);
    expect(result).toBe(false);
  });

  it("returns true for 'canSelect' when show selected and no selected showing exists", function() {
    createAndAddMockShowings();
    show.select();
    expect(show.selectedShowing).toBe(null); // sanity check

    var result = show.canSelect(thirdShowing);
    expect(result).toBe(true);
  });

});
