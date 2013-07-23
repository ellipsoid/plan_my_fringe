describe("Day", function() {
  var year = 2012;
  var month = 11;
  var date = 9;
  var datetime;
  var day;
  var newTimeSlot;

  beforeEach(function() {
    datetime = new Date(year, month, date, 4, 5, 36, 314);
    day = new Day(datetime);
    newTimeSlot = jasmine.createSpyObj('newTimeSlot', ['toString']);
  });

  it("should accept a datetime on initialization and remove timeOfDay information", function() {
    var trimmedDateTime = new Date(datetime.getFullYear(),
      datetime.getMonth(),
      datetime.getDate());
    expect(day.datetime).toEqual(trimmedDateTime);
  });

  it("returns true on 'includes' with datetime that is part of the day", function() {
    var newDate = new Date(datetime.getTime());
    // change the time of copied datetime
    newDate.setHours(13);
    expect(newDate).not.toEqual(datetime);
    var result = day.includes(newDate);
    expect(result).toBe(true);
  });

  it("returns false on 'includes' with datetime that is not part of the day", function() {
    var newDate = new Date(datetime.getTime());
    // change the date of copied datetime
    newDate.setDate(13);
    expect(newDate).not.toEqual(datetime);
    var result = day.includes(newDate);
    expect(result).toBe(false);
  });

  it("defaults with no time slots", function() {
    expect(day.timeSlots).toEqual([]);
  });

  it("adds a timeslot with 'addTimeSlot'", function() {
    expect(day.timeSlots).toEqual([]); // sanity check
    day.addTimeSlot(newTimeSlot);
    expect(day.timeSlots).toEqual([newTimeSlot]);
  });

  it("returns date with format 'Sun Dec 09, 2012' on toString", function() {
    expect(day.toString()).toEqual("Sun Dec 09 2012");
  });

});
