describe("TimeOfDay", function() {
  var hours = 17;
  var minutes = 30;
  var seconds = 12; // not expected to be used, but included for consistency
  var millis = 314; // not expected to be used, but included for consistency
  var datetime;
  var timeOfDay;
  var newTimeSlot;

  beforeEach(function() {
    datetime = new Date(2012, 11, 9, hours, minutes, seconds, millis);
    timeOfDay = new TimeOfDay(datetime);
    newTimeSlot = jasmine.createSpyObj('newTimeSlot', ['toString']);
  });

  it("should accept a datetime on initialization and remove calendarDate information", function() {
    var trimmedDateTime = new Date(0, 0, 0, hours, minutes, seconds, millis);
    expect(timeOfDay.datetime).toEqual(trimmedDateTime);
  });

  it("returns true on 'includes' with datetime that has same time of day", function() {
    var newDate = new Date(datetime.getTime());
    // change the time of copied datetime
    newDate.setDate(13);
    expect(newDate).not.toEqual(datetime);

    var result = timeOfDay.includes(newDate);
    expect(result).toBe(true);
  });

  it("returns false on 'includes' with datetime that does not have same time of day", function() {
    var newDate = new Date(datetime.getTime());
    // change the date of copied datetime
    newDate.setHours(13);
    expect(newDate).not.toEqual(datetime);

    var result = timeOfDay.includes(newDate);
    expect(result).toBe(false);
  });

  it("defaults with no time slots", function() {
    expect(timeOfDay.timeSlots).toEqual([]);
  });

  it("adds a timeslot with 'addTimeSlot'", function() {
    expect(timeOfDay.timeSlots).toEqual([]); // sanity check
    timeOfDay.addTimeSlot(newTimeSlot);
    expect(timeOfDay.timeSlots).toEqual([newTimeSlot]);
  });

  it("returns time in format '5:30 PM' with 'toString()'", function() {
    expect(timeOfDay.toString()).toEqual("5:30 PM");
  });

});
