var stripTimeOfDayInfo = function(datetime) {
  var calendarDate = new Date(datetime.getFullYear(),
    datetime.getMonth(),
    datetime.getDate());
  return calendarDate;
};

function CalendarDate(datetime) {
  this.datetime = stripTimeOfDayInfo(datetime);
  this.timeSlots = [];
};

CalendarDate.prototype.includes = function(datetime) {
  var sameYear = datetime.getFullYear() === this.datetime.getFullYear();
  var sameMonth = datetime.getMonth() === this.datetime.getMonth();
  var sameDate = datetime.getDate() === this.datetime.getDate();

  return sameYear && sameMonth && sameDate;
};

CalendarDate.prototype.addTimeSlot = function(timeSlot) {
  this.timeSlots.push(timeSlot);
};
