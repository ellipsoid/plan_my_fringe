describe("CalendarDate", function() {
  var year = 2012;
  var month = 11;
  var day = 9;
  var datetime;
  var calendarDate;
  var newTimeSlot;

  beforeEach(function() {
    datetime = new Date(year, month, day, 4, 5, 36, 314);
    calendarDate = new CalendarDate(datetime);
    newTimeSlot = jasmine.createSpyObj('newTimeSlot', ['toString']);
  });

  it("should accept a datetime on initialization and remove timeOfDay information", function() {
    var trimmedDateTime = new Date(datetime.getFullYear(),
      datetime.getMonth(),
      datetime.getDate());
    expect(calendarDate.datetime).toEqual(trimmedDateTime);
  });

  it("returns true on 'includes' with datetime that is part of the calendar date", function() {
    var newDate = new Date(datetime.getTime());
    // change the time of copied datetime
    newDate.setHours(13);
    expect(newDate).not.toEqual(datetime);
    var result = calendarDate.includes(newDate);
    expect(result).toBe(true);
  });

  it("returns false on 'includes' with datetime that is not part of the calendar date", function() {
    var newDate = new Date(datetime.getTime());
    // change the date of copied datetime
    newDate.setDate(13);
    expect(newDate).not.toEqual(datetime);
    var result = calendarDate.includes(newDate);
    expect(result).toBe(false);
  });

  it("defaults with no time slots", function() {
    expect(calendarDate.timeSlots).toEqual([]);
  });

  it("adds a timeslot with 'addTimeSlot'", function() {
    expect(calendarDate.timeSlots).toEqual([]); // sanity check
    calendarDate.addTimeSlot(newTimeSlot);
    expect(calendarDate.timeSlots).toEqual([newTimeSlot]);
  });

});
