describe("TimeSlot", function() {
  var id;
  var calendarDate;
  var timeOfDay;
  var timeSlot;
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

    timeSlot.addShowing(firstShowing);
    timeSlot.addShowing(secondShowing);
    timeSlot.addShowing(thirdShowing);

    expect(timeSlot.showings.length).toBe(3); // sanity check
  };

  beforeEach(function() {
    id = 456;
    calendarDate = jasmine.createSpyObj('calendarDate',['addTimeSlot','toString']);
    timeOfDay = jasmine.createSpyObj('timeOfDay',['addTimeSlot','toString']);
    timeSlot = new TimeSlot(id, calendarDate, timeOfDay);
    newShowing = mockShowing('newShowing');
  });

  it("should accept an id on initialization", function() {
    expect(timeSlot.id).toEqual(id);
  });

  it("should accept a calendarDate on initialization", function() {
    expect(timeSlot.calendarDate).toEqual(calendarDate);
  });

  it("should accept a timeOfDay on initialization", function() {
    expect(timeSlot.timeOfDay).toEqual(timeOfDay);
  });

  it("should have an empty array of 'showings' by default", function() {
    expect(timeSlot.showings).toEqual([]);
  });

  it("should accept a showing with 'addShowing'", function() {
    timeSlot.addShowing(newShowing);
    expect(timeSlot.showings).toEqual([newShowing]);
  });

  it("should register itself with calendarDate and timeOfDay on initialization", function() {
    expect(calendarDate.addTimeSlot).toHaveBeenCalledWith(timeSlot);
    expect(timeOfDay.addTimeSlot).toHaveBeenCalledWith(timeSlot);
  });

  it("should forward 'timeString' calls to timeOfDay 'toString' method", function() {
    timeOfDay.toString.andCallFake(function() { return "5:30 PM" });
    expect(timeSlot.timeString()).toEqual("5:30 PM");
  });

  it("should forward 'dateString' calls to calendarDate 'toString' method", function() {
    calendarDate.toString.andCallFake(function() { return "Aug 1, 2013" });
    expect(timeSlot.dateString()).toEqual("Aug 1, 2013");
  });

  // quick test to make sure SelectableOption properties are available

  it("should respond to 'select()'", function() {
    // sanity check
    expect(timeSlot.selected).toEqual(false);

    timeSlot.select();
    expect(timeSlot.selected).toEqual(true);    
  });

  // event handlers

  it("should add select and deselect handlers to showing on 'addShowing'", function() {
    timeSlot.addShowing(newShowing);

    expect(newShowing.addMethodHandler).toHaveBeenCalledWith("select", timeSlot.showingSelected);
    expect(newShowing.addMethodHandler).toHaveBeenCalledWith("deselect", timeSlot.showingDeselected);
  }); 

  // showing selection

  it("defaults to having no selected showing", function() {
    createAndAddMockShowings();
    expect(timeSlot.selectedShowing).toBe(null);
  });

  it("keeps record of the selected showing", function() {
    createAndAddMockShowings();
    timeSlot.showingSelected(secondShowing);
    expect(timeSlot.selectedShowing).toBe(secondShowing);
  });

  it("clears selected showing when selected showing deselected", function() {
    createAndAddMockShowings();
    timeSlot.showingSelected(secondShowing);
    expect(timeSlot.selectedShowing).toBe(secondShowing); // sanity check

    timeSlot.showingDeselected(secondShowing);
    expect(timeSlot.selectedShowing).toBe(null);
  });

  it("does not clear selected showing when different showing deselected", function() {
    createAndAddMockShowings();
    timeSlot.showingSelected(secondShowing);
    expect(timeSlot.selectedShowing).toBe(secondShowing); // sanity check

    timeSlot.showingDeselected(thirdShowing);
    expect(timeSlot.selectedShowing).toBe(secondShowing); // selected showing unchanged
  });

  // update Showings

  it("tells showings to updateSelectable when showing selected", function() {
    createAndAddMockShowings();
    timeSlot.showingSelected(secondShowing);

    expect(firstShowing.updateSelectable).toHaveBeenCalled();    
    // ignore whether second showing is updated, since it's still selectable
    expect(thirdShowing.updateSelectable).toHaveBeenCalled();    
  });

  it("tells showings to updateSelectable when selected showing deselected", function() {
    createAndAddMockShowings();
    timeSlot.showingSelected(secondShowing);

    timeSlot.showingDeselected(secondShowing);
    expect(firstShowing.updateSelectable).toHaveBeenCalled();    
    // ignore whether second showing is updated, since it's still selectable
    expect(thirdShowing.updateSelectable).toHaveBeenCalled();    
  });

  // canSelect

  it("returns true for 'canSelect' when showing passed as arg is the selected showing", function() {
    createAndAddMockShowings();
    timeSlot.showingSelected(secondShowing);

    var result = timeSlot.canSelect(secondShowing);
    expect(result).toBe(true);
  });

  it("returns false for 'canSelect' when the selected showing does not match argument", function() {
    createAndAddMockShowings();
    timeSlot.showingSelected(secondShowing);

    var result = timeSlot.canSelect(thirdShowing);
    expect(result).toBe(false);
  });

  it("returns true for 'canSelect' when no selected showing exists", function() {
    createAndAddMockShowings();
    expect(timeSlot.selectedShowing).toBe(null); // sanity check

    var result = timeSlot.canSelect(thirdShowing);
    expect(result).toBe(true);
  });

});