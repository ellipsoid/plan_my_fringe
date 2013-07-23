describe("PerformanceDay", function() {
  var year = 2012;
  var month = 11;
  var day = 9;
  var datetime;
  var performanceDay;
  var newTimeSlot;

  beforeEach(function() {
    datetime = new Date(year, month, day, 4, 5, 36, 314);
    performanceDay = new PerformanceDay(datetime);
    newTimeSlot = jasmine.createSpyObj('newTimeSlot', ['toString']);
  });

  it("should accept a datetime on initialization and remove timeOfDay information", function() {
    var trimmedDateTime = new Date(datetime.getFullYear(),
      datetime.getMonth(),
      datetime.getDate());
    expect(performanceDay.datetime).toEqual(trimmedDateTime);
  });

  it("returns true on 'includes' with datetime that is part of the calendar date", function() {
    var newDate = new Date(datetime.getTime());
    // change the time of copied datetime
    newDate.setHours(13);
    expect(newDate).not.toEqual(datetime);
    var result = performanceDay.includes(newDate);
    expect(result).toBe(true);
  });

  it("returns false on 'includes' with datetime that is not part of the calendar date", function() {
    var newDate = new Date(datetime.getTime());
    // change the date of copied datetime
    newDate.setDate(13);
    expect(newDate).not.toEqual(datetime);
    var result = performanceDay.includes(newDate);
    expect(result).toBe(false);
  });

  it("defaults with no time slots", function() {
    expect(performanceDay.timeSlots).toEqual([]);
  });

  it("adds a timeslot with 'addTimeSlot'", function() {
    expect(performanceDay.timeSlots).toEqual([]); // sanity check
    performanceDay.addTimeSlot(newTimeSlot);
    expect(performanceDay.timeSlots).toEqual([newTimeSlot]);
  });

  it("returns date with format 'Sun Dec 09, 2012' on toString", function() {
    expect(performanceDay.toString()).toEqual("Sun Dec 09 2012");
  });

});
